import { browser } from "wxt/browser";
import ExtMessage, { MessageFrom, MessageType,TextSelectionMessage  } from "@/entrypoints/types.ts";



export default defineBackground(() => {
    console.log('Hello background!', {id: browser.runtime.id});

    //@ts-ignore
    browser.sidePanel.setPanelBehavior({openPanelOnActionClick: true}).catch((error: any) => console.error(error));

    browser.action.onClicked.addListener((tab) => {
        console.log("click icon", tab);
        browser.tabs.sendMessage(tab.id!, {messageType: MessageType.clickExtIcon});
    });

    browser.runtime.onMessage.addListener(async (message: ExtMessage | TextSelectionMessage, sender, sendResponse: (message: any) => void) => {
        console.log("background:", message);

        switch (message.messageType) {
            case MessageType.clickExtIcon:
                console.log(message);
                return true;

            case MessageType.changeTheme:
            case MessageType.changeLocale:
                let tabs = await browser.tabs.query({active: true, currentWindow: true});
                console.log(`tabs:${tabs.length}`);
                if (tabs) {
                    for (const tab of tabs) {
                        await browser.tabs.sendMessage(tab.id!, message);
                    }
                }
                break;

            case MessageType.textSelected:
                try {
                    const textMessage = message as TextSelectionMessage;
                    const sidePanelPort = await browser.runtime.connect({ name: 'sidepanel' });
                    
                    sidePanelPort.postMessage({
                        messageType: MessageType.textSelected,
                        messageFrom: MessageFrom.background,
                        data: textMessage.data
                    });

                    // Close the connection after sending
                    sidePanelPort.disconnect();
                    
                    // Send response back to content script
                    sendResponse({ success: true });
                } catch (error) {
                    console.error('Error forwarding text selection:', error);
                    sendResponse({ success: false, error });
                }
                return true; // Keep the message channel open for async response
        }
    });
});