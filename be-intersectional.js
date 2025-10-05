// @ts-check
import { BE } from 'be-enhanced/BE.js';
/** @import {Actions, PAP, AllProps, AP, IntersectionalActions, BAP} from './ts-refs/be-intersectional/types.d.ts' */;

/**
 * @implements {IntersectionalActions}
 */
class BeIntersectional extends BE {
    /** @type {IntersectionObserver | undefined} */
    #observer;
    /**
     * @type {number | undefined}
     */
    #echoTimeout;
    /**
     * 
     * @param {BAP} self 
     * @returns 
     */
    onOptions(self) {
        this.disconnect();
        const { rootClosest, observeClosest, options, enhancedElement, enterDelay } = self;
        if (rootClosest !== undefined) {
            const root = enhancedElement.closest(rootClosest);
            if (root === null) {
                throw '404';
            }
            options.root = root;
        }
        /** @type {Element | null} */
        let targetToObserve = enhancedElement;
        if (observeClosest !== undefined) {
            targetToObserve = enhancedElement.closest(observeClosest);
        }
        if(targetToObserve === null) throw 404;
        const observer = new IntersectionObserver((entries, observer) => {
            for (const entry of entries) {
                const intersecting = entry.isIntersecting;
                self.isIntersecting = intersecting;
                const echoTimeout = this.#echoTimeout;
                if(echoTimeout !== undefined) clearTimeout(echoTimeout);
                this.#echoTimeout = /** @type {number} */(/** @type {unknown} */(setTimeout(() => {
                    try {
                        //note -- no more proxy, so maybe the try catch is overkill now
                        self.isIntersectingEcho = intersecting; //sometimes proxy is revoked
                    }
                    catch (e) { }
                }, enterDelay)));
            }
        }, options);
        setTimeout(() => {
            observer.observe(targetToObserve);
        }, enterDelay);
        this.#observer = observer;
        return {
            resolved: true
        };
    }
    disconnect() {
        if (this.#observer) {
            this.#observer.disconnect();
        }
        if (this.#echoTimeout) {
            clearTimeout(this.#echoTimeout);
        }
    }
    // onIntersectingChange(self) {
    //     self.isNotIntersecting = !self.isIntersecting;
    // }
    // onNotIntersectingEcho(self) {
    //     self.isNotIntersectingEcho = !self.isIntersectingEcho;
    // }
    /**
     * 
     * @param {Element} el 
     */
    async detach(el) {
        this.disconnect();
    }
}
export { BeIntersectional };
