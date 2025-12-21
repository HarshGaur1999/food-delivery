/**
 * React Native type declarations
 */

declare module 'react-native' {
  import {Component, ReactElement, ReactNode} from 'react';
  
  export interface ViewProps {
    style?: any;
    children?: ReactNode;
    [key: string]: any;
  }
  
  export interface TextProps {
    style?: any;
    children?: ReactNode;
    [key: string]: any;
  }
  
  export interface ScrollViewProps extends ViewProps {
    refreshControl?: ReactElement;
    contentContainerStyle?: any;
  }
  
  export interface TouchableOpacityProps extends ViewProps {
    onPress?: () => void;
    disabled?: boolean;
  }
  
  export interface TextInputProps {
    style?: any;
    value?: string;
    onChangeText?: (text: string) => void;
    placeholder?: string;
    placeholderTextColor?: string;
    keyboardType?: string;
    maxLength?: number;
    editable?: boolean;
    onKeyPress?: (e: any) => void;
    [key: string]: any;
  }
  
  export class View extends Component<ViewProps> {}
  export class Text extends Component<TextProps> {}
  export class ScrollView extends Component<ScrollViewProps> {}
  export class TouchableOpacity extends Component<TouchableOpacityProps> {}
  export class TextInput extends Component<TextInputProps> {}
  export class ActivityIndicator extends Component<{size?: string | number; color?: string}> {}
  export class Alert {
    static alert(title: string, message?: string, buttons?: any[]): void;
  }
  export class Linking {
    static openURL(url: string): Promise<void>;
  }
  export class Platform {
    static OS: 'ios' | 'android' | 'web';
    static Version: number;
    static select<T>(spec: {ios?: T; android?: T; web?: T}): T | undefined;
  }
  export class StatusBar extends Component<{barStyle?: string; backgroundColor?: string}> {}
  export class KeyboardAvoidingView extends Component<{behavior?: string; style?: any; children?: ReactNode}> {}
  export class RefreshControl extends Component<{refreshing: boolean; onRefresh: () => void}> {}
  export class FlatList<T = any> extends Component<{
    data: T[];
    renderItem: (info: {item: T; index: number}) => any;
    keyExtractor?: (item: T, index: number) => string;
    contentContainerStyle?: any;
    refreshControl?: any;
    ListEmptyComponent?: any;
    [key: string]: any;
  }> {}
  
  export const StyleSheet: {
    create: <T extends Record<string, any>>(styles: T) => T;
  };
  
  export const PermissionsAndroid: {
    PERMISSIONS: {
      ACCESS_FINE_LOCATION: string;
      ACCESS_COARSE_LOCATION: string;
      ACCESS_BACKGROUND_LOCATION: string;
    };
    RESULTS: {
      GRANTED: string;
      DENIED: string;
    };
    request: (permission: string, rationale?: any) => Promise<string>;
    check: (permission: string) => Promise<boolean>;
  };
}

