// Workbox type fixes for compatibility issues
declare global {
  interface ExtendableEvent extends Event {
    waitUntil(promise: Promise<any>): void;
  }
}

declare module 'workbox-routing' {
  export type RouteHandlerCallback = (params: any) => Promise<Response> | Response;
  export type RouteMatchCallback = (params: any) => boolean | Promise<boolean>;
}

export {};