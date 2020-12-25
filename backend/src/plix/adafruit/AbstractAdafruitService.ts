export interface AbstractAdafruitServiceConfig {
    dma?: number // frequency. Default is 10
    leds?: number // count of pixels. Default is 10
    brightness? :number // Brightness value 0 - 255. Default is 255
    gpio?: number // Ws2812 pin. Default is 18
    strip?: "rgb" | "rbg" | "grb" | "gbr" | "bgr" | "brg" // Default is grb
}

export class AbstractAdafruitService {

    constructor(config: AbstractAdafruitServiceConfig) {}

    write(data: Uint32Array) {
        throw new Error("Not implemented");
    };

    getPixelCount(): number {
        throw new Error("Not implemented");
    }
}