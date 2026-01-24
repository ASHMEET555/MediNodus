import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import * as Haptics from 'expo-haptics';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';
// import { authService } from '@/services/auth'; // Uncomment when auth service is ready

type ThemeType = 'light' | 'dark' | 'system';

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
  userName: string;
  token: string | null;
  isLoading: boolean;
  medicalInfo: MedicalInfo;
  reports: Report[];
  
  // Actions
  setTheme: (t: ThemeType) => void;
  setHighContrast: (val: boolean) => void;
  updateProfile: (name: string) => void;
  updateMedicalInfo: (info: Partial<MedicalInfo>) => void;
  saveReport: (reportData: Omit<Report, 'id' | 'date'>) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  hapticFeedback: (style?: Haptics.ImpactFeedbackStyle) => void;
}

// Export Context for the Provider
export const GlobalContext = createContext<GlobalContextType | undefined>(undefined);

export const GlobalProvider = ({ children }: { children: ReactNode }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [theme, setThemeState] = useState<ThemeType>('system');
  const [isHighContrast, setHighContrastState] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState('');
  const [token, setToken] = useState<string | null>(null);
  const [reports, setReports] = useState<Report[]>([]);
  const [medicalInfo, setMedicalInfoState] = useState<MedicalInfo>({
    conditions: '', allergies: '', medications: ''
  });

  useEffect(() => {
    const loadState = async () => {
      try {
        const [auth, savedToken, th, hc, user, med, savedReports] = await Promise.all([
          AsyncStorage.getItem('isLoggedIn'),
          AsyncStorage.getItem('userToken'),
          AsyncStorage.getItem('theme'),
          AsyncStorage.getItem('highContrast'),
          AsyncStorage.getItem('userName'),
          AsyncStorage.getItem('medicalInfo'),
          AsyncStorage.getItem('reports')
        ]);

        if (auth === 'true' && savedToken) {
          setIsLoggedIn(true);
          setToken(savedToken);
          if (user) setUserName(user);
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

  const hapticFeedback = (style = Haptics.ImpactFeedbackStyle.Light) => {
    if (Platform.OS !== 'web') Haptics.impactAsync(style);
  };

  const login = async (email: string, password: string) => {
    // const data = await authService.login(email, password); // Use real service later
    const mockToken = "mock-jwt-token";
    setToken(mockToken);
    setIsLoggedIn(true);
    setUserName(email.split('@')[0]);
    await AsyncStorage.setItem('isLoggedIn', 'true');
    await AsyncStorage.setItem('userToken', mockToken);
    await AsyncStorage.setItem('userName', email.split('@')[0]);
    hapticFeedback(Haptics.ImpactFeedbackStyle.Medium);
  };

  const logout = async () => {
    setIsLoggedIn(false);
    setUserName('');
    setToken(null);
    await AsyncStorage.multiRemove(['isLoggedIn', 'userToken', 'userName']);
    hapticFeedback(Haptics.ImpactFeedbackStyle.Medium);
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
    setUserName(name);
    AsyncStorage.setItem('userName', name);
  };

  const updateMedicalInfo = (info: Partial<MedicalInfo>) => {
    const updated = { ...medicalInfo, ...info };
    setMedicalInfoState(updated);
    AsyncStorage.setItem('medicalInfo', JSON.stringify(updated));
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
      theme, isHighContrast, isLoggedIn, userName, token, isLoading,
      medicalInfo, reports,
      setTheme, setHighContrast, login, logout, updateProfile,
      updateMedicalInfo, saveReport, hapticFeedback
    }}>
      {children}
    </GlobalContext.Provider>
  );
};

// Hook to access the state
export const useGlobalState = () => {
  const context = useContext(GlobalContext);
  if (!context) throw new Error("useGlobalState must be used within GlobalProvider");
  return context;
};