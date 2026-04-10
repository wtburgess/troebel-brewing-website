declare module "vanta/dist/vanta.fog.min" {
  import * as THREE from "three";

  interface VantaFogOptions {
    el: HTMLElement | null;
    THREE: typeof THREE;
    mouseControls?: boolean;
    touchControls?: boolean;
    gyroControls?: boolean;
    minHeight?: number;
    minWidth?: number;
    highlightColor?: number;
    midtoneColor?: number;
    lowlightColor?: number;
    baseColor?: number;
    blurFactor?: number;
    speed?: number;
    zoom?: number;
  }

  interface VantaEffect {
    destroy: () => void;
    setOptions: (options: Partial<VantaFogOptions>) => void;
    resize: () => void;
  }

  export default function VANTA_FOG(options: VantaFogOptions): VantaEffect;
}

declare module "vanta/dist/vanta.clouds.min" {
  import * as THREE from "three";

  interface VantaCloudsOptions {
    el: HTMLElement | null;
    THREE: typeof THREE;
    mouseControls?: boolean;
    touchControls?: boolean;
    gyroControls?: boolean;
    minHeight?: number;
    minWidth?: number;
    skyColor?: number;
    cloudColor?: number;
    cloudShadowColor?: number;
    sunColor?: number;
    sunGlareColor?: number;
    sunlightColor?: number;
    speed?: number;
    scale?: number;
    scaleMobile?: number;
  }

  interface VantaEffect {
    destroy: () => void;
    setOptions: (options: Partial<VantaCloudsOptions>) => void;
    resize: () => void;
  }

  export default function VANTA_CLOUDS(options: VantaCloudsOptions): VantaEffect;
}
