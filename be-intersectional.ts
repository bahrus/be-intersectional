import {define, BeDecoratedProps} from 'be-decorated/be-decorated.js';
import {BeIntersectionalActions, BeIntersectionalProps} from './types';
import {register} from 'be-hive/register.js';

export class BeIntersectional implements BeIntersectionalActions{
    #observer: IntersectionObserver | undefined;
    #removed: boolean = false;
    #target!: HTMLTemplateElement;
    #elements: WeakRef<Element>[] | undefined;

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
                    try{
                        proxy.isIntersectingEcho = intersecting;//sometimes proxy is revoked
                    }catch(e){}
                    
                }, 30); //make configurable?
            }
        }, options);
        setTimeout(() => {
            observer.observe(target);
        }, 50); 
    }

    async onIntersecting({isIntersecting, isIntersectingEcho, archive}: this) {
        const target = this.#target;
        const clone = target.content.cloneNode(true);

        if(target.nextElementSibling === null){
            target.parentElement!.appendChild(clone);
            if(archive){
                let ns = target.nextElementSibling as any as Element | null;
                const refs: WeakRef<Element>[] = [];
                while(ns !== null){
                    refs.push(new WeakRef(ns));
                    ns = ns!.nextElementSibling;
                }
                this.#elements = refs;
            }

        }else{
            const {insertAdjacentTemplate} = await import('trans-render/lib/insertAdjacentTemplate.js');
            const elements = insertAdjacentTemplate(target, target, 'afterend');
            if(archive){
                this.#elements = elements.map(element => new WeakRef(element));
            }
            
        }
        if(!archive){
            setTimeout(() => {
                this.#removed = true;
                target.remove();
            }, 16);
        }

    }

    async onNotIntersecting({}: this){
        if(this.#elements !== undefined){
            for(const element of this.#elements){
                element.deref()?.remove();
            }
            this.#elements = undefined;
        }
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
            proxyPropDefaults:{
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