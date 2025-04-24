
# `Athena`

A Vuex-like state management system for React, providing a simple and flexible way to manage global state, actions, mutations, and getters. This package allows you to define modular state management in React using a structure similar to Vuex, which makes it easy to scale and maintain complex React applications.

## Features

- **Modular state management**: Easily define modules for different parts of your application.
- **Actions**: Perform async operations and commit mutations to update state.
- **Mutations**: Directly modify the state in a predictable and organized way.
- **Getters**: Extract computed values based on the state.
- **Commit function**: Allows actions to modify the state via mutations.

## Installation

You can install `athena` via npm or yarn:

```bash
npm install @opensource-dev/athena
# or
yarn add @opensource-dev/athena
```

## Package Contents

This package provides the following components:

- **`createGlobalStore`**: A function to create a global store that includes multiple modules.
- **`useModule`**: A custom hook to access state, mutations, actions, and getters from the store.
- **Module Structure**: A pattern to define your state modules with states, mutations, actions, and getters.

## Getting Started

Here’s a guide on how to integrate `athena` into your React or React Native application.

### Step 1: Define Your Modules

Each module will have a structure containing `states`, `mutations`, `actions`, and `getters`.

```ts
import { Module } from '@opensource-dev/athena';

const authModule: Module = () => ({
  name: 'auth',

  states: { 
    username: null,
    loggedIn: false 
  },

  mutations: {
    SET_USERNAME(state, { payload }) {
      state.username = payload
    },

    SET_LOGGED_IN(state, { payload }) {
      state.loggedIn = payload
    }
  },

  actions: {
    async login({ commit }, params) {
      try {
        const response = await apiLogin(params)
        commit('SET_USERNAME', { payload: response.username })
        commit('SET_LOGGED_IN', { payload: true })
        return response
      } catch (error) {
        return { error: { message: error.message } }
      }
    },

    async logout({ commit }) {
      commit('SET_USERNAME', { payload: null })
      commit('SET_LOGGED_IN', { payload: false })
    }
  },

  getters: {
    isLoggedIn(state) {
      return state.loggedIn
    }
  }
})
```

- **`name`**: The name of the module (e.g., `auth`, `cart`).
- **`states`**: The initial state of the module.
- **`mutations`**: The mutations to modify the state.
- **`actions`**: The asynchronous actions that dispatch mutations.
- **`getters`**: The computed values based on the state.

### Step 2: Create a Global Store

Once you have your modules, you can combine them into a global store using `createGlobalStore`. You can then wrap your app in the `Provider` component that this function returns.

```ts
import { createGlobalStore } from '@opensource-dev/athena'
import authModule from './modules/authModule'
import cartModule from './modules/cartModule'  // Example of another module

const { Provider } = createGlobalStore([authModule, cartModule])

const App = () => {
  return (
    <Provider>
      <YourAppComponents />
    </Provider>
  )
}
```

- **`Provider`**: The context provider that makes the global store available to your React components.

### Step 3: Using the Store in Your Components

Once the global store is set up, you can access state, mutations, actions, and getters using the `useModule` hook.

```tsx
import { useModule } from '@opensource-dev/athena'

const LoginComponent = () => {
  const { states, actions } = useModule()
  
  const auth = {
    ...states('auth', ['username', 'loggedIn']),
    ...actions('auth', ['login', 'logout'])
  }

  const handleLogin = async (username: string, password: string) => {
    const response = await auth.login({ username, password })
    if (response.error) {
      console.error(response.error.message);
    }
  }

  return (
    <div>
      {auth.loggedIn ? (
        <p>Welcome, {auth.username}!</p>
      ) : (
        <button onClick={() => handleLogin('user', 'password')}>Login</button>
      )}
    </div>
  )
}
```

In the component:

- **`states('moduleName', ['stateName1', 'stateName2'])`**: Access the state values from the specified module.
- **`actions('moduleName', ['actionName1', 'actionName2'])`**: Access the actions from the specified module.
- **`mutations('moduleName', ['mutationName1', 'mutationName2'])`**: Access the mutations from the specified module.
- **`getters('moduleName', ['getterName1', 'getterName2'])`**: Access the getters from the specified module.

### Step 4: Commiting Mutations

Actions will use the `commit` function to update the state through mutations. This is done automatically within the actions and does not require explicit interaction by the user.

Example of how mutations work within actions:

```ts
actions: {
  async login({ commit }, { username, password }) {
    try {
      const response = await apiLogin({ username, password })
      commit('SET_USERNAME', { payload: response.username })
      commit('SET_LOGGED_IN', { payload: true })
      return response
    } catch (error) {
      return { error: { message: error.message } }
    }
  }
}
```

### Example of a Complete `App.tsx` with Multiple Modules:

```tsx
import React from 'react'
import { useModule } from '@opensource-dev/athena'

const App = () => {
  const { states, actions } = useModule()

  const auth = {
    ...states('auth', ['username', 'loggedIn']),
    ...actions('auth', ['login', 'logout'])
  }

  const handleLogin = async () => {
    await auth.login({ username: 'test', password: 'password' });
  };

  return (
    <div>
      {auth.loggedIn ? (
        <p>Welcome, {auth.username}!</p>
      ) : (
        <button onClick={handleLogin}>Login</button>
      )}
    </div>
  );
};

export default App
```

---

## API

### `createGlobalStore(modules: Module[])`

- **Description**: Creates a global store by combining multiple modules.
- **Parameters**:
  - `modules`: An array of module functions that define the state, actions, mutations, and getters for the store.
- **Returns**: An object containing the `Provider` component to wrap your app.

### `useModule()`

- **Description**: A custom hook to access the global store.
- **Returns**: An object with `states`, `actions`, `mutations`, and `getters`.
  - `states(moduleName, stateNames)`: Get the specified states from the module.
  - `actions(moduleName, actionNames)`: Get the specified actions from the module.
  - `mutations(moduleName, mutationNames)`: Get the specified mutations from the module.
  - `getters(moduleName, getterNames)`: Get the specified getters from the module.

---

## License

This project is licensed under the MIT License