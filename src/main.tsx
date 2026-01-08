import { createRoot } from 'react-dom/client'
import { ErrorBoundary } from "react-error-boundary";
import "@github/spark/spark"

import App from './App.tsx'
import { ErrorFallback } from './ErrorFallback.tsx'
import { validateEnv, logEnvironmentInfo } from './config/env'

import "./main.css"
import "./styles/theme.css"
import "./index.css"

// Validate and log environment configuration
validateEnv()
logEnvironmentInfo()

createRoot(document.getElementById('root')!).render(
  <ErrorBoundary FallbackComponent={ErrorFallback}>
    <App />
   </ErrorBoundary>
)
