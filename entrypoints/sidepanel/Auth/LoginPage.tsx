// LoginPage.tsx
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";

export const LoginPage = ({ onLogin }: { onLogin: (email: string, password: string) => Promise<void> }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isBiometricAvailable, setIsBiometricAvailable] = useState(false);

  useEffect(() => {
    // Check if WebAuthn is supported
    const checkBiometricSupport = async () => {
      if (window.PublicKeyCredential) {
        try {
          const available = await PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable();
          setIsBiometricAvailable(available);
        } catch (error) {
          console.error('Error checking biometric support:', error);
        }
      }
    };
    
    checkBiometricSupport();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    try {
      await onLogin(email, password);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleBiometricLogin = async () => {
    setError('');
    setIsLoading(true);
    try {
      const credential = await navigator.credentials.get({
        publicKey: {
          challenge: new Uint8Array(32),
          rpId: window.location.hostname,
          userVerification: 'preferred',
        }
      });
      
      if (credential) {
        // Pass a special flag to indicate biometric auth
        await onLogin('biometric', 'biometric');
      }
    } catch (err) {
      setError('Biometric authentication failed');
    } finally {
      setIsLoading(false);
    }
  }

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
            {/* {isBiometricAvailable && (
              <Button 
                type="button" 
                variant="outline" 
                className="w-full"
                onClick={handleBiometricLogin}
                disabled={isLoading}
              >
                Login with Touch ID
              </Button>
            )} */}
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Logging in..." : "Login"}
            </Button>
          </form>
        </CardContent>
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
    try {
      // Clear the auth state from storage
      await browser.storage.local.remove('auth');
      
      // You might want to perform additional cleanup here, such as:
      // - Clearing other stored data
      // - Revoking tokens
      // - Making API calls to backend logout endpoints
      
    } catch (error) {
      throw new Error('Logout failed. Please try again.');
    }
  }
};