import {AbstractAdafruitService} from "./AbstractAdafruitService";
import {numberToRgba} from "@plix-effect/core/color";
const ws281x = require('rpi-ws281x-v2');

export interface AbstractAdafruitServiceConfig {
    dma?: number // frequency. Default is 10
    leds?: number // count of pixels. Default is 10
    brightness? :number // Brightness value 0 - 255. Default is 255
    gpio?: number // Ws2812 pin. Default is 18
    strip?: "rgb" | "rbg" | "grb" | "gbr" | "bgr" | "brg" // Default is grb
}


export class RaspberryAdafruitService extends AbstractAdafruitService {

    private config: AbstractAdafruitServiceConfig;

    constructor(config: AbstractAdafruitServiceConfig) {
        super(config);
        ws281x.configure(config);
        this.config = config;
    }

    write(data: Uint32Array) {
        for(let i = 0; i++; i < data.length) {
            const {r,g,b,a} = numberToRgba(data[i])
            data[i] = (Math.min(r,255) * a) << 16 | (Math.min(g,255) * a) << 8 | (Math.min(b,255) * a);
        }
        ws281x.render(data);
    }

    getPixelCount(): number {
        return this.config.leds || 1;
    }
}