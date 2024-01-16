import React from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider, createHashRouter } from 'react-router-dom';
import Login from './pages/Login';
import Root from './pages/Root';
import NotFound from './pages/NotFound';
import OverView from './pages/OverView';
import About from './pages/About';
import Setting from './pages/Setting';
import GameProfile from './pages/GameProfile';
import ServerConfig from './pages/ServerConfig';

const router = createHashRouter([
  {
    path: "*",
    element: <NotFound/>
  },
  {
    path: '/',
    element: <Root/>
  },
  {
    path: '/login',
    element: <Login />
  },
  {
    path: '/about',
    element: <About />
  },
  {
    path: '/overview',
    element: <OverView/>
  },
  {
    path: '/setting',
    element: <Setting/>
  },
  {
    path: '/gameProfile',
    element: <GameProfile/>
  },
  {
    path: '/serverConfig',
    element: <ServerConfig/>
  }
]);

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <RouterProvider router={router}/>
  </React.StrictMode>
);
