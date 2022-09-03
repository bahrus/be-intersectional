import {define, BeDecoratedProps} from 'be-decorated/be-decorated.js';
import {BeIntersectionalActions, BeIntersectionalProxy, BeIntersectionalVirtualProps, BeInterseciontalEndUserProps, BIP, Proxy} from './types';
import {RenderContext, Action} from 'trans-render/lib/types';

export abstract class BeIntersectional extends EventTarget implements BeIntersectionalActions {
    #observer: IntersectionObserver | undefined;

    onOptions({options, proxy, enterDelay, rootClosest, observeClosest, self}: BIP): void {
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
                setTimeout(() => {
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

    abstract onIntersecting(bip: BIP): void;

    abstract onNotIntersecting(bip: BIP): void;

    onIntersectingChange({isIntersecting, proxy}: BIP){
        proxy.isNotIntersecting = !isIntersecting;
    }

    onNotIntersectingEcho({isIntersectingEcho, proxy}: BIP): void {
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
} as Partial<{[key in keyof BeIntersectionalActions ]: Action<BeIntersectionalVirtualProps > | keyof BeIntersectionalVirtualProps}>;

export const proxyPropDefaults : BeInterseciontalEndUserProps = {
    options: {
        threshold: 0,
        rootMargin: '0px',
    },
    enterDelay: 16,
    exitDelay: 16
};

