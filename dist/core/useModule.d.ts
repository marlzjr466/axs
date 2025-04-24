export declare const useModule: () => {
    states: (moduleName: string, keys: string[]) => {
        [k: string]: any;
    };
    actions: (moduleName: string, keys: string[]) => {
        [k: string]: any;
    };
    mutations: (moduleName: string, keys: string[]) => {
        [k: string]: any;
    };
    getters: (moduleName: string, keys: string[]) => {
        [k: string]: any;
    };
};
