import { BEAllProps, IEnhancement } from 'trans-render/be/types';
import {AP, Actions, PAP} from './types';
import {BE, BEConfig} from 'be-enhanced/BE.js';

abstract class BeIntersectional extends BE implements Actions{

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
                        //note -- no more proxy, so maybe the try catch is overkill now
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

    override async detach(el: Element) {
        this.disconnect();
    }
}

interface BeIntersectional extends AP{}

export {BeIntersectional}

