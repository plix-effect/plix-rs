import Logger from "js-logger";

Logger.useDefaults({
    defaultLevel: Logger.INFO,
    formatter: (messages, context) => {
        const date = new Date();
        messages.unshift(`[${date.toLocaleDateString()} ${date.toLocaleTimeString()}]`)
        messages.unshift(`[${context.level.name}]`)
        messages.unshift(`[${context.name || "Default"}]`)
    }
})