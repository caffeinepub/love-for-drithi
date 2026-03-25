import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface LoveMessage {
    title: string;
    content: string;
    date: Time;
}
export type Time = bigint;
export interface MemoryItem {
    name: string;
    description: string;
}
export interface backendInterface {
    addLoveMessage(title: string, content: string): Promise<void>;
    addMemory(name: string, description: string): Promise<void>;
    getAllLoveMessages(): Promise<Array<LoveMessage>>;
    getAllMemories(): Promise<Array<MemoryItem>>;
    getLoveMessage(title: string): Promise<LoveMessage>;
}
