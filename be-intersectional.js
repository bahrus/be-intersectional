// @ts-check
import { BE } from 'be-enhanced/BE.js';
/** @import {Actions, PAP, AllProps, AP, IntersectionalActions} from './types.d.ts' */;

/**
 * @implements {IntersectionalActions}
 */
class BeIntersectional extends BE {
    #observer;
    #echoTimeout;
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
        let targetToObserve = enhancedElement;
        if (observeClosest !== undefined) {
            targetToObserve = enhancedElement.closest(observeClosest);
        }
        const observer = new IntersectionObserver((entries, observer) => {
            for (const entry of entries) {
                const intersecting = entry.isIntersecting;
                self.isIntersecting = intersecting;
                clearTimeout(this.#echoTimeout);
                this.#echoTimeout = setTimeout(() => {
                    try {
                        //note -- no more proxy, so maybe the try catch is overkill now
                        self.isIntersectingEcho = intersecting; //sometimes proxy is revoked
                    }
                    catch (e) { }
                }, enterDelay);
            }
        }, options);
        setTimeout(() => {
            observer.observe(targetToObserve);
        }, enterDelay);
        self.#observer = observer;
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
    async detach(el) {
        this.disconnect();
    }
}
export { BeIntersectional };
