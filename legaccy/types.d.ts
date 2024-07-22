import { ActionOnEventConfigs } from "trans-render/froop/types";
import {IBE} from 'be-enhanced/types';

export interface EndUserProps extends IBE{
    options?: IntersectionObserverInit;
    rootClosest?: string;
    observeClosest?: string;
    enterDelay?: number;
    exitDelay?: number;
}

export interface AllProps extends EndUserProps{
    isIntersecting: boolean;
    isIntersectingEcho: boolean;
    isNotIntersecting: boolean;
    isNotIntersectingEcho: boolean;
}

export interface AllProps extends EndUserProps {}

export type AP = AllProps;

export type PAP = Partial<AP>;

export type ProPAP = Promise<PAP>;

export type POA = [PAP | undefined, ActionOnEventConfigs<PAP, Actions>];


export interface Actions{
    onOptions(self: this): PAP;

    onIntersecting(self: this): void;

    onNotIntersecting(self: this): void;

    onIntersectingChange(self: this): void;

    onNotIntersectingEcho(self: this): void;

    //finale(proxy: Proxy, target: Element, beDecorProps: BeDecoratedProps): void;


    
}
