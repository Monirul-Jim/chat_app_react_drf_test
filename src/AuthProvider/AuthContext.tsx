import { createContext, useState, ReactNode } from "react";

// Define the structure of your AuthContext state
interface AuthContextType {
  user: {
    username: string;
    email: string;
  };
  setUser: (user: { username: string; email: string }) => void;
}

export const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState({
    username: "",
    email: "",
  });

  return (
    <AuthContext.Provider value={{ user, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};
