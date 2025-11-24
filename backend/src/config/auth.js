import {auth} from 'express-openid-connect';

const config = {
  authRequired: false,
  auth0Logout: true,
  secret: process.env.AUTH0_SECRET,
  baseURL: process.env.AUTH0_BASE_URL,
  clientID: process.env.AUTH0_CLIENT_ID,
  issuerBaseURL: process.env.AUTH0_ISSUER_BASE_URL,

  authorizationParams: {
    response_type: 'code',
    scope: 'openid profile email',
  },

  routes: {
    callback: '/auth/callback',
    login: '/auth/login',
    logout: '/auth/logout'
  }
};

export const authMiddleware = auth(config);