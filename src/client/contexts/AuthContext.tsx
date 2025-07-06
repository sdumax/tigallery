import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import api from "../lib/api";

interface User {
  id: number;
  email: string;
  username: string;
  createdAt: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (
    email: string,
    username: string,
    password: string
  ) => Promise<void>;
  logout: () => void;
  refreshToken: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize auth state from localStorage
  useEffect(() => {
    const storedToken = localStorage.getItem("auth_token");
    const storedUser = localStorage.getItem("auth_user");

    if (storedToken && storedUser) {
      try {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
        // Set token in API headers
        api.defaults.headers.common["Authorization"] = `Bearer ${storedToken}`;
      } catch (error) {
        console.error("Failed to parse stored user data:", error);
        localStorage.removeItem("auth_token");
        localStorage.removeItem("auth_user");
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<void> => {
    try {
      const response = await api.post("/auth/login", { email, password });
      const { user: userData, token: userToken } = response.data;

      setUser(userData);
      setToken(userToken);

      // Store in localStorage
      localStorage.setItem("auth_token", userToken);
      localStorage.setItem("auth_user", JSON.stringify(userData));

      // Set token in API headers
      api.defaults.headers.common["Authorization"] = `Bearer ${userToken}`;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || "Login failed");
    }
  };

  const register = async (
    email: string,
    username: string,
    password: string
  ): Promise<void> => {
    try {
      const response = await api.post("/auth/register", {
        email,
        username,
        password,
      });
      const { user: userData, token: userToken } = response.data;

      setUser(userData);
      setToken(userToken);

      // Store in localStorage
      localStorage.setItem("auth_token", userToken);
      localStorage.setItem("auth_user", JSON.stringify(userData));

      // Set token in API headers
      api.defaults.headers.common["Authorization"] = `Bearer ${userToken}`;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || "Registration failed");
    }
  };

  const logout = (): void => {
    setUser(null);
    setToken(null);

    // Remove from localStorage
    localStorage.removeItem("auth_token");
    localStorage.removeItem("auth_user");

    // Remove token from API headers
    delete api.defaults.headers.common["Authorization"];
  };

  const refreshToken = async (): Promise<void> => {
    try {
      const response = await api.post("/auth/refresh");
      const { token: newToken } = response.data;

      setToken(newToken);
      localStorage.setItem("auth_token", newToken);
      api.defaults.headers.common["Authorization"] = `Bearer ${newToken}`;
    } catch (error) {
      // If refresh fails, logout user
      logout();
      throw new Error("Session expired. Please log in again.");
    }
  };

  const value: AuthContextType = {
    user,
    token,
    isLoading,
    isAuthenticated: !!user && !!token,
    login,
    register,
    logout,
    refreshToken,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
