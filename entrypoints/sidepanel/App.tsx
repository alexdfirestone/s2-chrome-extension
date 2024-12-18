import React, { useEffect, useState } from 'react';
import './App.module.css';
import '../../assets/main.css'
import { browser } from "wxt/browser";
import ExtMessage, { MessageType } from "@/entrypoints/types.ts";
import { useTheme } from "@/components/theme-provider.tsx";
import { useTranslation } from 'react-i18next';
import Header from "@/entrypoints/sidepanel/header.tsx";
import { LoginPage } from './LoginPage';
import { authService, AuthState } from './authService';
import { AiPromptBox } from './prompt-box';

export default () => {
    const [headTitle, setHeadTitle] = useState("AdviserGPT");
    const { theme, toggleTheme } = useTheme();
    const { t, i18n } = useTranslation();
    const [authState, setAuthState] = useState<AuthState>({ isAuthenticated: false });
    const [isLoading, setIsLoading] = useState(true);

    async function initI18n() {
        let data = await browser.storage.local.get('i18n');
        if (data.i18n) {
            await i18n.changeLanguage(data.i18n)
        }
    }

    useEffect(() => {
        const init = async () => {
            try {
                const authStatus = await authService.checkAuthStatus();
                setAuthState(authStatus);
                await initI18n();
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
                i18n.changeLanguage(message.content)
            } else if (message.messageType == MessageType.changeTheme) {
                toggleTheme(message.content)
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
        <div className={theme}>
            <div className="fixed top-0 right-0 h-screen w-full bg-background z-[1000000000000]">
                <Header headTitle={headTitle} />
                <main className="h-[calc(100vh-64px)] p-4">
                    <AiPromptBox />
                </main>
            </div>
        </div>
    );
};