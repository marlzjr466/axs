// src/core/registry.tsx
import { createContext, useReducer, ReactNode } from 'react';
import { Module } from '../types';

type ModuleMap = Record<string, any>; // Adjust this type to your actual structure
export const ModuleRegistryContext = createContext<ModuleMap | undefined>(undefined);

export const createGlobalStore = (modules: Module[]) => {

  const Provider = ({ children }: { children: ReactNode }) => {
    const registry: ModuleMap = {};

    // Loop through all the modules and create the necessary logic
    modules.forEach((mod) => {
      const reducer = (state: any, action: { type: string; payload?: any }) => {
        const mutation = mod.mutations[action.type];
        if (!mutation) return state;
        const draft = { ...state };
        mutation(draft, action.payload);
        return draft;
      };

      const [state, dispatch] = useReducer(reducer, mod.states);

      const commit = (type: string, payload?: any) => {
        dispatch({ type, payload });
      };

      const boundActions: Record<string, Function> = {};
      Object.entries(mod.actions || {}).forEach(([key, fn]) => {
        boundActions[key] = (payload?: any) =>
          fn({ state, commit, dispatch }, payload);
      });

      const boundGetters: Record<string, any> = {};
      Object.entries(mod.getters || {}).forEach(([key, getter]) => {
        boundGetters[key] = () => getter(state);
      });

      const boundMutations: Record<string, Function> = {};
      Object.entries(mod.mutations || {}).forEach(([key]) => {
        boundMutations[key] = (payload?: any) => commit(key, payload);
      });

      registry[mod.name] = {
        state,
        dispatch,
        commit,
        actions: boundActions,
        getters: boundGetters,
        mutations: boundMutations,
      };
    });

    return (
      <ModuleRegistryContext.Provider value={registry}>
        {children}
      </ModuleRegistryContext.Provider>
    );
  };

  return { Provider };
};
