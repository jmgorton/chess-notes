import React from 'react';
// import ReactDOM from 'react-dom'; // React 17 and earlier
import { createRoot } from 'react-dom/client'; // React 18+
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

// React 17 and earlier 
// ReactDOM.render(
//   <React.StrictMode>
//     <App />
//   </React.StrictMode>,
//   document.getElementById('root')
// );

// React 18+
const container = document.getElementById('root');
const root = createRoot(container);
root.render(<App />);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
