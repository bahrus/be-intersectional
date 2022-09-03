export class BeIntersectional extends EventTarget {
    #observer;
    onOptions({ options, proxy, enterDelay, rootClosest, self }) {
        this.disconnect();
        if (rootClosest !== undefined) {
            const root = self.closest(rootClosest);
            if (root === null) {
                throw '404';
            }
            options.root = root;
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
            observer.observe(self);
        }, enterDelay);
        this.#observer = observer;
        proxy.resolved = true;
    }
    disconnect() {
        if (this.#observer) {
            this.#observer.disconnect();
        }
    }
    finale(proxy, target, beDecorProps) {
        this.disconnect();
    }
}
