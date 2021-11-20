import React, { useEffect, useState } from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import axios from "axios";

import "./App.css";
import { AuthProvider } from "./context/AuthContext";
import AuthRoute from "./route/AuthRoute";
import PublicRoute from "./route/PublicRoute";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Switch>
          <PublicRoute path="/login" component={Login} />
          <AuthRoute path="/" component={Dashboard} />
        </Switch>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
