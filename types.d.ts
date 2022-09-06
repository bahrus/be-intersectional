import {BeDecoratedProps, MinimalProxy} from 'be-decorated/types';

export interface EndUserProps{
    options?: IntersectionObserverInit;
    rootClosest?: string;
    observeClosest?: string;
    enterDelay?: number;
    exitDelay?: number;
}

export interface VirtualProps extends EndUserProps, MinimalProxy{
    isIntersecting: boolean;
    isIntersectingEcho: boolean;
    isNotIntersecting: boolean;
    isNotIntersectingEcho: boolean;
}

export type Proxy = Element & VirtualProps;

export interface ProxyProps extends VirtualProps{
    proxy: Proxy;
}

export type PP = ProxyProps;

export interface Actions{
    onOptions(pp: PP): void;

    onIntersecting(pp: PP): void;

    onNotIntersecting(pp: PP): void;

    onIntersectingChange(pp: PP): void;

    onNotIntersectingEcho(pp: PP): void;

    finale(proxy: Proxy, target: Element, beDecorProps: BeDecoratedProps): void;


    
}
