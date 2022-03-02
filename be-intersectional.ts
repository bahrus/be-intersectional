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

    onOptions({options, proxy, enterDelay}: this): void {
        this.disconnect(this);
        const target = this.#target;
        const observer = new IntersectionObserver((entries: IntersectionObserverEntry[], observer: IntersectionObserver) => {
            if(this.#removed) return;
            for(const entry of entries){
                const intersecting = entry.isIntersecting;
                proxy.isIntersecting = intersecting;
                setTimeout(() => {
                    try{
                        proxy.isIntersectingEcho = intersecting;//sometimes proxy is revoked
                    }catch(e){}
                    
                }, enterDelay); 
            }
        }, options);
        setTimeout(() => {
            observer.observe(target);
        }, enterDelay); 
    }

    async onIntersecting({isIntersecting, isIntersectingEcho, archive, exitDelay, proxy}: this) {
        const target = this.#target;
        const clone = target.content.cloneNode(true);
        let enterElement: Element;
        let exitElement: Element;
        if(target.nextElementSibling === null){
            target.parentElement!.appendChild(clone);
            if(archive){
                let ns = target.nextElementSibling as any as Element | null;
                const firstSibling = ns;
                let lastSibling = ns;
                const refs: WeakRef<Element>[] = [];
                while(ns !== null){
                    refs.push(new WeakRef(ns));
                    lastSibling = ns;
                    ns = ns!.nextElementSibling;
                }
                this.#elements = refs;
                enterElement = firstSibling!;
                exitElement = lastSibling!;
            }

        }else{
            const {insertAdjacentTemplate} = await import('trans-render/lib/insertAdjacentTemplate.js');
            const elements = insertAdjacentTemplate(target, target, 'afterend');
            if(archive){
                this.#elements = elements.map(element => new WeakRef(element));
                enterElement = elements[0];
                exitElement = elements[elements.length - 1];
            }
            
        }
        setTimeout(() => {

            if(archive){
                this.#target.classList.add('expanded');
                proxy.mounted = {
                    enterElement,
                    exitElement,
                };
            }else{
                this.#removed = true;
                this.#target.remove();
            }
        }, exitDelay);

    }

    async onNotIntersecting({proxy}: this){
        if(this.#elements !== undefined){
            for(const element of this.#elements){
                element.deref()?.remove();
            }
            this.#elements = undefined;
        }
        this.#target.classList.remove('expanded');
        proxy.mounted = undefined;
    }

    async goPublic({}: this){

    }

    onMounted({mounted, options, proxy, enterDelay}: this): void {
        const observer = new IntersectionObserver((entries: IntersectionObserverEntry[], observer: IntersectionObserver) => {
            for(const entry of entries){
                const intersecting = entry.isIntersecting;
                if(entry.target === mounted!.enterElement){
                    proxy.enteringElementNotVisible = !intersecting;
                }
                if(entry.target === mounted!.exitElement){
                    proxy.exitingElementNotVisible = !intersecting;
                }
            }
        }, options);
        proxy.enteringElementNotVisible = false;
        proxy.exitingElementNotVisible = false;
        setTimeout(() => {
            observer.observe(mounted!.enterElement);
            observer.observe(mounted!.exitElement);
        }, enterDelay); 
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
            virtualProps: [
                'options', 'isIntersecting', 'isIntersectingEcho', 'archive', 'enterDelay', 'exitDelay', 'mounted',
                'enteringElementNotVisible', 'exitingElementNotVisible',
            ],
            intro: 'intro',
            finale: 'finale',
            actions: {
                onOptions: 'options',
                onIntersecting: {
                    ifAllOf: ['isIntersecting', 'isIntersectingEcho'],
                },
                onMounted: 'mounted',
                onNotIntersecting: {
                    ifAllOf: ['enteringElementNotVisible', 'exitingElementNotVisible'],
                }
            },
            proxyPropDefaults:{
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