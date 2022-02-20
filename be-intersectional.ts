import {define, BeDecoratedProps} from 'be-decorated/be-decorated.js';
import {BeIntersectionalActions, BeIntersectionalProps} from './types';
import {register} from 'be-hive/register.js';

export class BeIntersectional implements BeIntersectionalActions{
    #observer: IntersectionObserver | undefined;
    #removed: boolean = false;
    #target!: HTMLTemplateElement;

    intro(proxy: HTMLTemplateElement & BeIntersectionalProps, target: HTMLTemplateElement, beDecorProps: BeDecoratedProps): void{
        this.#target = target;
    }

    onOptions({options, proxy}: this): void {
        this.disconnect(this);
        const target = this.#target;
        const observer = new IntersectionObserver(async (entries: IntersectionObserverEntry[], observer: IntersectionObserver) => {
            if(this.#removed) return;
            for(const entry of entries){
                const intersecting = entry.isIntersecting;
                proxy.isIntersecting = intersecting;
                setTimeout(() => {
                    proxy.isIntersectingEcho = intersecting;
                }, 30); //make configurable?
            }
        }, options);
        setTimeout(() => {
            observer.observe(target);
        }, 50); 
    }

    async onIntersecting({isIntersecting, isIntersectingEcho}: this) {
        const target = this.#target;
        const clone = target.content.cloneNode(true);
        if(target.nextElementSibling === null){
            target.parentElement!.appendChild(clone);
        }else{
            const {insertAdjacentTemplate} = await import('trans-render/lib/insertAdjacentTemplate.js');
            insertAdjacentTemplate(target, target, 'afterend');
        }
        setTimeout(() => {
            this.#removed = true;
            target.remove();
        }, 16);
    }

    async goPublic({}: this){

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
            virtualProps: ['options', 'isIntersecting', 'isIntersectingEcho'],
            intro: 'intro',
            finale: 'finale',
            actions: {
                'onOptions': 'options',
                'onIntersecting': {
                    ifAllOf: ['isIntersecting', 'isIntersectingEcho'],
                }
            },
            proxyPropDefaults:{
                options: {
                    threshold: 0,
                    rootMargin: '0px'
                }
            }
        },
    },
    complexPropDefaults: {
        controller: BeIntersectional
    }
});
register(ifWantsToBe, upgrade, tagName);