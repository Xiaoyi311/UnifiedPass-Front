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
import CapeManage from './pages/CapeManage';
import { GoogleReCaptchaProvider } from 'react-google-recaptcha-v3';
import UserManage from './pages/UserManage';
import OAuthReq from './pages/OAuthReq';
import OAuthManager from './pages/OAuthManager';

const router = createHashRouter([
  {
    path: "*",
    element: <NotFound />
  },
  {
    path: '/',
    element: <Root />
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
    element: <OverView />
  },
  {
    path: '/setting',
    element: <Setting />
  },
  {
    path: '/gameProfile',
    element: <GameProfile />
  },
  {
    path: '/capeManage',
    element: <CapeManage />
  },
  {
    path: '/userManage',
    element: <UserManage />
  },
  {
    path: '/oauthReq',
    element: <OAuthReq />
  },
  {
    path: '/oauthManager',
    element: <OAuthManager />
  }
]);

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <GoogleReCaptchaProvider
      reCaptchaKey='6Lc7slgpAAAAAHJi6fjVajeS-yidHieeZ3k3MPrO'
      useRecaptchaNet={true}
    >
      <RouterProvider router={router} />
    </GoogleReCaptchaProvider>
  </React.StrictMode>
);
