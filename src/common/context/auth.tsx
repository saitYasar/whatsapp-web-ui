import { createContext, useContext, useState, useEffect, ReactNode } from "react";

type AuthContextType = {
  token: string | null;
  isAuthenticated: boolean;
  login: (password: string) => Promise<{ success: boolean; token?: string; error?: string }>;
  logout: () => void;
  isLoading: boolean;
};

const AuthContext = createContext<AuthContextType>({
  token: null,
  isAuthenticated: false,
  login: async () => ({ success: false }),
  logout: () => {},
  isLoading: true,
});

const TOKEN_KEY = "whatsapp_web_token";
const DEFAULT_PASSWORD = "123456"; // TODO: Remove when API is connected

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for existing token on mount
    const storedToken = localStorage.getItem(TOKEN_KEY);
    if (storedToken) {
      setToken(storedToken);
    }
    setIsLoading(false);
  }, []);

  const login = async (password: string): Promise<{ success: boolean; token?: string; error?: string }> => {
    try {
      // TODO: Replace with actual API call
      // const response = await fetch('/api/auth/login', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ password })
      // });
      // const data = await response.json();
      // if (data.success) {
      //   const token = data.token;
      //   localStorage.setItem(TOKEN_KEY, token);
      //   setToken(token);
      //   return { success: true, token };
      // }
      // return { success: false, error: data.message };

      // Temporary: Simple password check
      if (password === DEFAULT_PASSWORD) {
        const mockToken = `token_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        localStorage.setItem(TOKEN_KEY, mockToken);
        setToken(mockToken);
        return { success: true, token: mockToken };
      }

      return { success: false, error: "Invalid password" };
    } catch (error) {
      console.error("Login error:", error);
      return { success: false, error: "An error occurred during login" };
    }
  };

  const logout = () => {
    localStorage.removeItem(TOKEN_KEY);
    setToken(null);
  };

  return (
    <AuthContext.Provider
      value={{
        token,
        isAuthenticated: !!token,
        login,
        logout,
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};


