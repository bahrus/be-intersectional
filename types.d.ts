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

export interface BeIntersectionalProxy extends BeIntersectionalActions, BeIntersectionalVirtualProps{
    proxy: Proxy
}

export type BIP = BeIntersectionalProxy;

export interface BeIntersectionalActions{
    onOptions(bip: BIP): void;

    onIntersecting(bip: BIP): void;

    onIntersectingChange(bip: BIP): void;

    onNotIntersectingEcho({isIntersectingEcho, proxy}: BIP): void;

    finale(proxy: Proxy, target: Element, beDecorProps: BeDecoratedProps): void;
}
