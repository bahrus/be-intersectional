import { BE } from 'be-enhanced/BE.js';
export class BeIntersectional extends BE {
    #observer;
    #echoTimeout;
    onOptions(self) {
        this.disconnect();
        const { rootClosest, observeClosest, options, enhancedElement, enterDelay } = self;
        if (rootClosest !== undefined) {
            const root = self.closest(rootClosest);
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
    onIntersectingChange(self) {
        self.isNotIntersecting = !this.isIntersecting;
    }
    onNotIntersectingEcho(self) {
        this.isNotIntersectingEcho = !this.isIntersectingEcho;
    }
    detach(detachedElement) {
        this.disconnect();
    }
}
export const actions = {
    onOptions: 'options',
    onIntersecting: {
        ifAllOf: ['isIntersecting', 'isIntersectingEcho'],
    },
    onIntersectingChange: {
        ifKeyIn: ['isIntersecting']
    },
    onNotIntersecting: {
        ifAllOf: ['isNotIntersecting', 'isNotIntersectingEcho'],
    },
    onNotIntersectingEcho: {
        ifKeyIn: ['isIntersectingEcho']
    }
};
export const proxyPropDefaults = {
    options: {
        threshold: 0,
        rootMargin: '0px',
    },
    enterDelay: 16,
    exitDelay: 16,
};
