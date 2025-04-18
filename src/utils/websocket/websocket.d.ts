
interface WebSocketConstructor {
  new (url: string | URL, protocols?: string | string[]): WebSocket;
}

declare global {
  var WebSocket: WebSocketConstructor;
}

export {};
