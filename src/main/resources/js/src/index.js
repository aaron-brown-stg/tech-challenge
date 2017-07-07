import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import Api from './Api';
import registerServiceWorker from './registerServiceWorker';
import './index.css';

ReactDOM.render(<App baseUrl="/api" api={Api} />, document.getElementById('root'));
registerServiceWorker();
