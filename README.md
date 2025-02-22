# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type aware lint rules:

- Configure the top-level `parserOptions` property like this:

```js
export default tseslint.config({
  languageOptions: {
    // other options...
    parserOptions: {
      project: ['./tsconfig.node.json', './tsconfig.app.json'],
      tsconfigRootDir: import.meta.dirname,
    },
  },
})
```

- Replace `tseslint.configs.recommended` to `tseslint.configs.recommendedTypeChecked` or `tseslint.configs.strictTypeChecked`
- Optionally add `...tseslint.configs.stylisticTypeChecked`
- Install [eslint-plugin-react](https://github.com/jsx-eslint/eslint-plugin-react) and update the config:

```js
// eslint.config.js
import react from 'eslint-plugin-react'

export default tseslint.config({
  // Set the react version
  settings: { react: { version: '18.3' } },
  plugins: {
    // Add the react plugin
    react,
  },
  rules: {
    // other rules...
    // Enable its recommended rules
    ...react.configs.recommended.rules,
    ...react.configs['jsx-runtime'].rules,
  },
})
```

# Folder Structure and Coding Standard
This is a reference for the project folder structure and coding 
standard for better developer experience

## Project Structure

This section provides an overview of the `src` and `tests` directories and their contents.

### `src` Directory

- **`src/App.tsx`**: The main application component that sets up the router and defines the routes for the application.
- **`src/assets`**: Contains static assets like images and icons.
  - **`src/assets/react.svg`**: An SVG image of the React logo.
- **`src/components`**: Contains reusable React components.
  - **`src/components/counter`**: Contains the counter component.
    - **`src/components/counter/Counter.tsx`**: A React component that displays a counter with increment, decrement, and increment by amount buttons.
    - **`src/components/counter/types.ts`**: (Empty) Presumably for defining types related to the counter component.
  - **`src/components/user_list`**: Contains the user list component.
    - **`src/components/user_list/UserList.tsx`**: A React component that fetches and displays user data.
    - **`src/components/user_list/types.ts`**: (Empty) Presumably for defining types related to the user list component.
  - **`src/components/index.ts`**: Exports the `Counter` and `UserList` components for easier imports.
- **`src/endpoints`**: Contains functions for making API calls.
  - **`src/endpoints/home.ts`**: Contains a function to fetch home page data from an API.
- **`src/main.tsx`**: The entry point of the application that renders the `App` component and sets up the Redux store and MSW worker.
- **`src/mocks`**: Contains mock service worker (MSW) setup for API mocking.
  - **`src/mocks/browser.ts`**: Sets up the MSW worker for browser environments.
  - **`src/mocks/handlers.ts`**: Defines request handlers for the MSW worker.
  - **`src/mocks/server.ts`**: Sets up the MSW server for Node.js environments (used in tests).
- **`src/pages`**: Contains page components.
  - **`src/pages/home`**: Contains the home page component.
    - **`src/pages/home/HomePage.tsx`**: A React component that displays the home page with the `Counter` and `UserList` components. The naming of the Page component should start with the page name and ends with page (HomePage.tsx, AbouUsPage.tsx, etc...)
    - **`src/pages/home/type.ts`**: Defines types related to the home page.
    
  - **`src/pages/index.ts`**: Exports the `HomePage` component for easier imports.
- **`src/routes.ts`**: Defines the routes for the application.
- **`src/slices`**: Contains Redux slices.
  - **`src/slices/counter`**: Contains the counter slice.
    - **`src/slices/counter/counterSlice.ts`**: Defines the Redux slice for the counter, including actions and reducer.
- **`src/store.ts`**: Configures the Redux store and exports types for the store's state and dispatch.
- **`src/styles`**: Contains CSS styles.
  - **`src/styles/index.css`**: Imports Tailwind CSS styles.
- **`src/types`**: Contains TypeScript type definitions.
  - **`src/types/index.ts`**: Defines a `test` interface.
- **`src/vite-env.d.ts`**: Provides TypeScript definitions for Vite.

### `tests` Directory

- **`tests/components`**: Contains tests for React components.
  - **`tests/components/Counter.test.tsx`**: Tests for the `Counter` component.
  - **`tests/components/UserList.test.tsx`**: Tests for the `UserList` component.
- **`tests/setup.ts`**: Sets up global configurations for tests, including extending `expect` with `jest-dom` matchers.
- **`tests/utils`**: Contains utility functions for tests.
  - **`tests/utils/mockApi.ts`**: Provides a function to mock fetch responses.
  - **`tests/utils/testUtils.tsx`**: Provides a custom render function with Redux store for testing.
    
  
  - **`tests/utils/userEventHelper.ts`**: Provides helper functions for user events in tests.
- **`tests/vitest.config.ts`**: Configuration file for Vitest, specifying plugins, test environment, setup files, and coverage reporters.


### Managing Reusable Components

In this project, reusable components are organized within the `src/components` directory. Here are two examples:

#### Counter Component

The `Counter` component is a simple counter with increment, decrement, and increment by amount buttons.

- **`src/components/counter/Counter.tsx`**: The main component file.
- **`src/components/counter/types.ts`**: (Empty) Presumably for defining types related to the counter component.

#### UserList Component

The `UserList` component fetches and displays user data.

- **`src/components/user_list/UserList.tsx`**: The main component file.
- **`src/components/user_list/types.ts`**: (Empty) Presumably for defining types related to the user list component.

Both components are exported from `src/components/index.ts` for easier imports:

```typescript
// filepath: /src/components/index.ts
import Counter from "./counter/Counter";
import UserList from "./user_list/UserList";


export {Counter,UserList}
```

## Naming Convention
### - Directory Naming : 
  - lower case Snake Case (ex: screen_width_listener)

### - .ts files Naming : 
  -  Camel Case (ex: index.ts, useFetchData.ts)

### - .tsx (react components) files Naming : 
  -  Pascal Case (ex: LandingPage.tsx)

### - Variables Naming : 
  -  constant variables: 
      - Upper Case Snake Case (ex: SMALL_SCREEN_NAV_ITEMS)
  -  states/non-constant variables: 
      - Camel Case 
      ```
      // example on the states/non-constant variables naming
      const [fetchedData,setFetchedData]=useState(null);
      let userName='John'
      ```
### - tag-ID/routes Naming : 
  -  Kebab Case (ex: #login-button, /user-profile)