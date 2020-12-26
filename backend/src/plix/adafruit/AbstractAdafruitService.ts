export class AbstractAdafruitService {

    constructor(config: any) {}

    write(data: Uint32Array) {
        throw new Error("Not implemented");
    };

    getPixelCount(): number {
        throw new Error("Not implemented");
    }
}