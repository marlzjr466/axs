import { ReactNode } from 'react';
import { Module } from '../types';
type ModuleMap = Record<string, any>;
export declare const ModuleRegistryContext: import("react").Context<ModuleMap | undefined>;
export declare const createGlobalStore: (modules: Module[]) => {
    Provider: ({ children }: {
        children: ReactNode;
    }) => import("react/jsx-runtime").JSX.Element;
};
export {};
