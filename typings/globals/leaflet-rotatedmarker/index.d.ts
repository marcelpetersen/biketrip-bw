/// <reference path="../leaflet/index.d.ts" />

declare namespace L {
  export type Origin = 'bottom center' | 'center center' | 'top center';

  export interface CompassOptions extends InteractiveLayerOptions {
      rotationAngle?: number;
      rotationOrigin?: Origin;
  }
  export function marker(latlng: LatLngExpression, rotation?: CompassOptions, options?: MarkerOptions): Marker;
}
