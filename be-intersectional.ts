import {define, BeDecoratedProps} from 'be-decorated/be-decorated.js';
import {BeIntersectionalActions, BeIntersectionalProps} from './types';
import {register} from 'be-hive/register.js';

export class BeIntersectional implements BeIntersectionalActions{
    #templateObserver: IntersectionObserver | undefined;
    #mountedElementObserver: IntersectionObserver | undefined;
    #expanded: boolean = false;
    #target!: HTMLTemplateElement;

    intro(proxy: HTMLTemplateElement & BeIntersectionalProps, target: HTMLTemplateElement, beDecorProps: BeDecoratedProps): void{
        this.#target = target;
    }

    async onOptions({options, proxy, enterDelay, rootClosest}: this) {
        this.disconnect(this);
        const target = this.#target;
        if(rootClosest !== undefined){
            const root = target.closest(rootClosest);
            if(root === null){
                throw '404';
            }
            options.root = root;
        }
        const observer = new IntersectionObserver((entries: IntersectionObserverEntry[], observer: IntersectionObserver) => {
            for(const entry of entries){
                const intersecting = entry.isIntersecting;
                proxy.templIntersecting = intersecting;
                setTimeout(() => {
                    try{
                        proxy.templIntersectingEcho = intersecting;//sometimes proxy is revoked
                    }catch(e){}
                    
                }, enterDelay); 
            }
        }, options);
        this.#templateObserver = observer;
        setTimeout(() => {
            observer.observe(target);
        }, enterDelay); 
    }

    async onIntersecting({templIntersecting, templIntersectingEcho, exitDelay, proxy}: this) {
        if(this.#expanded) return;
        const target = this.#target;
        let mountedElement: Element | null = null;
        const clone = target.content.cloneNode(true);
        if(target.nextElementSibling === null){
            target.parentElement!.appendChild(clone);
            mountedElement = target.nextElementSibling as any as Element | null;
        }else{
            const children = Array.from(clone.childNodes);
            for(const child of children){
                if(child instanceof Element){
                    mountedElement = child;
                    target.insertAdjacentElement('afterend', child);
                    break;
                }
            }
            
        }
        if(mountedElement === null){
            throw '404';
        }
        this.#expanded = true;
        setTimeout(() => {
            this.#target.classList.add('expanded');
            proxy.mountedElementRef = new WeakRef(mountedElement!);
            
        }, exitDelay);

    }

    async onNotIntersecting({proxy, mountedElementRef, dumpOnExit}: this){
        const mountedElement = mountedElementRef!.deref();
        if(mountedElement === undefined) return;
        if(!dumpOnExit){
            this.#target.innerHTML = '';
            const {beFrozen} = await import('trans-render/lib/freeze.js');
            if(mountedElement.isConnected) beFrozen(mountedElement);
            this.#target.content.appendChild(mountedElement);
        }
        this.#target.classList.remove('expanded');
        this.#expanded = false;
        proxy.mountedElementRef = undefined;
    }


    onMounted({mountedElementRef, options, proxy, enterDelay}: this): void {
        const mountedElement = mountedElementRef!.deref();
        if(mountedElement === undefined) return;
        const observer = new IntersectionObserver((entries: IntersectionObserverEntry[], observer: IntersectionObserver) => {
            for(const entry of entries){
                proxy.mountedElementNotVisible = !entry.isIntersecting;
            }
        }, options);
        this.#mountedElementObserver = observer;
        proxy.mountedElementNotVisible = false;
        setTimeout(() => {
            observer.observe(mountedElement);
        }, enterDelay); 
    }

    finale(proxy: Element & BeIntersectionalProps, target: HTMLTemplateElement, beDecorProps: BeDecoratedProps){
        this.disconnect(this);
    }

    disconnect({}: this){
        if(this.#templateObserver !== undefined){
            this.#templateObserver.disconnect();
        }
        if(this.#mountedElementObserver !== undefined){
            this.#mountedElementObserver.disconnect();
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
                'options', 'templIntersecting', 'templIntersectingEcho', 'enterDelay', 'exitDelay', 
                'mountedElementRef', 'mountedElementNotVisible', 'dumpOnExit', 'rootUpSearch'
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