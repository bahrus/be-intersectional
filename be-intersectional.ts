import {define, BeDecoratedProps} from 'be-decorated/be-decorated.js';
import {BeIntersectionalActions, BeIntersectionalProps} from './types';
import {register} from 'be-hive/register.js';

export class BeIntersectional implements BeIntersectionalActions{
    #observer: IntersectionObserver | undefined;
    #target!: HTMLTemplateElement;

    intro(proxy: HTMLTemplateElement & BeIntersectionalProps, target: HTMLTemplateElement, beDecorProps: BeDecoratedProps): void{
        this.#target = target;
    }

    onOptions({options}: this): void {
        this.disconnect(this);
        const target = this.#target;
        const observer = new IntersectionObserver(async (entries: IntersectionObserverEntry[], observer: IntersectionObserver) => {
            
            for(const entry of entries){
                if(entry.isIntersecting){
                    const clone = target.content.cloneNode(true);
                    if(target.nextElementSibling === null){
                        target.parentElement!.appendChild(clone);
                    }else{
                        const {insertAdjacentTemplate} = await import('trans-render/lib/insertAdjacentTemplate.js');
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

    finale(proxy: Element & BeIntersectionalProps, target: HTMLTemplateElement, beDecorProps: BeDecoratedProps){
        this.disconnect(this);
    }

    disconnect({}: this){
        if(this.#observer){
            this.#observer.disconnect();
        }
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
            forceVisible: [upgrade],
            virtualProps: ['options'],
            intro: 'intro',
            finale: 'finale',
            actions: {
                'onOptions': {
                    ifAllOf: ['options'],
                }
            },
            proxyPropDefaults:{
                options: {
                    threshold: 0,
                    rootMargin: '0px'
                }
            }
        },
        actions:{

        }
    },
    complexPropDefaults: {
        controller: BeIntersectional
    }
});
register(ifWantsToBe, upgrade, tagName);