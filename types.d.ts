import {BeDecoratedProps, MinimalProxy} from 'be-decorated/types';

export interface BeInterseciontalEndUserProps{
    options?: IntersectionObserverInit;
    rootClosest?: string;
    enterDelay?: number;
    exitDelay?: number;
}

export interface BeIntersectionalVirtualProps extends BeInterseciontalEndUserProps, MinimalProxy{
    isIntersecting: boolean;
    isIntersectingEcho: boolean;
}

export type Proxy = Element & BeIntersectionalVirtualProps;

export interface BeIntersectionalProxy extends BeIntersectionalActions, BeIntersectionalVirtualProps{
    proxy: Proxy
}

export type BIP = BeIntersectionalProxy;

export interface BeIntersectionalActions{
    onOptions(bip: BIP): void;

    onIntersecting(bip: BIP): void;

    finale(proxy: Proxy, target: Element, beDecorProps: BeDecoratedProps): void;
}
