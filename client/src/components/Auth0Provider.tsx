// import React from 'react';
// import { createRoot } from 'react-dom/client';
// import { Auth0Provider } from '@auth0/auth0-react';
// import App from './App';

// const { DOMAIN, CLIENT_ID } = process.env;

// const root = createRoot(document.getElementById('root') as HTMLElement);

// root.render(
//   <Auth0Provider
//     domain={DOMAIN || ''}
//     clientId={CLIENT_ID || ''}
//     authorizationParams={{
//       redirect_uri: window.location.origin // change once homepage is created
//     }}
//   >
//     <App />
//   </Auth0Provider>,
// );