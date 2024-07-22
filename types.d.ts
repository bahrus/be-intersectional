import {IEnhancement} from 'trans-render/be/types';

export interface EndUserProps extends IEnhancement{
    options?: IntersectionObserverInit;
    rootClosest?: string;
    observeClosest?: string;
    enterDelay?: number;
    exitDelay?: number;
}

export interface AP extends EndUserProps{
    isIntersecting: boolean;
    isIntersectingEcho: boolean;
    isNotIntersecting: boolean;
    isNotIntersectingEcho: boolean;
}
export type PAP = Partial<AP>;
export type ProPAP = Promise<PAP>;

export interface Actions{

}