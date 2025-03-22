declare module 'js-cookie' {
    export function set(key: string, value: string, options?: { expires?: number | Date; path?: string }): void;
    export function get(key: string): string | undefined;
    export function remove(key: string, options?: { path?: string }): void;
  }
  