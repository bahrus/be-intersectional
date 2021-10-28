import { insertAdjacentTemplate } from 'trans-render/lib/insertAdjacentTemplate.js';
import {define, BeDecoratedProps} from 'be-decorated/be-decorated.js';
import {BeIntersectionalActions, BeIntersectionalProps} from './types';
import {register} from 'be-hive/register.js';

export class BeIntersectional implements BeIntersectionalActions{
    intro(proxy: Element & BeIntersectionalProps, target: HTMLTemplateElement, beDecorProps: BeDecoratedProps){
        let observer;

        let options = {
            root: null,
            rootMargin: "0px",
            threshold: 0
        };
        target.style.display = 'inline-block'
        observer = new IntersectionObserver((entries: IntersectionObserverEntry[], observer: IntersectionObserver) => {
            for(const entry of entries){
                if(entry.isIntersecting){
                    if(target.nextElementSibling === null){
                        target.parentElement!.appendChild(target.content.cloneNode(true));
                    }else{
                        insertAdjacentTemplate(target, target, 'afterend');
                    }
                    target.remove();
                }
            }
        }, options);
        observer.observe(target);
    }
}

export interface BeIntersectional extends BeIntersectionalProps{}

const tagName = 'be-intersectional';

const ifWantsToBe = 'intersectional';

const upgrade = 'template';

define<BeIntersectionalProps & BeDecoratedProps<BeIntersectionalProps, BeIntersectionalActions>, BeIntersectionalActions>({
    config:{
        tagName,
        propDefaults:{
            upgrade,
            ifWantsToBe,
            forceVisible: true,
            virtualProps: [],
            intro: 'intro'
        },
        actions:{

        }
    },
    complexPropDefaults: {
        controller: BeIntersectional
    }
});
register(ifWantsToBe, upgrade, tagName);