import { createContext, useContext, useState, useEffect, ReactNode } from "react";

type AuthContextType = {
  token: string | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  login: (password: string) => Promise<{ success: boolean; token?: string; error?: string; isAdmin?: boolean }>;
  logout: () => void;
  isLoading: boolean;
};

const AuthContext = createContext<AuthContextType>({
  token: null,
  isAuthenticated: false,
  isAdmin: false,
  login: async () => ({ success: false }),
  logout: () => {},
  isLoading: true,
});

const TOKEN_KEY = "whatsapp_web_token";
const ADMIN_KEY = "whatsapp_web_is_admin";
const DEFAULT_PASSWORD = "123456"; // TODO: Remove when API is connected
const ADMIN_PASSWORD = "65432"; // Admin password

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for existing token on mount
    const storedToken = localStorage.getItem(TOKEN_KEY);
    const storedIsAdmin = localStorage.getItem(ADMIN_KEY) === "true";
    if (storedToken) {
      setToken(storedToken);
      setIsAdmin(storedIsAdmin);
    }
    setIsLoading(false);
  }, []);

  const login = async (password: string): Promise<{ success: boolean; token?: string; error?: string; isAdmin?: boolean }> => {
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
      //   const isAdmin = data.isAdmin || false;
      //   localStorage.setItem(TOKEN_KEY, token);
      //   localStorage.setItem(ADMIN_KEY, isAdmin.toString());
      //   setToken(token);
      //   setIsAdmin(isAdmin);
      //   return { success: true, token, isAdmin };
      // }
      // return { success: false, error: data.message };

      // Temporary: Simple password check
      if (password === ADMIN_PASSWORD) {
        const mockToken = `admin_token_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        localStorage.setItem(TOKEN_KEY, mockToken);
        localStorage.setItem(ADMIN_KEY, "true");
        setToken(mockToken);
        setIsAdmin(true);
        return { success: true, token: mockToken, isAdmin: true };
      }

      if (password === DEFAULT_PASSWORD) {
        const mockToken = `token_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        localStorage.setItem(TOKEN_KEY, mockToken);
        localStorage.setItem(ADMIN_KEY, "false");
        setToken(mockToken);
        setIsAdmin(false);
        return { success: true, token: mockToken, isAdmin: false };
      }

      return { success: false, error: "Invalid password" };
    } catch (error) {
      console.error("Login error:", error);
      return { success: false, error: "An error occurred during login" };
    }
  };

  const logout = () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(ADMIN_KEY);
    setToken(null);
    setIsAdmin(false);
  };

  return (
    <AuthContext.Provider
      value={{
        token,
        isAuthenticated: !!token,
        isAdmin,
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


