import { insertAdjacentTemplate } from 'trans-render/lib/insertAdjacentTemplate.js';
import { define } from 'be-decorated/be-decorated.js';
import { register } from 'be-hive/register.js';
export class BeIntersectional {
    intro(proxy, target, beDecorProps) {
        let observer;
        let options = {
            root: null,
            rootMargin: "0px",
            threshold: 0
        };
        target.style.display = 'inline-block';
        observer = new IntersectionObserver((entries, observer) => {
            for (const entry of entries) {
                if (entry.isIntersecting) {
                    if (target.nextElementSibling === null) {
                        target.parentElement.appendChild(target.content.cloneNode(true));
                    }
                    else {
                        insertAdjacentTemplate(target, target, 'afterend');
                    }
                    target.remove();
                }
            }
        }, options);
        observer.observe(target);
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
            forceVisible: true,
            virtualProps: [],
            intro: 'intro'
        },
        actions: {}
    },
    complexPropDefaults: {
        controller: BeIntersectional
    }
});
register(ifWantsToBe, upgrade, tagName);
