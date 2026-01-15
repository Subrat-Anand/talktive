import { ChakraProvider } from "@chakra-ui/react";
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from "react-router-dom";
import App from './App.jsx'
import "./index.css";   // 👈 YAHAN
import { Provider } from "react-redux";
import store from './redux/store.jsx'


createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <BrowserRouter>
      <ChakraProvider>
        <App/>
      </ChakraProvider>
    </BrowserRouter>
  </Provider>
)
