export class BeIntersectional extends EventTarget {
    #observer;
    onOptions({ options, proxy, enterDelay, rootClosest, observeClosest, self }) {
        this.disconnect();
        if (rootClosest !== undefined) {
            const root = self.closest(rootClosest);
            if (root === null) {
                throw '404';
            }
            options.root = root;
        }
        let targetToObserve = self;
        if (observeClosest !== undefined) {
            targetToObserve = self.closest(observeClosest);
        }
        const observer = new IntersectionObserver((entries, observer) => {
            for (const entry of entries) {
                const intersecting = entry.isIntersecting;
                proxy.isIntersecting = intersecting;
                setTimeout(() => {
                    try {
                        proxy.isIntersectingEcho = intersecting; //sometimes proxy is revoked
                    }
                    catch (e) { }
                }, enterDelay);
            }
        }, options);
        setTimeout(() => {
            observer.observe(targetToObserve);
        }, enterDelay);
        this.#observer = observer;
        proxy.resolved = true;
    }
    disconnect() {
        if (this.#observer) {
            this.#observer.disconnect();
        }
    }
    onIntersectingChange({ isIntersecting, proxy }) {
        proxy.isNotIntersecting = !isIntersecting;
    }
    onNotIntersectingEcho({ isIntersectingEcho, proxy }) {
        proxy.isNotIntersectingEcho = !isIntersectingEcho;
    }
    finale(proxy, target, beDecorProps) {
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
