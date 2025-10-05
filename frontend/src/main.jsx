import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import {store} from './redux/store'
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter>
    <Provider store={store}>
    <App />
    </Provider>
    </BrowserRouter>
  </React.StrictMode>
);




// now everything get fetched in div = 'root' >>>>

/**
 * Everything is html and javascript ::>> we have a simple html page with name index.html
 * and we have all js language ::>>> we make the dom manupulation using js into the html page
 * component {in root component}:: document.getElementById('root') :: everything attached in
 * that root div::
 * 
 * 
 * 
 * using react-dom for implementing virtual dom concept for optimisation of page :: 
 */
