import { define } from 'be-decorated/be-decorated.js';
import { register } from 'be-hive/register.js';
export class BeIntersectional {
    #templateObserver;
    #mountedElementObserver;
    #expanded = false;
    #ignoreNextNonIntersectingEvent = false;
    #target;
    intro(proxy, target, beDecorProps) {
        this.#target = target;
    }
    async onOptions({ options, proxy, enterDelay, rootClosest }) {
        this.disconnect(this);
        const target = this.#target;
        if (rootClosest !== undefined) {
            const root = target.closest(rootClosest);
            if (root === null) {
                throw '404';
            }
            options.root = root;
        }
        const observer = new IntersectionObserver((entries, observer) => {
            for (const entry of entries) {
                const intersecting = entry.isIntersecting;
                proxy.templIntersecting = intersecting;
                setTimeout(() => {
                    try {
                        proxy.templIntersectingEcho = intersecting; //sometimes proxy is revoked
                    }
                    catch (e) { }
                }, enterDelay);
            }
        }, options);
        this.#templateObserver = observer;
        setTimeout(() => {
            observer.observe(target);
        }, enterDelay);
    }
    async onIntersecting({ templIntersecting, templIntersectingEcho, exitDelay, proxy, transform, host }) {
        if (this.#expanded)
            return;
        if (transform !== undefined && host === undefined) {
            return;
        }
        const target = this.#target;
        let mountedElement = null;
        const clone = target.content.cloneNode(true);
        if (transform !== undefined) {
            const { DTR } = await import('trans-render/lib/DTR.js');
            const ctx = {
                host,
                match: transform
            };
            const dtr = new DTR(ctx);
            await dtr.transform(clone);
        }
        if (target.nextElementSibling === null) {
            target.parentElement.appendChild(clone);
            mountedElement = target.nextElementSibling;
        }
        else {
            const children = Array.from(clone.childNodes);
            for (const child of children) {
                if (child instanceof Element) {
                    mountedElement = child;
                    target.insertAdjacentElement('afterend', child);
                    break;
                }
            }
        }
        if (mountedElement === null) {
            throw '404';
        }
        this.#expanded = true;
        setTimeout(() => {
            if (!this.#expanded)
                return;
            this.#ignoreNextNonIntersectingEvent = true;
            this.#target.classList.add('expanded');
            proxy.mountedElementRef = new WeakRef(this.#target.nextElementSibling);
        }, exitDelay);
    }
    async onNotIntersecting({ proxy, mountedElementRef, dumpOnExit }) {
        if (this.#ignoreNextNonIntersectingEvent) {
            this.#ignoreNextNonIntersectingEvent = false;
            return;
        }
        const mountedElement = mountedElementRef.deref();
        if (mountedElement === undefined)
            return;
        if (!dumpOnExit) {
            this.#target.innerHTML = '';
            const { beFrozen } = await import('trans-render/lib/freeze.js');
            if (mountedElement.isConnected)
                beFrozen(mountedElement);
            this.#target.content.appendChild(mountedElement);
        }
        this.#target.classList.remove('expanded');
        this.#expanded = false;
        proxy.mountedElementRef = undefined;
    }
    onMounted({ mountedElementRef, options, proxy, enterDelay }) {
        const mountedElement = mountedElementRef.deref();
        if (mountedElement === undefined)
            return;
        const observer = new IntersectionObserver((entries, observer) => {
            for (const entry of entries) {
                proxy.mountedElementNotVisible = !entry.isIntersecting;
            }
        }, options);
        this.#mountedElementObserver = observer;
        proxy.mountedElementNotVisible = false;
        setTimeout(() => {
            observer.observe(mountedElement);
        }, enterDelay);
    }
    finale(proxy, target, beDecorProps) {
        this.disconnect(this);
    }
    disconnect({}) {
        if (this.#templateObserver !== undefined) {
            this.#templateObserver.disconnect();
        }
        if (this.#mountedElementObserver !== undefined) {
            this.#mountedElementObserver.disconnect();
        }
    }
}
const tagName = 'be-intersectional';
const ifWantsToBe = 'intersectional';
const upgrade = 'template';
define({
    config: {
        tagName,
        propDefaults: {
            upgrade,
            ifWantsToBe,
            forceVisible: [upgrade],
            virtualProps: [
                'options', 'templIntersecting', 'templIntersectingEcho', 'enterDelay', 'exitDelay',
                'mountedElementRef', 'mountedElementNotVisible', 'dumpOnExit', 'rootClosest', 'transform', 'host'
            ],
            nonDryProps: ['templIntersecting', 'templIntersectingEcho', 'mountedElementRef', 'mountedElementNotVisible'],
            intro: 'intro',
            finale: 'finale',
            actions: {
                onOptions: 'options',
                onIntersecting: {
                    ifAllOf: ['templIntersecting', 'templIntersectingEcho'],
                    ifKeyIn: ['transform', 'host'],
                },
                onMounted: 'mountedElementRef',
                onNotIntersecting: {
                    ifAllOf: ['mountedElementNotVisible', 'mountedElementRef'],
                }
            },
            proxyPropDefaults: {
                options: {
                    threshold: 0,
                    rootMargin: '0px',
                },
                enterDelay: 30,
                exitDelay: 30,
            }
        },
    },
    complexPropDefaults: {
        controller: BeIntersectional
    }
});
register(ifWantsToBe, upgrade, tagName);
