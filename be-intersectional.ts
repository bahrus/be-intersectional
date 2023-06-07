import {BE} from 'be-enhanced/BE.js';
import {Actions, AllProps, AP, PAP, ProPAP, POA} from './types';
import {Action} from 'trans-render/lib/types';

export abstract class BeIntersectional extends BE<AP, Actions> implements Actions{
    #observer: IntersectionObserver | undefined;

    #echoTimeout: string | number | NodeJS.Timeout | undefined;

    onOptions(self: this): PAP {
        this.disconnect();
        const {rootClosest, observeClosest, options, enhancedElement, enterDelay} = self;
        if(rootClosest !== undefined){
            const root = self.closest(rootClosest);
            if(root === null){
                throw '404';
            }
            options!.root = root;
        }
        let targetToObserve = enhancedElement;
        if(observeClosest !== undefined){
            targetToObserve = enhancedElement.closest(observeClosest)!;
        }
        const observer = new IntersectionObserver((entries: IntersectionObserverEntry[], observer: IntersectionObserver) => {
            for(const entry of entries){
                const intersecting = entry.isIntersecting;
                self.isIntersecting = intersecting;
                clearTimeout(this.#echoTimeout);
                this.#echoTimeout = setTimeout(() => {
                    try{
                        self.isIntersectingEcho = intersecting;//sometimes proxy is revoked
                    }catch(e){}
                }, enterDelay); 
            }
        }, options);
        setTimeout(() => {
            observer.observe(targetToObserve);
        }, enterDelay);
        self.#observer = observer;
        return {
            resolved: true
        } as PAP;
        
    }

    disconnect(){
        if(this.#observer){
            this.#observer.disconnect();
        }
        if(this.#echoTimeout){
            clearTimeout(this.#echoTimeout);
        }
    }

    abstract onIntersecting(self: this): void;

    abstract onNotIntersecting(self: this): void;

    onIntersectingChange(self: this): void {
        self.isNotIntersecting = !this.isIntersecting;
    }

    onNotIntersectingEcho(self: this): void {
        this.isNotIntersectingEcho = !this.isIntersectingEcho;
    }

    override detach(detachedElement: Element): void {
        this.disconnect();
    }


}

export interface BeIntersectional extends AllProps{}

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
} as Partial<{[key in keyof Actions ]: Action<AP > | keyof AP}>;

export const propDefaults = {
    options: {
        threshold: 0,
        rootMargin: '0px',
    },
    enterDelay: 16,
    exitDelay: 16,
} as AP;

