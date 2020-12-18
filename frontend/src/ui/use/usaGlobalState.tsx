import {useEffect, useRef, useState} from "react";
import {EventEmitter} from "events";

const globalState: any = Object.create(null);
const eventEmitter = new EventEmitter()


export const useGlobalState = <T extends any>(key: string|symbol, defaultValue?: T) => {
    const defVal = (key in globalState) ? globalState[key] : defaultValue;
    const [v, setV] = useState<T>(defVal)
    const keyRef = useRef(key);
    const semaphore = useRef(Object.create(null));

    const setValue = (value: T) => {
        eventEmitter.emit(keyRef.current,value,semaphore.current)
        globalState[keyRef.current] = value;
        setV(() => value)
    }

    useEffect(() => {
        const onValueChanged = (value, semaphoreObj) => {
            if (semaphore.current === semaphoreObj) return;
            setV(value)
        }
        eventEmitter.on(keyRef.current, onValueChanged)
        return () => eventEmitter.off(keyRef.current, onValueChanged)
    }, [])

    return [v, setValue] as const
}

export const useGlobalStateSetter = (key: string|symbol) => {
    const keyRef = useRef(key);
    const semaphore = useRef(Object.create(null));

    const setValue = (value) => {
        eventEmitter.emit(keyRef.current,value,semaphore.current)
        globalState[keyRef.current] = value;
    }

    const setValueDepends = (dependFn: (value) => any) => {
        setValue(dependFn(globalState[keyRef.current]))
    }

    return [setValue, setValueDepends] as const
}