import {AbstractAdafruitService, AbstractAdafruitServiceConfig} from "./AbstractAdafruitService";
const ws281x = require('rpi-ws281x-v2');

export class RaspberryAdafruitService extends AbstractAdafruitService {

    private config: AbstractAdafruitServiceConfig;

    constructor(config: AbstractAdafruitServiceConfig) {
        super(config);
        ws281x.configure(config);
        this.config = config;
    }

    write(data: Uint32Array) {
        ws281x.render(data);
    }

    getPixelCount(): number {
        return this.config.leds || 1;
    }
}