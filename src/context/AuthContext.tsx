import React, { createContext, useContext, useState, ReactNode } from 'react';
import { supabase } from '../lib/supabase';

interface User {
  id: string;
  name: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signup: (email: string, password: string, name: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  isAuthenticated: boolean;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Helper function to get or create user profile
  const getOrCreateProfile = async (userId: string, email: string, name?: string) => {
    try {
      // Check if Supabase is configured
      if (!import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_ANON_KEY) {
        console.error('Supabase not configured');
        return null;
      }

      // First try to get existing profile
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle();

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching profile:', error);
        return null;
      }

      // If profile exists, return it
      if (profile) {
        return profile;
      }

      // If no profile exists, create one
      const displayName = name || email.split('@')[0];
      console.log('Creating new profile for user:', userId, 'with name:', displayName);
      
      const { data: newProfile, error: createError } = await supabase
        .from('profiles')
        .insert({
          id: userId,
          email: email,
          name: displayName
        })
        .select()
        .single();

      if (createError) {
        console.error('Error creating profile:', createError.message, createError.details);
        
        // If it's a duplicate key error, try to fetch the existing profile
        if (createError.code === '23505') {
          console.log('Profile already exists, fetching existing profile...');
          // Change from console.error to console.warn for duplicate key - this is expected behavior
          const { data: existingProfile, error: fetchError } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', userId)
            .single();
            
          if (fetchError) {
            console.error('Error fetching existing profile:', fetchError);
            return null;
          }
          
          console.warn('Duplicate profile creation attempted but handled gracefully:', existingProfile);
          return existingProfile;
        }
        
        // If it's a foreign key constraint error, the user might not exist in auth.users yet
        if (createError.code === '23503') {
          console.log('User not found in auth.users, waiting for auth to complete...');
          return null;
        }
        return null;
      }

      console.log('Profile created successfully:', newProfile);
      return newProfile;
    } catch (error) {
      console.error('Error in getOrCreateProfile:', error);
      return null;
    }
  };

  // Check for existing session on mount
  React.useEffect(() => {
    const checkSession = async () => {
      try {
        console.log('Checking existing session...');
        const { data: { session } } = await supabase.auth.getSession();
        console.log('Session found:', !!session);
        
        if (session?.user) {
          console.log('User found in session:', session.user.id);
          const profile = await getOrCreateProfile(
            session.user.id,
            session.user.email || '',
            session.user.user_metadata?.name
          );
          
          if (profile) {
            console.log('Setting user from session:', profile);
            setUser({
              id: profile.id,
              name: profile.name,
              email: profile.email
            });
          } else {
            console.log('No profile found for user');
          }
        }
      } catch (error) {
        console.error('Error checking session:', error);
      } finally {
        setLoading(false);
      }
    };

    checkSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth state changed:', event, !!session);
      
      if (event === 'SIGNED_IN' && session?.user) {
        console.log('User signed in:', session.user.id);
        
        // Wait a bit for the user to be properly created in the database
        setTimeout(async () => {
          const profile = await getOrCreateProfile(
            session.user.id,
            session.user.email || '',
            session.user.user_metadata?.name
          );
          
          if (profile) {
            console.log('Setting user from auth change:', profile);
            setUser({
              id: profile.id,
              name: profile.name,
              email: profile.email
            });
          } else {
            console.log('Failed to create/get profile, retrying...');
            // Retry after another delay
            setTimeout(async () => {
              const retryProfile = await getOrCreateProfile(
                session.user.id,
                session.user.email || '',
                session.user.user_metadata?.name
              );
              if (retryProfile) {
                setUser({
                  id: retryProfile.id,
                  name: retryProfile.name,
                  email: retryProfile.email
                });
              }
            }, 2000);
          }
        }, 1000);
      } else if (event === 'SIGNED_OUT') {
        console.log('User signed out');
        setUser(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    try {
      setLoading(true);
      console.log('Attempting login for:', email);
      
      // Check if Supabase is configured
      if (!import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_ANON_KEY) {
        return { success: false, error: 'Supabase is not configured. Please connect to Supabase first.' };
      }
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        console.error('Login error:', error);
        // Provide more helpful error messages for common issues
        if (error.message.includes('Invalid login credentials')) {
          return { success: false, error: 'Invalid email or password. Please check your credentials and try again.' };
        }
        if (error.message.includes('Email not confirmed')) {
          return { success: false, error: 'Please check your email and confirm your account before signing in.' };
        }
        if (error.message.includes('Network request failed')) {
          return { success: false, error: 'Network error. Please check your internet connection and try again.' };
        }
        return { success: false, error: error.message };
      }

      if (data.user) {
        console.log('Login successful for user:', data.user.id);
        return { success: true };
      } else {
        return { success: false, error: 'Login failed. Please try again.' };
      }
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: 'An unexpected error occurred during login. Please try again.' };
    } finally {
      setLoading(false);
    }
  };

  const signup = async (email: string, password: string, name: string): Promise<{ success: boolean; error?: string }> => {
    try {
      setLoading(true);
      console.log('Attempting signup for:', email, 'with name:', name);
      
      // Check if Supabase is configured
      if (!import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_ANON_KEY) {
        return { success: false, error: 'Supabase is not configured. Please connect to Supabase first.' };
      }
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name: name
          },
          emailRedirectTo: undefined // Disable email confirmation
        }
      });

      if (error) {
        console.error('Signup error:', error);
        // Provide more helpful error messages for common issues
        if (error.message.includes('User already registered') || error.message.includes('user_already_exists')) {
          return { success: false, error: 'An account with this email already exists. Please use the login page to sign in with your existing credentials.' };
        }
        if (error.message.includes('Password should be at least')) {
          return { success: false, error: 'Password must be at least 6 characters long.' };
        }
        return { success: false, error: error.message };
      }

      if (data.user) {
        console.log('Signup successful for user:', data.user.id);
        // The auth state change listener will handle profile creation
        return { success: true };
      } else {
        return { success: false, error: 'Signup failed. Please try again.' };
      }
    } catch (error) {
      // Handle cases where Supabase throws an exception instead of returning an error object
      const errorMessage = error instanceof Error ? error.message : String(error);
      console.error('Signup exception:', errorMessage);
      
      // Check for user already exists error in the exception message
      if (errorMessage.includes('User already registered') || 
          errorMessage.includes('user_already_exists') ||
          errorMessage.includes('user_already_exists')) {
        return { success: false, error: 'An account with this email already exists. Please use the login page to sign in with your existing credentials.' };
      }
      
      // Check for password requirements
      if (errorMessage.includes('Password should be at least')) {
        return { success: false, error: 'Password must be at least 6 characters long.' };
      }
      
      return { success: false, error: 'An unexpected error occurred during signup' };
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const value = {
    user,
    login,
    signup,
    logout,
    isAuthenticated: !!user,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};