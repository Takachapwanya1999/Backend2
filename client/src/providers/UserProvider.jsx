import { createContext, useState } from 'react';

const initialState = {
  user: null,
  register: () => {},
  login: () => {},
  googleLogin: () => {},
  logout: () => {},
  loading: false,
};

export const UserContext = createContext(initialState);

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);

  // Mock users database (for demo purposes)
  const mockUsers = [
    { email: 'demo@example.com', password: 'demo123', name: 'Demo User', id: 1 },
    { email: 'test@test.com', password: 'password', name: 'Test User', id: 2 }
  ];

  const register = async (userData) => {
    try {
      setLoading(true);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Check if user already exists
      const existingUser = mockUsers.find(user => user.email === userData.email);
      if (existingUser) {
        return { success: false, message: 'User already exists with this email!' };
      }
      
      // Create new user
      const newUser = {
        id: mockUsers.length + 1,
        name: userData.name,
        email: userData.email,
        // Don't store password in real app
      };
      
      mockUsers.push({ ...userData, id: newUser.id });
      setUser(newUser);
      
      return { success: true, message: 'Registration successful!' };
    } catch (error) {
      console.error('Registration error:', error);
      return { 
        success: false, 
        message: 'Registration failed. Please try again.' 
      };
    } finally {
      setLoading(false);
    }
  };

  const login = async (credentials) => {
    try {
      setLoading(true);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Find user with matching credentials
      const foundUser = mockUsers.find(
        user => user.email === credentials.email && user.password === credentials.password
      );
      
      if (!foundUser) {
        return { 
          success: false, 
          message: 'Invalid email or password. Try demo@example.com / demo123' 
        };
      }
      
      // Set user (exclude password)
      const { password, ...userWithoutPassword } = foundUser;
      setUser(userWithoutPassword);
      
      return { success: true, message: 'Login successful!' };
    } catch (error) {
      console.error('Login error:', error);
      return { 
        success: false, 
        message: 'Login failed. Please try again.' 
      };
    } finally {
      setLoading(false);
    }
  };

  const googleLogin = async (credential) => {
    try {
      setLoading(true);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock Google login - in real app, you'd verify the credential
      const mockGoogleUser = {
        id: 999,
        name: 'Google User',
        email: 'google.user@gmail.com'
      };
      
      setUser(mockGoogleUser);
      return { success: true, message: 'Google login successful!' };
    } catch (error) {
      console.error('Google login error:', error);
      return { 
        success: false, 
        message: 'Google login failed. Please try again.' 
      };
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      setUser(null);
      return { success: true, message: 'Logged out successfully!' };
    } catch (error) {
      console.error('Logout error:', error);
      setUser(null);
      return { success: true, message: 'Logged out!' };
    }
  };

  const auth = {
    user,
    register,
    login,
    googleLogin,
    logout,
    loading,
  };

  return <UserContext.Provider value={auth}>{children}</UserContext.Provider>;
};
