import { unlockAudioOnFirstTap } from './lib/sound'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './fonts.css'
import './index.css'
import App from './App'
import { registerServiceWorker } from './lib/push'

registerServiceWorker()
unlockAudioOnFirstTap()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
