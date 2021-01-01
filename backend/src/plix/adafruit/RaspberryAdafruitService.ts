import {AbstractAdafruitService} from "./AbstractAdafruitService";
import {numberToRgba, rgbaToNumber} from "@plix-effect/core/color";
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
        for(let i = 0; i < data.length; i++) {
            const {r,g,b,a} = numberToRgba(data[i])
            data[i] = rgbaToNumber({r: r*a, g: g*a, b: b*a, a: 0}) >> 8
        }
        ws281x.render(data);
    }

    getPixelCount(): number {
        return this.config.leds || 1;
    }

    clear() {
        const arr = new Uint32Array(this.config.leds || 10);
        for (let i = 0; i < arr.length; i++) {
            arr[i] = 0;
        }
        this.write(arr);
    }
}