export interface BaseState {
  [key: string]: any;
}

export interface Module {
  name: string;
  states: BaseState;
  mutations: Record<string, (state: any, payload: any) => void>;
  actions: Record<string, (context: any, payload: any) => void | Promise<any>>;
  getters?: Record<string, (state: any) => any>;
}