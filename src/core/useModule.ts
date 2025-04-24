// core/useModule.ts
import { useContext } from 'react';
import { ModuleRegistryContext } from './registry';

export const useModule = () => {
  const registry = useContext(ModuleRegistryContext);
  if (!registry) throw new Error('useModule must be used inside ModuleProvider');

  const getModule = (moduleName: string) => {
    const mod = registry[moduleName];
    if (!mod) throw new Error(`Module '${moduleName}' not found`);
    return mod;
  };

  const states = (moduleName: string, keys: string[]) => {
    const mod = getModule(moduleName);
    return Object.fromEntries(keys.map((key) => [key, mod.state[key]]));
  };

  const actions = (moduleName: string, keys: string[]) => {
    const mod = getModule(moduleName);
    return Object.fromEntries(keys.map((key) => [key, mod.actions[key]]));
  };

  const mutations = (moduleName: string, keys: string[]) => {
    const mod = getModule(moduleName);
    return Object.fromEntries(keys.map((key) => [key, mod.mutations[key]]));
  };

  const getters = (moduleName: string, keys: string[]) => {
    const mod = getModule(moduleName);
    return Object.fromEntries(keys.map((key) => [key, mod.getters[key]()]));
  };

  return { states, actions, mutations, getters };
};
