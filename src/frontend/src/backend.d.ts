import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export class ExternalBlob {
    getBytes(): Promise<Uint8Array<ArrayBuffer>>;
    getDirectURL(): string;
    static fromURL(url: string): ExternalBlob;
    static fromBytes(blob: Uint8Array<ArrayBuffer>): ExternalBlob;
    withUploadProgress(onProgress: (percentage: number) => void): ExternalBlob;
}
export type Time = bigint;
export interface MemoryItem {
    name: string;
    description: string;
}
export interface MusicTrack {
    title: string;
    audioFile: ExternalBlob;
    timestamp: Time;
}
export interface LoveMessage {
    title: string;
    content: string;
    date: Time;
}
export interface LoveQuote {
    id: bigint;
    text: string;
}
export interface UserProfile {
    name: string;
}
export interface Photo {
    title: string;
    galleryImage: ExternalBlob;
    timestamp: Time;
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    addLoveMessage(title: string, content: string): Promise<void>;
    addLoveQuote(text: string): Promise<bigint>;
    addMemory(name: string, description: string): Promise<void>;
    addMusicTrack(title: string, audioFile: ExternalBlob): Promise<void>;
    addPhoto(title: string, galleryImage: ExternalBlob): Promise<void>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    getAllLoveMessages(): Promise<Array<LoveMessage>>;
    getAllLoveQuotes(): Promise<Array<LoveQuote>>;
    getAllMemories(): Promise<Array<MemoryItem>>;
    getAppContent(): Promise<string | null>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getLoveMessage(title: string): Promise<LoveMessage>;
    getLoveQuote(id: bigint): Promise<LoveQuote>;
    getMusicTrack(title: string): Promise<MusicTrack | null>;
    getPhoto(title: string): Promise<Photo | null>;
    getRandomLoveQuote(): Promise<LoveQuote>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    saveAppContent(jsonText: string): Promise<void>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
}
