import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Providers } from '@/shared/redux/provider'
import { BrowserRouter } from 'react-router-dom'

import { GlobalStateProvider } from '@/shared/context/GlobalState.jsx'
import App from './App.jsx'
import './styles/index.css'
import './styles/maplibre-gl.css'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Providers>
      <GlobalStateProvider>
        <BrowserRouter basename='/web/pangeaco/osp'>
          <App />
        </BrowserRouter>
      </GlobalStateProvider>
    </Providers>
  </StrictMode>,
)
