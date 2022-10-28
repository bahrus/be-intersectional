import {BeDecoratedProps} from 'be-decorated/types.js';
import {Actions, VirtualProps, PP, Proxy} from './types';
import {RenderContext, Action} from 'trans-render/lib/types';

export abstract class BeIntersectional extends EventTarget implements Actions {
    #observer: IntersectionObserver | undefined;

    #echoTimeout: string | number | NodeJS.Timeout | undefined;
    onOptions({options, proxy, enterDelay, rootClosest, observeClosest, self}: PP): void {
        this.disconnect();
        if(rootClosest !== undefined){
            const root = self.closest(rootClosest);
            if(root === null){
                throw '404';
            }
            options!.root = root;
        }
        let targetToObserve = self;
        if(observeClosest !== undefined){
            targetToObserve = self.closest(observeClosest)!;
        }
        const observer = new IntersectionObserver((entries: IntersectionObserverEntry[], observer: IntersectionObserver) => {
            for(const entry of entries){
                const intersecting = entry.isIntersecting;
                proxy.isIntersecting = intersecting;
                clearTimeout(this.#echoTimeout);
                this.#echoTimeout = setTimeout(() => {
                    try{
                        proxy.isIntersectingEcho = intersecting;//sometimes proxy is revoked
                    }catch(e){}
                }, enterDelay); 
            }
        }, options);
        setTimeout(() => {
            observer.observe(targetToObserve);
        }, enterDelay);
        this.#observer = observer; 
        proxy.resolved = true;
    }

    disconnect(){
        if(this.#observer){
            this.#observer.disconnect();
        }
    }

    abstract onIntersecting(bip: PP): void;

    abstract onNotIntersecting(bip: PP): void;

    onIntersectingChange({isIntersecting, proxy}: PP){
        proxy.isNotIntersecting = !isIntersecting;
    }

    onNotIntersectingEcho({isIntersectingEcho, proxy}: PP): void {
        proxy.isNotIntersectingEcho = !isIntersectingEcho;
    }

    finale(proxy: Proxy, target: Element, beDecorProps: BeDecoratedProps<any, any>): void {
        this.disconnect();
    }

}

export const actions = {
    onOptions: 'options',
    onIntersecting: {
        ifAllOf: ['isIntersecting', 'isIntersectingEcho'],
    },
    onIntersectingChange:{
        ifKeyIn: ['isIntersecting']
    },
    onNotIntersecting: {
        ifAllOf: ['isNotIntersecting', 'isNotIntersectingEcho'],
    },
    onNotIntersectingEcho: {
        ifKeyIn: ['isIntersectingEcho']
    }
} as Partial<{[key in keyof Actions ]: Action<VirtualProps > | keyof VirtualProps}>;

export const proxyPropDefaults = {
    options: {
        threshold: 0,
        rootMargin: '0px',
    },
    enterDelay: 16,
    exitDelay: 16,
} as VirtualProps;

