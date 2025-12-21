/**
 * React type declarations
 */

declare namespace React {
  export interface FC<P = {}> {
    (props: P): any;
  }
  
  export interface ReactElement {
    type: any;
    props: any;
  }
}

declare module 'react' {
  export = React;
  export as namespace React;
  
  export interface FC<P = {}> {
    (props: P): any;
  }
  
  export function useState<T>(initialState: T | (() => T)): [T, (value: T | ((prev: T) => T)) => void];
  export function useEffect(effect: () => void | (() => void), deps?: any[]): void;
  export function useRef<T>(initialValue: T): {current: T};
  
  export const Component: any;
  export type ReactElement = any;
  export default Component;
}
