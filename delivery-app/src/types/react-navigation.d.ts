/**
 * React Navigation type declarations
 */

declare module '@react-navigation/native' {
  import {Component} from 'react';
  export class NavigationContainer extends Component<any> {}
}

declare module '@react-navigation/native-stack' {
  import {Component} from 'react';
  
  export interface NativeStackScreenProps<ParamList, RouteName extends keyof ParamList> {
    route: {
      params: ParamList[RouteName];
    };
    navigation: {
      navigate: (name: keyof ParamList, params?: any) => void;
      goBack: () => void;
    };
  }
  
  export function createNativeStackNavigator<ParamList = any>(): {
    Navigator: Component<any>;
    Screen: Component<any>;
  };
}











