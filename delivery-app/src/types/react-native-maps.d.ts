declare module 'react-native-maps' {
  import {Component} from 'react';
  import {ViewProps} from 'react-native';

  export interface Region {
    latitude: number;
    longitude: number;
    latitudeDelta: number;
    longitudeDelta: number;
  }

  export interface MarkerProps {
    coordinate: {
      latitude: number;
      longitude: number;
    };
    title?: string;
    pinColor?: string;
  }

  export interface MapViewProps extends ViewProps {
    initialRegion?: Region;
    region?: Region;
    style?: any;
  }

  export class Marker extends Component<MarkerProps> {}

  export default class MapView extends Component<MapViewProps> {
    static Marker: typeof Marker;
  }
}








