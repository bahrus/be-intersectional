import { define } from 'be-decorated/be-decorated.js';
import { register } from 'be-hive/register.js';
export class BeIntersectional {
    #templateObserver;
    #mountedElementObserver;
    #expanded = false;
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
        const { isVisible } = await import('./isVisible.js');
        const observer = new IntersectionObserver((entries, observer) => {
            for (const entry of entries) {
                let intersecting = entry.isIntersecting;
                if (!intersecting) {
                    intersecting = isVisible(target);
                }
                proxy.templIntersecting = intersecting;
            }
        }, options);
        this.#templateObserver = observer;
        setTimeout(() => {
            observer.observe(target);
        }, enterDelay);
        setTimeout(() => {
            if (isVisible(target)) {
                proxy.templIntersecting = true;
                setTimeout(() => {
                    try {
                        proxy.templIntersectingEcho = true; //sometimes proxy is revoked
                    }
                    catch (e) { }
                }, enterDelay);
            }
        }, 500);
    }
    async onIntersecting({ templIntersecting, templIntersectingEcho, exitDelay, proxy }) {
        if (this.#expanded)
            return;
        const target = this.#target;
        let mountedElement = null;
        const clone = target.content.cloneNode(true);
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
            this.#target.classList.add('expanded');
            proxy.mountedElementRef = new WeakRef(mountedElement);
        }, exitDelay);
    }
    async onNotIntersecting({ proxy, mountedElementRef, dumpOnExit }) {
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
                'mountedElementRef', 'mountedElementNotVisible', 'dumpOnExit', 'rootClosest'
            ],
            intro: 'intro',
            finale: 'finale',
            actions: {
                onOptions: 'options',
                onIntersecting: {
                    ifAllOf: ['templIntersecting', 'templIntersectingEcho'],
                },
                onMounted: 'mountedElementRef',
                onNotIntersecting: 'mountedElementNotVisible',
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
