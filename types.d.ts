import {BeDecoratedProps} from 'be-decorated/types';
export interface BeIntersectionalProps{

}

export interface BeIntersectionalActions{
    intro(proxy: Element & BeIntersectionalProps, target: HTMLTemplateElement, beDecorProps: BeDecoratedProps): void;
}