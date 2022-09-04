import {BeDecoratedProps, MinimalProxy} from 'be-decorated/types';

export interface BeInterseciontalEndUserProps{
    options?: IntersectionObserverInit;
    rootClosest?: string;
    observeClosest?: string;
    enterDelay?: number;
    exitDelay?: number;
}

export interface BeIntersectionalVirtualProps extends BeInterseciontalEndUserProps, MinimalProxy{
    isIntersecting: boolean;
    isIntersectingEcho: boolean;
    isNotIntersecting: boolean;
    isNotIntersectingEcho: boolean;
}

export type Proxy = Element & BeIntersectionalVirtualProps;

export interface ProxyProps extends BeIntersectionalVirtualProps{
    proxy: Proxy;
}

export type PP = ProxyProps;

export interface BeIntersectionalActions{
    onOptions(pp: PP): void;

    onIntersecting(pp: PP): void;

    onNotIntersecting(pp: PP): void;

    onIntersectingChange(pp: PP): void;

    onNotIntersectingEcho(pp: PP): void;

    finale(proxy: Proxy, target: Element, beDecorProps: BeDecoratedProps): void;


    
}
