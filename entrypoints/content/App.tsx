import React, { useEffect } from 'react';
import { browser } from "wxt/browser";
import ExtMessage, { MessageType } from "@/entrypoints/types.ts";

export default () => {
    useEffect(() => {
        const domLoaded = () => {
            console.log("dom loaded");
        };

        if (document.readyState === "complete") {
            domLoaded();
        } else {
            window.addEventListener('load', () => {
                console.log("content load:", window.location.href);
                domLoaded();
            });
        }

        browser.runtime.onMessage.addListener((message: ExtMessage) => {
            console.log('content:', message);
            if (message.messageType === MessageType.clickExtIcon) {
                // Handle clickExtIcon
            } else if (message.messageType === MessageType.changeLocale) {
                // Handle changeLocale
            } else if (message.messageType === MessageType.changeTheme) {
                // Handle changeTheme
            }
        });

        return () => {
            // Cleanup listener if necessary
        };
    }, []);

    return <></>;
};
