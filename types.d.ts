import {BeDecoratedProps} from 'be-decorated/types';
declare class WeakRef<T>{
    deref(): T | undefined;
}
export interface BeIntersectionalVirtualProps{
    options: IntersectionObserverInit;
    rootClosest: string;
    templIntersecting: boolean;
    templIntersectingEcho: boolean;
    enterDelay: number;
    exitDelay: number;
    mountedElementNotVisible: boolean;
    mountedElementRef: WeakRef<Element> | undefined;
    dumpOnExit: boolean;
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