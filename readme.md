# Installation

```shell
cd ./ #root directory of our project
git clone project

```

# Dependencies
Client Side
1. Axios

Server Side
1. Axios
2. query-string

## Setting up the config file
```js
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

```

# Usage

#### Wrapping the component inside auth provider

```js
import AuthProvider from 'core-modules-auth-provider/AuthProvider';
```

Wrap the component inside `AuthProvider` where you want to use Auth

```js
<AuthProvider>
  <App />
</AuthProvider>
```

- This will return user 
- Initially `null` but when user logges in it will return a user object
```js
user = {
  first_name:'a',
  last_name:'b',
  profile:'a',
  email:'a@a'
}
```

## Note

If you are using auth  in more than one components then its, prefered to wrap the whole <App/> component inside the `AuthProvider`

## Using Google Provider
- First wrap the Google Provider inside the AuthProvider
- Then you GoogleLogin and GoogleLogout inside the GoogleProvider
```js
  <AuthProvider>
    <GoogleProvider
    onScriptLoadSuccess = {()=>{}},
    onScriptLoadFailer = {()=>},
    >
    <GoogleLogin
      onSuccess = {(res)=>{}}
      onError = {()=>{}}
      style={}
    />
    </GoogleProvider>
  </AuthProvider>
```
