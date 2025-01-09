// authService.ts
import { browser } from "wxt/browser";
import { createSupabaseClient } from "@/supabase/client";

export interface AuthState {
  isAuthenticated: boolean;
  user?: {
    email: string;
    access_token?: string;
    refresh_token?: string;
  };
}

export const authService = {
  async checkAuthStatus(): Promise<AuthState> {
    const data = await browser.storage.local.get('auth');
    console.log('Stored auth state:', data.auth);
    return data.auth || { isAuthenticated: false };
  },

  async login(email: string, password: string): Promise<AuthState> {
    try {
      const supabase = createSupabaseClient();
      console.log(supabase)
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      console.log('Supabase auth response:', data);

      if (error) throw new Error(error.message);

      const authState: AuthState = {
        isAuthenticated: true,
        user: {
          email,
          access_token: data.session?.access_token,
          refresh_token: data.session?.refresh_token,
        }
      };
      
      await browser.storage.local.set({ auth: authState });
      return authState;
    } catch (error) {
      console.error('Login error:', error);
      throw new Error('Login failed. Please check your credentials.');
    }
  },

  async loginWithBiometric(): Promise<AuthState> {
    try {
      // You would typically verify the biometric credential with your backend here
      const authState: AuthState = {
        isAuthenticated: true,
        user: { email: 'biometric-user' } // You might want to get the actual user info from storage
      };
      
      await browser.storage.local.set({ auth: authState });
      return authState;
    } catch (error) {
      throw new Error('Biometric authentication failed.');
    }
  },

  async logout(): Promise<void> {
    await browser.storage.local.remove('auth');
  },

  async refreshSession(refresh_token: string): Promise<AuthState> {
    try {
      console.log('Attempting to refresh session with token:', refresh_token);
      const supabase = createSupabaseClient();
      
      // Log current session state before refresh
      const currentSession = await supabase.auth.getSession();
      console.log('Current Supabase session before refresh:', currentSession);

      const { data, error } = await supabase.auth.refreshSession({
        refresh_token
      });

      console.log('Refresh session response:', { data, error });

      if (error) throw error;

      if (!data.session) {
        console.log('No session data after refresh, logging out');
        await this.logout();
        return { isAuthenticated: false };
      }

      const authState: AuthState = {
        isAuthenticated: true,
        user: {
          email: data.user?.email ?? '',
          access_token: data.session.access_token,
          refresh_token: data.session.refresh_token,
        }
      };

      await browser.storage.local.set({ auth: authState });
      console.log('Updated auth state after refresh:', authState);
      return authState;
    } catch (error) {
      console.error('Session refresh failed:', error);
      await this.logout();
      return { isAuthenticated: false };
    }
  },
};