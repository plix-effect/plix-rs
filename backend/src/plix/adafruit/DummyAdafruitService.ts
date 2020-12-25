import {AbstractAdafruitService, AbstractAdafruitServiceConfig} from "./AbstractAdafruitService";

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