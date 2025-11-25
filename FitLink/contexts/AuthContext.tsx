import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { getAuthUser, getUserByAuthId } from '../services/repositories/userRepository';

interface AuthContextType {
  user: any | null;
  userId: number | null;
  loading: boolean;
  refreshUser: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<any | null>(null);
  const [userId, setUserId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  async function loadUser() {
    try {
      setLoading(true);
      const { user: authUser, error: authError } = await getAuthUser();

      if (authError || !authUser) {
        setUser(null);
        setUserId(null);
        return;
      }

      const { user: dbUser, error: dbError } = await getUserByAuthId(authUser.id);

      if (dbError || !dbUser) {
        setUser(authUser);
        setUserId(null);
        return;
      }

      setUser(authUser);
      setUserId(dbUser.user_id);
    } catch (err) {
      console.error('Error loading user:', err);
      setUser(null);
      setUserId(null);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadUser();
  }, []);

  return (
    <AuthContext.Provider value={{ user, userId, loading, refreshUser: loadUser }}>
      {children}
    </AuthContext.Provider>
  );
}
