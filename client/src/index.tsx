import React from 'react';
import { createRoot } from 'react-dom/client';
import { Auth0Provider } from '@auth0/auth0-react';

import App from './components/App';
import './styles.css';

const DOMAIN = 'dev-apep6d72b660pege.us.auth0.com';
const CLIENT_ID = 'VI4iPrBXS8e06tsvypOpe9wyEy1Ju131';

const app = document.getElementById('app') as HTMLElement;
const root = createRoot(app);

root.render(<Auth0Provider
  domain={DOMAIN || ''}
  clientId={CLIENT_ID || ''}
  authorizationParams={{
    redirect_uri: window.location.origin // change once homepage is created
  }}
>
  <App />
</Auth0Provider>,);
