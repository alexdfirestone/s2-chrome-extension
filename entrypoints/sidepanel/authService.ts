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
    return data.auth || { isAuthenticated: false };
  },

  async login(email: string, password: string): Promise<AuthState> {
    try {
      console.log('hi')
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

  async logout(): Promise<void> {
    await browser.storage.local.remove('auth');
  }
};