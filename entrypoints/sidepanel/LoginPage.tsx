// LoginPage.tsx
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";

export const LoginPage = ({ onLogin }: { onLogin: (email: string, password: string) => Promise<void> }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      await onLogin(email, password);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
    }
  };

  return (
    <div className="flex h-screen items-center justify-center">
      <Card className="w-[350px]">
        <CardHeader className="text-center">
          <h2 className="text-2xl font-bold">AdviserGPT Login</h2>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            {error && <p className="text-red-500 text-sm">{error}</p>}
          </form>
        </CardContent>
        <CardFooter>
          <Button type="submit" className="w-full" onClick={handleSubmit}>
            Login
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

// authService.ts
import { browser } from "wxt/browser";

export interface AuthState {
  isAuthenticated: boolean;
  user?: {
    email: string;
    // Add other user fields as needed
  };
}

export const authService = {
  async checkAuthStatus(): Promise<AuthState> {
    const data = await browser.storage.local.get('auth');
    return data.auth || { isAuthenticated: false };
  },

  async login(email: string, password: string): Promise<AuthState> {
    // Replace with your actual API call
    try {
      const authState: AuthState = {
        isAuthenticated: true,
        user: { email }
      };
      
      await browser.storage.local.set({ auth: authState });
      return authState;
    } catch (error) {
      throw new Error('Login failed. Please check your credentials.');
    }
  },

  async logout(): Promise<void> {
    await browser.storage.local.remove('auth');
  }
};