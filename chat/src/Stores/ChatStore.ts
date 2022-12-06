import { derived, writable } from "svelte/store";
import { Subject } from "rxjs";
import { FileExt, UploadedFile, uploadingState } from "../Services/FileMessageManager";
import { User } from "../Xmpp/AbstractRoom";
import { mucRoomsStore } from "./MucRoomsStore";
import { userStore } from "./LocalUserStore";
import { Message } from "../Model/Message";

// Global config store for the whole chat
export const enableChat = writable<boolean>(true);
export const enableChatUpload = writable<boolean>(false);
export const enableChatOnlineListStore = writable<boolean>(false);
export const enableChatDisconnectedListStore = writable<boolean>(false);

const _newChatMessageSubject = new Subject<string>();
export const newChatMessageSubject = _newChatMessageSubject.asObservable();

export const _newChatMessageWritingStatusSubject = new Subject<number>();
export const newChatMessageWritingStatusSubject = _newChatMessageWritingStatusSubject.asObservable();

export enum ChatMessageTypes {
    text = 1,
    me,
    userIncoming,
    userOutcoming,
    userWriting,
    userStopWriting,
}

export interface ChatMessage {
    type: ChatMessageTypes;
    date: Date;
    author?: User;
    targets?: User[];
    text?: string[];
    authorName?: string;
}

function createChatMessagesStore() {
    const { subscribe, update } = writable<ChatMessage[]>([]);

    return {
        subscribe,
        addIncomingUser(user: User) {
            update((list) => {
                const lastMessage = list[list.length - 1];
                if (lastMessage && lastMessage.type === ChatMessageTypes.userIncoming && lastMessage.targets) {
                    lastMessage.targets.push(user);
                } else {
                    list.push({
                        type: ChatMessageTypes.userIncoming,
                        targets: [user],
                        date: new Date(),
                    });
                }
                return list;
            });
        },
        addOutcomingUser(user: User) {
            update((list) => {
                const lastMessage = list[list.length - 1];
                if (lastMessage && lastMessage.type === ChatMessageTypes.userOutcoming && lastMessage.targets) {
                    lastMessage.targets.push(user);
                } else {
                    list.push({
                        type: ChatMessageTypes.userOutcoming,
                        targets: [user],
                        date: new Date(),
                    });
                }
                return list;
            });
        },
        addPersonalMessage(text: string) {
            _newChatMessageSubject.next(text);
            update((list) => {
                const defaultRoom = mucRoomsStore.getDefaultRoom();
                const lastMessage = list[list.length - 1];
                if (
                    lastMessage &&
                    lastMessage.type === ChatMessageTypes.me &&
                    lastMessage.text &&
                    new Date().getTime() - lastMessage.date.getTime() < 120000
                ) {
                    lastMessage.date = new Date();
                    lastMessage.text.push(text);
                } else {
                    list.push({
                        type: ChatMessageTypes.me,
                        text: [text],
                        author: defaultRoom ? defaultRoom.getUserByJid(defaultRoom.myJID) : undefined,
                        date: new Date(),
                        authorName: userStore.get().name,
                    });
                }

                return list;
            });
        },
        /**
         * @param origin The iframe that originated this message (if triggered from the Scripting API), or undefined otherwise.
         */
        addExternalMessage(user: User | undefined, text: string, authorName?: string, origin?: Window) {
            update((list) => {
                const lastMessage = list[list.length - 1];
                if (
                    lastMessage &&
                    lastMessage.type === ChatMessageTypes.text &&
                    lastMessage.text &&
                    ((user && lastMessage?.author?.uuid === user.uuid) || lastMessage?.authorName === authorName) &&
                    new Date().getTime() - lastMessage.date.getTime() < 120000
                ) {
                    lastMessage.text.push(text);
                    lastMessage.date = new Date();
                } else {
                    list.push({
                        type: ChatMessageTypes.text,
                        text: [text],
                        author: user,
                        date: new Date(),
                        authorName,
                    });
                }
                return list;
            });
        },

        reInitialize() {
            update(() => {
                return [];
            });
        },
    };
}
export const chatMessagesStore = createChatMessagesStore();

function createChatSubMenuVisibilityStore() {
    const { subscribe, update } = writable<string>("");

    return {
        subscribe,
        openSubMenu(playerName: string, index: number) {
            const id = playerName + index;
            update((oldValue) => {
                return oldValue === id ? "" : id;
            });
        },
    };
}
export const chatSubMenuVisibilityStore = createChatSubMenuVisibilityStore();

export const chatVisibilityStore = writable<boolean>(false);

export const availabilityStatusStore = writable<number>(1);

export const timelineActiveStore = writable<boolean>(false);

export const lastTimelineMessageRead = writable<Date>(new Date());

export const writingStatusMessageStore = writable<Set<string>>(new Set<string>());

export const chatInputFocusStore = writable(false);

export const chatPeerConnectionInProgress = writable<boolean>(false);

export const mentionsUserStore = writable<Set<User>>(new Set<User>());
export const selectedMessageToReply = writable<Message | null>(null);
export const selectedMessageToReact = writable<Message | null>(null);
export const timelineMessagesToSee = derived(
    [chatMessagesStore, lastTimelineMessageRead],
    ([$chatMessagesStore, $lastTimelineMessageRead]) =>
        $chatMessagesStore.filter((message) => message.date > $lastTimelineMessageRead).length
);

export const filesUploadStore = writable<Map<string, UploadedFile | FileExt>>(
    new Map<string, UploadedFile | FileExt>()
);
export const hasErrorUploadingFile = derived([filesUploadStore], ([$filesUploadStore]) =>
    [...$filesUploadStore.values()].reduce(
        (value, file) => (file.uploadState === uploadingState.error ? true : value),
        false
    )
);
export const hasInProgressUploadingFile = derived([filesUploadStore], ([$filesUploadStore]) =>
    [...$filesUploadStore.values()].reduce(
        (value, file) => (file.uploadState === uploadingState.inprogress ? true : value),
        false
    )
);

export const chatSoundsStore = writable<boolean>(true);
export const chatNotificationsStore = writable<boolean>(true);

export const connectionNotAuthorizedStore = writable<boolean>(false);
export const connectionEstablishedStore = writable<boolean>(false);

export const navChat = writable<string>("chat");

export const shownRoomListStore = writable<string>("");
export const showLivesStore = writable<boolean>(false);
export const showForumsStore = writable<boolean>(false);
export const showTimelineStore = writable<boolean>(false);
