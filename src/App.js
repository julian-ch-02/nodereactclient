import React from "react";
import { BrowserRouter, Switch } from "react-router-dom";

import "./App.css";
import { AuthProvider } from "./context/AuthContext";
import AuthRoute from "./route/AuthRoute";
import PublicRoute from "./route/PublicRoute";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Switch>
          <PublicRoute path="/login" component={Login} />
          <AuthRoute path="/" component={Dashboard} />
        </Switch>
        <ToastContainer />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
