import React, { createContext, useContext, useState, useEffect } from 'react';
import * as Haptics from 'expo-haptics';
import AsyncStorage from '@react-native-async-storage/async-storage';

type ThemeType = 'light' | 'dark' | 'system';

interface GlobalContextType {
  theme: ThemeType;
  isHighContrast: boolean;
  isLoggedIn: boolean;
  userName: string; // Added for username management
  setTheme: (t: ThemeType) => void;
  setHighContrast: (val: boolean) => void;
  login: (name: string) => void; // Updated to accept a name
  logout: () => void;
  hapticFeedback: (style?: Haptics.ImpactFeedbackStyle) => void;
  updateProfile: (name: string) => void; // Added for profile updates
}

export const GlobalContext = createContext<GlobalContextType | undefined>(undefined);

export const GlobalProvider = ({ children }: { children: React.ReactNode }) => {
  const [theme, setThemeState] = useState<ThemeType>('system');
  const [isHighContrast, setHighContrastState] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState(''); // Initialize username state

  useEffect(() => {
    const loadState = async () => {
      const [auth, th, hc, user] = await Promise.all([
        AsyncStorage.getItem('isLoggedIn'),
        AsyncStorage.getItem('theme'),
        AsyncStorage.getItem('highContrast'),
        AsyncStorage.getItem('userName'), // Load saved username
      ]);
      if (auth === 'true') setIsLoggedIn(true);
      if (th) setThemeState(th as ThemeType);
      if (hc) setHighContrastState(hc === 'true');
      if (user) setUserName(user);
    };
    loadState();
  }, []);

  const hapticFeedback = (style = Haptics.ImpactFeedbackStyle.Light) => {
    Haptics.impactAsync(style);
  };

  const login = async (name: string) => {
    setIsLoggedIn(true);
    setUserName(name);
    await AsyncStorage.setItem('isLoggedIn', 'true');
    await AsyncStorage.setItem('userName', name); // Persist username
    hapticFeedback(Haptics.ImpactFeedbackStyle.Medium);
  };

  const logout = async () => {
    setIsLoggedIn(false);
    setUserName('');
    await AsyncStorage.removeItem('isLoggedIn');
    await AsyncStorage.removeItem('userName'); // Clear persisted username
    hapticFeedback(Haptics.ImpactFeedbackStyle.Medium);
  };

  const updateProfile = async (name: string) => {
    setUserName(name);
    await AsyncStorage.setItem('userName', name);
    hapticFeedback(Haptics.ImpactFeedbackStyle.Light);
  };

  const setTheme = async (t: ThemeType) => {
    setThemeState(t);
    await AsyncStorage.setItem('theme', t);
  };

  const setHighContrast = async (val: boolean) => {
    setHighContrastState(val);
    await AsyncStorage.setItem('highContrast', String(val));
  };

  return (
    <GlobalContext.Provider value={{ 
      theme, 
      isHighContrast, 
      isLoggedIn, 
      userName, // Provide username
      setTheme, 
      setHighContrast, 
      login, 
      logout, 
      hapticFeedback, // Correct naming
      updateProfile // Provide update function
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