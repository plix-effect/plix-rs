import {AbstractAdafruitService, AbstractAdafruitServiceConfig} from "./AbstractAdafruitService";

export class DummyAdafruitService extends AbstractAdafruitService {

    constructor(config: AbstractAdafruitServiceConfig) {
        super(config);
        console.warn("DummyAdafruitService has no realisation of any methods");
    }

    write(data: Uint32Array) {
    }
}