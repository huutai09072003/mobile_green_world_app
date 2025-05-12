import React, {
  createContext,
  ReactNode,
  useContext,
  useState,
} from 'react';

type User = {
  id: number;
  name: string;
  email: string;
  location?: string;
  points: number | 0;
  role: 'user' | 'admin';
  recycling_goal?: number;
  unread_notifications_count?: number;
};

type UserContextType = {
  user: User | null;
  login: (userData: User) => void;
  logout: () => void;
  setUser: (userData: User | null) => void;
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  const login = (userData: User) => {
    setUser(userData);
    // Optionally save token to storage here
  };

  const logout = () => {
    setUser(null);
    // Optionally remove token from storage here
  };

  return (
    <UserContext.Provider value={{ user, login, logout, setUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = (): UserContextType => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};
