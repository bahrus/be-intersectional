import {BeDecoratedProps} from 'be-decorated/types';

export interface BeIntersectionalVirtualProps{
    options: IntersectionObserverInit;
    isIntersecting: boolean;
    isIntersectingEcho: boolean;
}

export interface BeIntersectionalProps extends BeIntersectionalVirtualProps{
    proxy: HTMLTemplateElement & BeIntersectionalVirtualProps;
}

export interface BeIntersectionalActions{
    intro(proxy: HTMLTemplateElement & BeIntersectionalProps, target: HTMLTemplateElement, beDecorProps: BeDecoratedProps): void;

    onOptions(self: this): void;

    goPublic(self: this): Promise<void>;

    finale(proxy: HTMLTemplateElement & BeIntersectionalProps, target: HTMLTemplateElement, beDecorProps: BeDecoratedProps): void;
}