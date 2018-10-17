import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import Router from "react-router-dom/es/Router";
import createBrowserHistory from 'history/createBrowserHistory';

const newHistory = createBrowserHistory();
newHistory.push('/');
ReactDOM.render((
    <Router history={newHistory}>
        <App />
    </Router>
    ), document.getElementById('root')
);
registerServiceWorker();
