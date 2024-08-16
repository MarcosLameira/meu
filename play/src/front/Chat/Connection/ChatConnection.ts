import { Readable, Writable } from "svelte/store";
import { AvailabilityStatus, PartialSpaceUser } from "@workadventure/messages";
import { MapStore } from "@workadventure/store-utils";
import { RoomConnection } from "../../Connection/RoomConnection";
import { SpaceUserExtended } from "../../Space/SpaceFilter/SpaceFilter";

export interface ChatUser {
    id: string;
    uuid?: string;
    availabilityStatus: Writable<AvailabilityStatus>;
    username: string | undefined;
    avatarUrl: string | null;
    roomName: string | undefined;
    playUri: string | undefined;
    isAdmin?: boolean;
    isMember?: boolean;
    visitCardUrl?: string;
    color: string | undefined;
    spaceId: number | undefined;
}

export type ChatRoomMembership = "ban" | "join" | "knock" | "leave" | "invite" | string;

export interface ChatRoom {
    id: string;
    name: Readable<string>;
    type: "direct" | "multiple";
    hasUnreadMessages: Readable<boolean>;
    avatarUrl: string | undefined;
    messages: Readable<readonly ChatMessage[]>;
    messageReactions: MapStore<string, MapStore<string, ChatMessageReaction>>;
    sendMessage: (message: string) => void;
    sendFiles: (files: FileList) => Promise<void>;
    myMembership: ChatRoomMembership;
    setTimelineAsRead: () => void;
    membersId: string[];
    leaveRoom: () => void;
    joinRoom: () => void;
    hasPreviousMessage: Readable<boolean>;
    loadMorePreviousMessages: () => Promise<void>;
    isEncrypted: Readable<boolean>;
    addIncomingUser?: (userId: number, userUuid: string, userName: string, color?: string) => void;
    addOutcomingUser?: (userId: number, userUuid: string, userName: string) => void;
    addNewMessage?: (message: string, senderUserId: number) => void;
    addExternalMessage?: (message: string, authorName?: string) => void;
    typingMembers: Readable<Array<{ id: string; name: string | null; avatarUrl: string | null }>>;
    startTyping: () => Promise<object>;
    stopTyping: () => Promise<object>;
    //TODO: Rename with a more generic name ?
    isSpaceRoom: boolean;
}

//Readonly attributes
export interface ChatMessage {
    id: string;
    sender: ChatUser | undefined;
    content: Readable<ChatMessageContent>;
    isMyMessage: boolean;
    isQuotedMessage: boolean | undefined;
    date: Date | null;
    quotedMessage: ChatMessage | undefined;
    type: ChatMessageType;
    remove: () => void;
    edit: (newContent: string) => Promise<void>;
    isDeleted: Readable<boolean>;
    isModified: Readable<boolean>;
    addReaction: (reaction: string) => Promise<void>;
}

export interface ChatMessageReaction {
    key: string;
    users: MapStore<string, ChatUser>;
    react: () => void;
    reacted: Readable<boolean>;
}

export type ChatMessageType = "proximity" | "text" | "incoming" | "outcoming" | "image" | "file" | "audio" | "video";
export type ChatMessageContent = { body: string; url: string | undefined };
export const historyVisibilityOptions = ["world_readable", "joined", "invited"] as const;
export type historyVisibility = (typeof historyVisibilityOptions)[number];

export interface CreateRoomOptions {
    name?: string;
    visibility?: "private" | "public";
    is_direct?: boolean;
    historyVisibility?: historyVisibility;
    invite?: { value: string; label: string }[];
    preset?: "private_chat" | "public_chat" | "trusted_private_chat";
    encrypt?: boolean;
    parentSpaceID?: string;
}

export type ConnectionStatus = "ONLINE" | "ON_ERROR" | "CONNECTING" | "OFFLINE";

export type userId = number;
export type chatId = string;
export type ChatSpaceRoom = ChatRoom;
export interface ChatConnectionInterface {
    connectionStatus: Readable<ConnectionStatus>;
    connectedUsers: Readable<Map<userId, ChatUser>>;
    userDisconnected: Readable<Map<chatId, ChatUser>>;
    directRooms: Readable<ChatRoom[]>;
    rooms: Readable<ChatRoom[]>;
    invitations: Readable<ChatRoom[]>;
    roomBySpaceRoom: Readable<Map<ChatSpaceRoom | undefined, ChatRoom[]>>;

    addUserFromSpace(user: SpaceUserExtended): void;

    updateUserFromSpace(user: PartialSpaceUser): void;

    disconnectSpaceUser(userId: number): void;

    sendBan: (uuid: string, username: string) => void;
    createRoom: (roomOptions: CreateRoomOptions) => Promise<{ room_id: string }>;

    createDirectRoom(userChatId: string): Promise<ChatRoom | undefined>;

    getDirectRoomFor(uuserChatId: string): ChatRoom | undefined;

    searchUsers(searchText: string): Promise<void>;

    searchAccessibleRooms(searchText: string): Promise<
        {
            id: string;
            name: string | undefined;
        }[]
    >;

    joinRoom(roomId: string): Promise<ChatRoom | undefined>;

    destroy(): Promise<void>;

    searchChatUsers(searchText: string): Promise<{ id: string; name: string | undefined }[] | undefined>;

    isEncryptionRequiredAndNotSet: Readable<boolean>;

    initEndToEndEncryption(): Promise<void>;

    isGuest: Readable<boolean>;
    joinSpace?: (spaceId: string, spaceName: string) => void;
}

export type Connection = Pick<RoomConnection, "queryChatMembers" | "emitPlayerChatID" | "emitBanPlayerMessage">;
