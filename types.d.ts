import {BeDecoratedProps} from 'be-decorated/types';
declare class WeakRef<T>{
    deref(): T | undefined;
}

export interface BeIntersectionalEndUserProps {
    options: IntersectionObserverInit;
    dumpOnExit: boolean;
    transform: any | any[];
    enterDelay: number;
    exitDelay: number;
}
export interface BeIntersectionalVirtualProps extends BeIntersectionalEndUserProps {
    
    rootClosest: string;
    templIntersecting: boolean;
    templIntersectingEcho: boolean;
    mountedElementNotVisible: boolean;
    mountedElementRef: WeakRef<Element> | undefined;
    host: any;
}


export interface BeIntersectionalProps extends BeIntersectionalVirtualProps{
    proxy: HTMLTemplateElement & BeIntersectionalVirtualProps;
}

export interface BeIntersectionalActions{
    intro(proxy: HTMLTemplateElement & BeIntersectionalProps, target: HTMLTemplateElement, beDecorProps: BeDecoratedProps): void;

    onOptions(self: this): void;

    onIntersecting(self: this): void;

    onNotIntersecting(self: this): void;

    onMounted(self: this): void;

    finale(proxy: HTMLTemplateElement & BeIntersectionalProps, target: HTMLTemplateElement, beDecorProps: BeDecoratedProps): void;
}