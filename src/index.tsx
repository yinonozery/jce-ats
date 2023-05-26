import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { Provider } from 'mobx-react';
import userStore from './stores/userStore';
import Tracker from './utils/Tracker';
const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  // <React.StrictMode>
  <Provider {...userStore}>
    <Tracker />
    <App />
  </Provider>
  // </React.StrictMode>
);

reportWebVitals();
