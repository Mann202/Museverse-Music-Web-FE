import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter as Router, Route, Link, NavLink, Routes } from "react-router-dom";
import { Navigate } from 'react-router-dom';
import NotFound from './NotFound/NotFound';
import SignIn from './Login-SignUp/SignIn';

//import anh, copy file .txt
//<Route path="/*" element={<Navigate to="/notfound" />} />

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Router>
    </Router>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
