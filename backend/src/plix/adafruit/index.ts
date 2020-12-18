export const AdafruitService = process.platform === "linux" ?
    require('./RaspberryAdafruitService').RaspberryAdafruitService :
    require('./DummyAdafruitService').DummyAdafruitService
;