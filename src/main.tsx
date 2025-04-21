import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles/index.css'
import App from './App.tsx'
import { Provider } from 'react-redux';
import { store } from './store'; 
import { worker } from './mocks/browser';
import { SocketProvider } from './components/hoc/SocketProvider.tsx'

async function enableMocking() {
  if (import.meta.env.VITE_NODE_ENV === 'DEV') {
    await worker.start({ onUnhandledRequest: 'bypass' });
  }
}

await enableMocking();


createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
      <SocketProvider>
        <App />
      </SocketProvider>
    </Provider>
  </StrictMode>
)
