import {define, BeDecoratedProps} from 'be-decorated/be-decorated.js';
import {BeIntersectionalActions, BeIntersectionalProxy, BIP, Proxy} from './types';
import {RenderContext} from 'trans-render/lib/types';

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

    abstract onIntersecting(bip: BeIntersectionalProxy): void;

    finale(proxy: Proxy, target: Element, beDecorProps: BeDecoratedProps<any, any>): void {
        this.disconnect();
    }

}

