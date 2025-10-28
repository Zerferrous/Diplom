import {createContext, StrictMode} from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import UserStore from "./store/UserStore.js";

export const Context = createContext(null);

createRoot(document.getElementById('root')).render(
  <StrictMode>
      <Context.Provider value={
          {
              user: new UserStore()
          }
      }>
          <App/>
      </Context.Provider>
  </StrictMode>,
)
