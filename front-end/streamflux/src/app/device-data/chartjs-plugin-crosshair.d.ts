import 'chart.js';

declare module 'chart.js' {
  interface PluginOptionsByType<TType extends keyof ChartTypeRegistry> {
    crosshair?: {
      line?: {
        color?: string;
        width?: number;
        dashPattern?: number[];
      };
      sync?: {
        enabled?: boolean;
        group?: number | string;
        suppressTooltips?: boolean;
      };
      zoom?: {
        enabled?: boolean;
        zoomboxBackgroundColor?: string;
        zoomboxBorderColor?: string;
      };
      callbacks?: {
        beforeZoom?: (start: { x: number, y: number }, end: { x: number, y: number }) => boolean;
        afterZoom?: (start: { x: number, y: number }, end: { x: number, y: number }) => void;
      };
    };
  }
}
