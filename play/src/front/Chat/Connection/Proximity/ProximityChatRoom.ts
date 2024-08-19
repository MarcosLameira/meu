import { MapStore, SearchableArrayStore } from "@workadventure/store-utils";
import { Readable, Writable, get, writable } from "svelte/store";
import { v4 as uuidv4 } from "uuid";
import { AvailabilityStatus } from "@workadventure/messages";
import {
    ChatMessage,
    ChatMessageContent,
    ChatMessageReaction,
    ChatMessageType,
    ChatRoom,
    ChatRoomMembership,
    ChatUser,
} from "../ChatConnection";
import LL from "../../../../i18n/i18n-svelte";
import { gameManager } from "../../../Phaser/Game/GameManager";
import { iframeListener } from "../../../Api/IframeListener";
import { ProximityChatConnection } from "./ProximityChatConnection";

export class ProximityChatMessage implements ChatMessage {
    isQuotedMessage = undefined;
    quotedMessage = undefined;
    isDeleted = writable(false);
    isModified = writable(false);

    constructor(
        public id: string,
        public sender: ChatUser,
        public content: Readable<ChatMessageContent>,
        public date: Date,
        public isMyMessage: boolean,
        public type: ChatMessageType
    ) {}

    remove(): void {
        console.info("Function not implemented.");
    }
    edit(newContent: string): Promise<void> {
        console.info("Function not implemented.", newContent);
        return Promise.resolve();
    }
    addReaction(reaction: string): Promise<void> {
        console.info("Function not implemented.", reaction);
        return Promise.resolve();
    }
}

export class ProximityChatRoom implements ChatRoom {
    id = "proximity";
    name = writable("Proximity Chat");
    type: "direct" | "multiple" = "direct";
    hasUnreadMessages = writable(false);
    avatarUrl = undefined;
    messages: SearchableArrayStore<string, ChatMessage> = new SearchableArrayStore((item) => item.id);
    messageReactions: MapStore<string, MapStore<string, ChatMessageReaction>> = new MapStore();
    myMembership: ChatRoomMembership = "member";
    membersId: string[] = [];
    hasPreviousMessage = writable(false);
    isEncrypted = writable(false);
    typingMembers: Writable<Array<{ id: string; name: string | null; avatarUrl: string | null }>>;
    isSpaceRoom = false;
    unknowUser = {
        id: "0",
        uuid: "0",
        availabilityStatus: writable(AvailabilityStatus.ONLINE),
        username: "Unknown",
        avatarUrl: null,
        roomName: undefined,
        playUri: undefined,
        color: undefined,
        spaceId: undefined,
    } as ChatUser;

    constructor(private _connection: ProximityChatConnection, private _userId: number, private _userUuid: string) {
        this.typingMembers = writable([]);
    }

    sendMessage(message: string, action: ChatMessageType = "proximity", broadcast = true): void {
        // Create content message
        const newChatMessageContent = {
            body: message,
            url: undefined,
        };

        // Create message
        const newMessage = new ProximityChatMessage(
            uuidv4(),
            get(this._connection.connectedUsers).get(this._userId) ?? this.unknowUser,
            writable(newChatMessageContent),
            new Date(),
            true,
            action
        );

        // Add message to the list
        this.messages.push(newMessage);

        // Use the room connection to send the message to other users of the space
        const spaceName = get(this._connection.spaceName);
        if (broadcast && spaceName != undefined) {
            this._connection.roomConnection.emitProximityPublicMessage(spaceName, message);
        }

        if (action === "proximity") {
            // Send local message to WorkAdventure scripting API
            try {
                iframeListener.sendUserInputChat(message, undefined);
            } catch (e) {
                console.error("Error while sending message to WorkAdventure scripting API", e);
            }
        }
    }

    addIncomingUser(userId: number, userUuid: string, userName: string, color?: string): void {
        this.sendMessage(get(LL).chat.timeLine.incoming({ userName }), "incoming", false);
        const playerWokaPictureStore = gameManager
            .getCurrentGameScene()
            .MapPlayersByKey.getNestedStore(userId, (item) => item.pictureStore);
        const newChatUser: ChatUser = {
            id: userId.toString(),
            uuid: userUuid,
            availabilityStatus: writable(AvailabilityStatus.ONLINE),
            username: userName,
            avatarUrl: get(playerWokaPictureStore) ?? null,
            roomName: undefined,
            playUri: undefined,
            color: color,
            spaceId: undefined,
        };

        if (userUuid === this._userUuid) return;
        this._connection.connectedUsers.update((users) => {
            users.set(userId, newChatUser);
            return users;
        });
        this.membersId.push(userId.toString());
    }

