const PROVIDERS_TYPE = {
  LINKEDIN: 'LinkedIn',
  GOOGLE: 'Google',
};
const GoogleManager = {
  CLIENT_ID: env.GOOGLE_CLIENT_ID,
  CLIENT_SECRET: env.GOOGLE_CLIENT_SECRET,
};
const RouteManager = {
  ignoredRoutes: ['/login', '/signup'],
  signedOffRedirect: ['/login'],
};
const LinkedInManager = {
  clientId: env.LINKEDIN_CLIENT_ID,
  clientSecret: env.LINKEDIN_CLIENT_SECRET,
  redirectUrl: '', // your redirect url
  oauthUrl:
    'https://www.linkedin.com/oauth/v2/authorization?response_type=code',
  scope: 'openid%20profile%20email',
  state: '', //randomly generated state eg: 23rjskdf324
  serverUrl: '', //Enter our server url which will verify the code and returns you user and accessToken
};
const PROVIDERS = [PROVIDERS_TYPE.GOOGLE];
export {
  GoogleManager,
  RouteManager,
  PROVIDERS,
  PROVIDERS_TYPE,
  LinkedInManager,
};
