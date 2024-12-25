export enum MessageType {
    clickExtIcon = "clickExtIcon",
    changeTheme = "changeTheme",
    changeLocale = "changeLocale",
    textSelected = "textSelected"
}

export enum MessageFrom {
    contentScript = "contentScript",
    background = "background",
    popUp = "popUp",
    sidePanel = "sidePanel",
}

class ExtMessage {
    content?: string;
    from?: MessageFrom;

    constructor(messageType: MessageType) {
        this.messageType = messageType;
    }

    messageType: MessageType;
}

export interface TextSelectionMessage extends ExtMessage {
    messageType: MessageType.textSelected;
    data: {
        text: string;
        url: string;
        timestamp: string;
        title: string;
    };
}

export default ExtMessage;