    addOutcomingUser(userId: number, userUuid: string, userName: string): void {
        this.sendMessage(get(LL).chat.timeLine.outcoming({ userName }), "outcoming", false);

        this._connection.connectedUsers.update((users) => {
            users.delete(userId);
            return users;
        });
        this.membersId = this.membersId.filter((id) => id !== userId.toString());
    }

    addNewMessage(message: string, senderUserId: number): void {
        // Create content message
        const newChatMessageContent = {
            body: message,
            url: undefined,
        };

        const sender: ChatUser | undefined = get(this._connection.connectedUsers).get(senderUserId);
        // Create message
        const newMessage = new ProximityChatMessage(
            uuidv4(),
            sender ?? this.unknowUser,
            writable(newChatMessageContent),
            new Date(),
            false,
            "proximity"
        );

        // Add message to the list
        this.messages.push(newMessage);

        // Send bubble message to WorkAdventure scripting API
        try {
            iframeListener.sendUserInputChat(message, senderUserId);
        } catch (e) {
            console.error("Error while sending message to WorkAdventure scripting API", e);
        }
    }

    sendFiles(files: FileList): Promise<void> {
        return Promise.resolve();
    }
    setTimelineAsRead(): void {
        console.info("setTimelineAsRead => Method not implemented yet!");
    }
    leaveRoom(): void {
        throw new Error("leaveRoom => Method not implemented.");
    }
    joinRoom(): void {
        throw new Error("joinRoom => Method not implemented.");
    }
    loadMorePreviousMessages(): Promise<void> {
        return Promise.resolve();
    }

    addExternalMessage(message: string, authorName?: string): void {
        // Create content message
        const newChatMessageContent = {
            body: message,
            url: undefined,
        };

        // Create message
        const newMessage = new ProximityChatMessage(
            uuidv4(),
            {
                ...this.unknowUser,
                username: authorName ?? this.unknowUser.username,
            },
            writable(newChatMessageContent),
            new Date(),
            false,
            "proximity"
        );

        // Add message to the list
        this.messages.push(newMessage);
    }

    startTyping(): Promise<object> {
        const spaceName = get(this._connection.spaceName);
        if (spaceName == undefined) return Promise.resolve({});
        this._connection.roomConnection.emitTypingProximityMessage(spaceName, true);
        return Promise.resolve({});
    }
    stopTyping(): Promise<object> {
        const spaceName = get(this._connection.spaceName);
        if (spaceName == undefined) return Promise.resolve({});
        this._connection.roomConnection.emitTypingProximityMessage(spaceName, false);
        return Promise.resolve({});
    }

    addTypingUser(senderUserId: number): void {
        const sender: ChatUser | undefined = get(this._connection.connectedUsers).get(senderUserId);
        if (sender == undefined) return;

        this.typingMembers.update((typingMembers) => {
            if (typingMembers.find((user) => user.id === sender.id) == undefined) {
                typingMembers.push({
                    id: sender.id,
                    name: sender.username ?? null,
                    avatarUrl: sender.avatarUrl ?? null,
                });
            }
            return typingMembers;
        });
    }

    removeTypingUser(senderUserId: number): void {
        const sender: ChatUser | undefined = get(this._connection.connectedUsers).get(senderUserId);
        if (sender == undefined) return;

        this.typingMembers.update((typingMembers) => {
            return typingMembers.filter((user) => user.id !== sender.id);
        });
    }

    addExternalTypingUser(id: string, name: string, avatarUrl: string | null): void {
        this.typingMembers.update((typingMembers) => {
            if (typingMembers.find((user) => user.id === id) == undefined) {
                typingMembers.push({ id, name, avatarUrl });
            }
            return typingMembers;
        });
    }

    removeExternalTypingUser(id: string) {
        this.typingMembers.update((typingMembers) => {
            return typingMembers.filter((user) => user.id !== id);
        });
    }

    getSpaceName(): string | undefined {
        return get(this._connection.spaceName);
    }
}
