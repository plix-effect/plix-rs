import {useCallback, useEffect, useRef, useState} from "react";

export type RefreshFunction<F extends (...args: any[]) => Promise<any>> = (...args: Parameters<F>) => ReturnType<F>

type PRT<F> = F extends (...args: any[]) => PromiseLike<infer R> ? R : never;

type State<DataType> = {
    pending: boolean,
    error?: String|Error,
    data?: DataType,
}

export const useAsyncRequest = <F extends (...args: any[]) => Promise<any>>
(requestFn: F, defaultData?: PRT<F>, deps?: any[]): [boolean, String|Error, PRT<F>|typeof defaultData, () => void] => {
    const [state, setState] = useState<State<PRT<F>>>({pending: deps != null, data: defaultData});

    const requestFnRef = useRef(requestFn);
    requestFnRef.current = requestFn;

    const semaphoreRef = useRef({});
    const refresh = useCallback(() => {
        const promise = requestFnRef.current();
        const semaphore = {};
        semaphoreRef.current = semaphore;
        setState((state) => ({...state, pending: true}));
        promise.then((data) => {
            if (semaphoreRef.current !== semaphore) return;
            setState({
                pending: false, error: undefined, data: data
            });
        }, (err) => {
            if (semaphoreRef.current !== semaphore) return;
            setState({
                pending: false, error: err, data: undefined
            });
        });
    }, []);

    useEffect(() => {
        if (deps == null) return;
        refresh();
    }, deps || []);

    return [state.pending, state.error, state.data, refresh];
};