import { define } from 'be-decorated/be-decorated.js';
import { register } from 'be-hive/register.js';
export class BeIntersectional {
    #observer;
    #target;
    intro(proxy, target, beDecorProps) {
        this.#target = target;
    }
    onOptions({ options }) {
        this.disconnect(this);
        const target = this.#target;
        const observer = new IntersectionObserver(async (entries, observer) => {
            for (const entry of entries) {
                if (entry.isIntersecting) {
                    const clone = target.content.cloneNode(true);
                    if (target.nextElementSibling === null) {
                        target.parentElement.appendChild(clone);
                    }
                    else {
                        const { insertAdjacentTemplate } = await import('trans-render/lib/insertAdjacentTemplate.js');
                        insertAdjacentTemplate(target, target, 'afterend');
                    }
                    setTimeout(() => {
                        target.remove();
                    }, 16);
                }
            }
        }, options);
        setTimeout(() => {
            observer.observe(target);
        }, 50);
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
            virtualProps: ['options'],
            intro: 'intro',
            finale: 'finale',
            actions: {
                'onOptions': {
                    ifAllOf: ['options'],
                }
            },
            proxyPropDefaults: {
                options: {
                    threshold: 0,
                    rootMargin: '0px'
                }
            }
        },
        actions: {}
    },
    complexPropDefaults: {
        controller: BeIntersectional
    }
});
register(ifWantsToBe, upgrade, tagName);
