import { BEAllProps, IEnhancement } from 'trans-render/be/types';
import {AP, Actions, PAP} from './types';
import {BE, BEConfig} from 'be-enhanced/BE.js';

class BeIntersectional extends BE implements Actions{

    #observer: IntersectionObserver | undefined;
    #echoTimeout: number | undefined;
    onOptions(self: this): PAP {
        this.disconnect();
        const {rootClosest, observeClosest, options, enhancedElement, enterDelay} = self;
        if(rootClosest !== undefined){
            const root = enhancedElement.closest(rootClosest);
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
}

interface BeIntersectional extends AP{}

export {BeIntersectional}

