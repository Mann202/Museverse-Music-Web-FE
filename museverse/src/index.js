import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter as Router, Route, Link, NavLink, Routes } from "react-router-dom";
import { GoogleOAuthProvider } from '@react-oauth/google';

//<Route path="/*" element={<Navigate to="/notfound" />} />

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <Router>
      <GoogleOAuthProvider clientId="810152862388-0eomepn0d2hkm5j2bau5vasn9br3j0c6.apps.googleusercontent.com">
          <App />
      </GoogleOAuthProvider>
    </Router>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
