/**
 * This file consist of code example how can you setup linkedin
 * token process in server
 */

// dependencies
import axios from 'axios';
import qs from 'query-string';

// linked api urls
const urlToGetLinkedInAccessToken =
  'https://www.linkedin.com/oauth/v2/accessToken';
const getUser = 'https://api.linkedin.com/v2/userinfo';

const LinkedInManager = {
  clientId: env.clientId,
  clientSecret: env.clientSecret,
  redirectUrl: env.redirectUrl,
  oauthUrl:
    'https://www.linkedin.com/oauth/v2/authorization?response_type=code',
  scope: 'openid%20profile%20email',
  state: '',
};

async function getAccessToken(code) {
  let accessToken = null;
  const config = {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': 'true',
    },
  };
  const parameters = {
    grant_type: 'authorization_code',
    code: code,
    redirect_uri: LinkedInManager.redirectUrl,
    client_id: LinkedInManager.clientId,
    client_secret: LinkedInManager.clientSecret,
  };
  try {
    const res = await axios.post(
      urlToGetLinkedInAccessToken,
      qs.stringify(parameters),
      config,
    );
    accessToken = await res.data['access_token'];
  } catch (error) {
    console.log('Error getting LinkedIn access token');
  }
  return accessToken;
}

/**
 * @return user first and last name and profile image URL
 * @param accessToken returned from step 2
 */
async function getUserProfile(accessToken) {
  let userProfile = null;
  const config = {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  };
  try {
    const res = await axios.get(getUser, config);
    let user = {};
    user.first_name = res.data['given_name'];
    user.last_name = res.data['family_name'];
    user.profile = res.data['picture'];
    user.email = res.data['email'];
    userProfile = user;
  } catch (error) {
    console.log(error);
    console.log('Error grabbing user profile');
  }
  return userProfile;
}
/**
 * This will trigger all the api
 * getAccessToken, getUserProfile, getUserEmail
 * @param  code
 * @returns
 */
async function getUserCredentials(code) {
  const accessToken = await getAccessToken(code);
  const userProfile = await getUserProfile(accessToken);
  return { ...userProfile, accessToken };
}
server.get('/', async (req, res) => {
  const code = req.query.code;
  const user = await getUserCredentials(code);
  return res.status(200).json(user);
});
server.listen(PORT, () => console.log('Listening to port: ', PORT));
