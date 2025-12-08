import { createContext } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import './index.css';
import App from './App';
import Store from './store/store';

interface State {
  store: Store;
}

const store = new Store();

export const Context = createContext<State>({
  store,
});

const rootElement = document.getElementById('root')!;
const root = createRoot(rootElement);

root.render(
  <BrowserRouter>
    <Context.Provider
      value={{
        store,
      }}
    >
      <App />
    </Context.Provider>
  </BrowserRouter>,
);
