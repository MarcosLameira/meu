import { Request } from "express";
import { USE_DOMAIN_NAME_IN_PATH } from "../Enum/EnvironmentVariable";
import path from "node:path";

/**
 * Maps a path to the storage path.
 * The returned value never starts with "/".
 */
export function mapPath(filePath: string, req: Request): string {
    return mapPathUsingDomain(filePath, req.hostname);
}


export function mapPathUsingDomain(filePath: string, domain: string): string {
    if (filePath.startsWith("/")) {
        filePath = filePath.substring(1);
    }
    if (USE_DOMAIN_NAME_IN_PATH) {
        if (domain.includes("..") || domain.includes("/")) {
            throw new Error("Invalid host name provided");
        }
        return path.normalize(domain + "/" + filePath);
    }
    return filePath;
}
