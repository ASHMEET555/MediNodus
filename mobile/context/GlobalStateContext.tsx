import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import * as Haptics from 'expo-haptics';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';
import { authService } from '../services/auth';
import { apiService } from '../services/api'; // Import API Service

type ThemeType = 'light' | 'dark' | 'system';

export interface User {
  name: string;
  email: string;
}

interface MedicalInfo {
  conditions: string;
  allergies: string;
  medications: string;
}

interface Report {
  id: string;
  date: string;
  title: string;
  status: 'safe' | 'warning' | 'danger';
  summary: string;
  details: any[];
  images: string[];
}

interface GlobalContextType {
  theme: ThemeType;
  isHighContrast: boolean;
  isLoggedIn: boolean;
  user: User | null;
  token: string | null;
  isLoading: boolean;
  medicalInfo: MedicalInfo;
  reports: Report[];
  
  setTheme: (t: ThemeType) => void;
  setHighContrast: (val: boolean) => void;
  updateProfile: (name: string) => void;
  updateMedicalInfo: (info: Partial<MedicalInfo>) => void;
  saveReport: (reportData: Omit<Report, 'id' | 'date'>) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, fullName: string) => Promise<void>;
  logout: () => Promise<void>;
  hapticFeedback: (style?: Haptics.ImpactFeedbackStyle) => void;
}

export const GlobalContext = createContext<GlobalContextType | undefined>(undefined);

export const GlobalProvider = ({ children }: { children: ReactNode }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [theme, setThemeState] = useState<ThemeType>('system');
  const [isHighContrast, setHighContrastState] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [reports, setReports] = useState<Report[]>([]);
  const [medicalInfo, setMedicalInfoState] = useState<MedicalInfo>({
    conditions: '', allergies: '', medications: ''
  });

  // 1. Load Local State
  useEffect(() => {
    const loadState = async () => {
      try {
        const [auth, savedToken, th, hc, savedUserStr, med, savedReports] = await Promise.all([
          AsyncStorage.getItem('isLoggedIn'),
          AsyncStorage.getItem('userToken'),
          AsyncStorage.getItem('theme'),
          AsyncStorage.getItem('highContrast'),
          AsyncStorage.getItem('user'),
          AsyncStorage.getItem('medicalInfo'),
          AsyncStorage.getItem('reports')
        ]);

        if (auth === 'true' && savedToken) {
          setIsLoggedIn(true);
          setToken(savedToken);
          if (savedUserStr) setUser(JSON.parse(savedUserStr));
        }
        if (th) setThemeState(th as ThemeType);
        if (hc) setHighContrastState(hc === 'true');
        if (med) setMedicalInfoState(JSON.parse(med));
        if (savedReports) setReports(JSON.parse(savedReports));

      } catch (e) {
        console.error("Failed to load global state", e);
      } finally {
        setIsLoading(false);
      }
    };
    loadState();
  }, []);

  // 2. Fetch Remote Medical Data when Token changes (Login/Load)
  useEffect(() => {
    const fetchRemoteData = async () => {
      if (token && isLoggedIn) {
        try {
          const data = await apiService.getMedicalHistory(token);
          // Map Backend -> Frontend
          const mappedInfo = {
            conditions: data.chronic_condition || '',
            allergies: data.allergy || '',
            medications: data.current_medication || ''
          };
          setMedicalInfoState(mappedInfo);
          AsyncStorage.setItem('medicalInfo', JSON.stringify(mappedInfo));
        } catch (e) {
          console.log("Could not fetch remote medical history (might be empty).");
        }
      }
    };
    fetchRemoteData();
  }, [token, isLoggedIn]);

  const hapticFeedback = (style = Haptics.ImpactFeedbackStyle.Light) => {
    if (Platform.OS !== 'web') Haptics.impactAsync(style);
  };

  const login = async (email: string, password: string) => {
    const data = await authService.login(email, password);
    const accessToken = data.access_token;
    
    const newUser: User = {
      name: email.split('@')[0],
      email: email
    };

    setToken(accessToken);
    setIsLoggedIn(true);
    setUser(newUser);

    await AsyncStorage.setItem('isLoggedIn', 'true');
    await AsyncStorage.setItem('userToken', accessToken);
    await AsyncStorage.setItem('user', JSON.stringify(newUser));
    
    hapticFeedback(Haptics.ImpactFeedbackStyle.Medium);
  };

  const register = async (email: string, password: string, fullName: string) => {
    await authService.register(email, password, fullName);
    const data = await authService.login(email, password);
    const accessToken = data.access_token;

    const newUser: User = { name: fullName, email };
    
    setToken(accessToken);
    setIsLoggedIn(true);
    setUser(newUser);

    await AsyncStorage.setItem('isLoggedIn', 'true');
    await AsyncStorage.setItem('userToken', accessToken);
    await AsyncStorage.setItem('user', JSON.stringify(newUser));

    hapticFeedback(Haptics.ImpactFeedbackStyle.Medium);
  };

  const logout = async () => {
    if (token) {
      try {
        await authService.logout(token);
      } catch (e) { console.log(e); }
    }
    setToken(null);
    setUser(null);
    setIsLoggedIn(false);
    // Clear sensitive info on logout
    setMedicalInfoState({ conditions: '', allergies: '', medications: '' });
  };

  const setTheme = (t: ThemeType) => {
    setThemeState(t);
    AsyncStorage.setItem('theme', t);
  };

  const setHighContrast = (val: boolean) => {
    setHighContrastState(val);
    AsyncStorage.setItem('highContrast', String(val));
  };

  const updateProfile = (name: string) => {
    if (user) {
      const updatedUser = { ...user, name };
      setUser(updatedUser);
      AsyncStorage.setItem('user', JSON.stringify(updatedUser));
    }
  };

  // 3. Update Medical Info (Syncs to Backend)
  const updateMedicalInfo = async (info: Partial<MedicalInfo>) => {
    const updated = { ...medicalInfo, ...info };
    setMedicalInfoState(updated);
    
    // Save locally
    await AsyncStorage.setItem('medicalInfo', JSON.stringify(updated));

    // Sync to Backend
    if (token) {
      try {
        // Map Frontend -> Backend
        await apiService.updateMedicalHistory(token, {
          chronic_condition: updated.conditions,
          allergy: updated.allergies,
          current_medication: updated.medications
        });
        console.log("Medical history synced to backend");
      } catch (error) {
        console.error("Failed to sync medical history:", error);
      }
    }
  };

  const saveReport = async (reportData: Omit<Report, 'id' | 'date'>) => {
    const newReport: Report = {
      ...reportData,
      id: Date.now().toString(),
      date: new Date().toLocaleDateString(),
    };
    const updated = [newReport, ...reports];
    setReports(updated);
    await AsyncStorage.setItem('reports', JSON.stringify(updated));
    hapticFeedback();
  };

  return (
    <GlobalContext.Provider value={{
      theme, isHighContrast, isLoggedIn, user, token, isLoading,
      medicalInfo, reports,
      setTheme, setHighContrast, login, register, logout, updateProfile,
      updateMedicalInfo, saveReport, hapticFeedback
    }}>
      {children}
    </GlobalContext.Provider>
  );
};

export const useGlobalState = () => {
  const context = useContext(GlobalContext);
  if (!context) throw new Error("useGlobalState must be used within GlobalProvider");
  return context;
};