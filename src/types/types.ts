export type Nullable<T> = T | null;

export type MessageType = {
    message: string
    photo: string
    userId: number
    userName: string
}

export type ChatStateType = {
    state: {
        messages: Array<string>
    }
    baseURL: Nullable<string>
    socket: Nullable<WebSocket>
}