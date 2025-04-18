
/// <reference types="vite/client" />

declare global {
  interface Window {
    __DEBUG__: boolean;
    __THEME__: string;
  }
}

declare module '*.svg' {
  import React = require('react');
  export const ReactComponent: React.FC<React.SVGProps<SVGSVGElement>>;
  const src: string;
  export default src;
}

declare module '@/shared/ui' {
  export * from '@/shared/ui/ui-components';
}

declare module '@/shared/types' {
  export * from '@/shared/types/shared.types';
}

// Global WebSocket type definitions
declare global {
  interface WebSocket {
    readonly CLOSED: number;
    readonly CLOSING: number;
    readonly CONNECTING: number;
    readonly OPEN: number;
    close(code?: number, reason?: string): void;
    send(data: string | ArrayBufferLike | Blob | ArrayBufferView): void;
  }

  var WebSocket: {
    prototype: WebSocket;
    new(url: string | URL, protocols?: string | string[]): WebSocket;
    readonly CLOSED: number;
    readonly CLOSING: number;
    readonly CONNECTING: number;
    readonly OPEN: number;
  };
}
