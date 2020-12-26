import {AbstractAdafruitService} from "./AbstractAdafruitService";

export interface AbstractAdafruitServiceConfig {
    dma?: number // frequency. Default is 10
    leds?: number // count of pixels. Default is 10
    brightness? :number // Brightness value 0 - 255. Default is 255
    gpio?: number // Ws2812 pin. Default is 18
    strip?: "rgb" | "rbg" | "grb" | "gbr" | "bgr" | "brg" // Default is grb
}


export class DummyAdafruitService extends AbstractAdafruitService {

    private config: AbstractAdafruitServiceConfig;

    constructor(config: AbstractAdafruitServiceConfig) {
        super(config);
        this.config = config;
        console.warn("DummyAdafruitService has no realisation of any methods");
    }

    write(data: Uint32Array) {
    }

    getPixelCount(): number {
        return this.config.leds || 1;
    }
}