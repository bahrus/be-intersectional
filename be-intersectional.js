import { define } from 'be-decorated/be-decorated.js';
import { register } from 'be-hive/register.js';
export class BeIntersectional {
    #observer;
    #removed = false;
    #target;
    #elements;
    intro(proxy, target, beDecorProps) {
        this.#target = target;
    }
    onOptions({ options, proxy }) {
        this.disconnect(this);
        const target = this.#target;
        const observer = new IntersectionObserver(async (entries, observer) => {
            if (this.#removed)
                return;
            for (const entry of entries) {
                const intersecting = entry.isIntersecting;
                proxy.isIntersecting = intersecting;
                setTimeout(() => {
                    try {
                        proxy.isIntersectingEcho = intersecting; //sometimes proxy is revoked
                    }
                    catch (e) { }
                }, 30); //make configurable?
            }
        }, options);
        setTimeout(() => {
            observer.observe(target);
        }, 50);
    }
    async onIntersecting({ isIntersecting, isIntersectingEcho, archive }) {
        const target = this.#target;
        const clone = target.content.cloneNode(true);
        if (target.nextElementSibling === null) {
            target.parentElement.appendChild(clone);
            if (archive) {
                let ns = target.nextElementSibling;
                const refs = [];
                while (ns !== null) {
                    refs.push(new WeakRef(ns));
                    ns = ns.nextElementSibling;
                }
                this.#elements = refs;
            }
        }
        else {
            const { insertAdjacentTemplate } = await import('trans-render/lib/insertAdjacentTemplate.js');
            const elements = insertAdjacentTemplate(target, target, 'afterend');
            if (archive) {
                this.#elements = elements.map(element => new WeakRef(element));
            }
        }
        if (archive) {
            target.classList.add('expanded');
        }
        else {
            setTimeout(() => {
                this.#removed = true;
                target.remove();
            }, 16);
        }
    }
    async onNotIntersecting({}) {
        if (this.#elements !== undefined) {
            for (const element of this.#elements) {
                element.deref()?.remove();
            }
            this.#elements = undefined;
        }
        this.#target.classList.remove('expanded');
    }
    async goPublic({}) {
    }
    finale(proxy, target, beDecorProps) {
        this.disconnect(this);
    }
    disconnect({}) {
        if (this.#observer) {
            this.#observer.disconnect();
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
            virtualProps: ['options', 'isIntersecting', 'isIntersectingEcho', 'archive'],
            intro: 'intro',
            finale: 'finale',
            actions: {
                onOptions: 'options',
                onIntersecting: {
                    ifAllOf: ['isIntersecting', 'isIntersectingEcho'],
                },
                onNotIntersecting: {
                    ifNoneOf: ['isIntersecting', 'isIntersectingEcho'],
                }
            },
            proxyPropDefaults: {
                options: {
                    threshold: 0,
                    rootMargin: '0px'
                },
            }
        },
    },
    complexPropDefaults: {
        controller: BeIntersectional
    }
});
register(ifWantsToBe, upgrade, tagName);
