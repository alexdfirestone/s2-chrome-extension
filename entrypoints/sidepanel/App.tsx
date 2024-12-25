import React, { useEffect, useState } from 'react';
import './App.module.css';
import '../../assets/main.css'
import { browser } from "wxt/browser";
import ExtMessage, { MessageType } from "@/entrypoints/types.ts";
import { LoginPage } from './Auth/LoginPage';
import { authService, AuthState } from './Auth/authService';
import SmartAssistant from './SmartAssistant';
import HighlightedText from './SmartAssistant/components/HighlightedText';

export default () => {
    const [authState, setAuthState] = useState<AuthState>({ isAuthenticated: false });
    const [isLoading, setIsLoading] = useState(true);


    useEffect(() => {
        const init = async () => {
            try {
                const authStatus = await authService.checkAuthStatus();
                setAuthState(authStatus);
            } catch (error) {
                console.error('Initialization failed:', error);
            } finally {
                setIsLoading(false);
            }
        };

        init();

        browser.runtime.onMessage.addListener((message: ExtMessage, sender, sendResponse) => {
            console.log('sidepanel:')
            console.log(message)
            if (message.messageType == MessageType.changeLocale) {
                //i18n.changeLanguage(message.content)
            } else if (message.messageType == MessageType.changeTheme) {
                //toggleTheme(message.content)
            }
        });
    }, []);

    const handleLogin = async (email: string, password: string) => {
        try {
            const authStatus = await authService.login(email, password);
            setAuthState(authStatus);
        } catch (error) {
            throw error;
        }
    };

    if (isLoading) {
        return <div className="flex h-screen items-center justify-center">Loading...</div>;
    }

    if (!authState.isAuthenticated) {
        return <LoginPage onLogin={handleLogin} />;
    }

    return (
        <div>
            <main className="h-[calc(100vh-64px)] pt-2">
                <SmartAssistant />
            </main>
        </div>
    );
};