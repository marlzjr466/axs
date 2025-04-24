import { jsx } from 'react/jsx-runtime';
import { createContext, useReducer, useContext } from 'react';

const ModuleRegistryContext = createContext(undefined);
const createGlobalStore = (modules) => {
    const Provider = ({ children }) => {
        const registry = {};
        // Loop through all the modules and create the necessary logic
        modules.forEach((mod) => {
            const reducer = (state, action) => {
                const mutation = mod.mutations[action.type];
                if (!mutation)
                    return state;
                const draft = Object.assign({}, state);
                mutation(draft, action.payload);
                return draft;
            };
            const [state, dispatch] = useReducer(reducer, mod.states);
            const commit = (type, payload) => {
                dispatch({ type, payload });
            };
            const boundActions = {};
            Object.entries(mod.actions || {}).forEach(([key, fn]) => {
                boundActions[key] = (payload) => fn({ state, commit, dispatch }, payload);
            });
            const boundGetters = {};
            Object.entries(mod.getters || {}).forEach(([key, getter]) => {
                boundGetters[key] = () => getter(state);
            });
            const boundMutations = {};
            Object.entries(mod.mutations || {}).forEach(([key]) => {
                boundMutations[key] = (payload) => commit(key, payload);
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
        return (jsx(ModuleRegistryContext.Provider, { value: registry, children: children }));
    };
    return { Provider };
};

// core/useModule.ts
const useModule = () => {
    const registry = useContext(ModuleRegistryContext);
    if (!registry)
        throw new Error('useModule must be used inside ModuleProvider');
    const getModule = (moduleName) => {
        const mod = registry[moduleName];
        if (!mod)
            throw new Error(`Module '${moduleName}' not found`);
        return mod;
    };
    const states = (moduleName, keys) => {
        const mod = getModule(moduleName);
        return Object.fromEntries(keys.map((key) => [key, mod.state[key]]));
    };
    const actions = (moduleName, keys) => {
        const mod = getModule(moduleName);
        return Object.fromEntries(keys.map((key) => [key, mod.actions[key]]));
    };
    const mutations = (moduleName, keys) => {
        const mod = getModule(moduleName);
        return Object.fromEntries(keys.map((key) => [key, mod.mutations[key]]));
    };
    const getters = (moduleName, keys) => {
        const mod = getModule(moduleName);
        return Object.fromEntries(keys.map((key) => [key, mod.getters[key]()]));
    };
    return { states, actions, mutations, getters };
};

export { createGlobalStore, useModule };
