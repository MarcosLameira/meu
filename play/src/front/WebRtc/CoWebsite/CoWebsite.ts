import type CancelablePromise from "cancelable-promise";

// export type CoWebsiteState = "asleep" | "loading" | "ready";

export interface CoWebsite {
    getId(): string;
    getDuplicateId(): string;
    getUrl(): URL;
    getIframe(): HTMLIFrameElement | undefined;
    getLoadIframe(): CancelablePromise<HTMLIFrameElement> | undefined;
    getWidthPercent(): number | undefined;
    isClosable(): boolean;
}
