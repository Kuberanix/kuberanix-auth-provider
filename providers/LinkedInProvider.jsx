import React from 'react';
import { AuthContext } from '../AuthProvider';
import { LinkedInManager } from '../config';
import LinkedInLogo from '../logos/LinkedInLogo.svg';
import axios from 'axios';
/*
    Article reference during building the LinkedProvider
    https://medium.com/@medyassinechraibi/get-started-with-react-and-linkedin-social-login-9b8505f39668
*/

// default style for linkedin login button
const defaultStyle = {
  display: 'flex',
  maxWidth: '400px',
  minWidth: '200px',
  backgroundColor: '#0084B1',
  color: 'white',
  padding: '5px',
  borderRadius: '6px',
  alignItems: 'center',
  fontWeight: 'bold',
  fontSize: '12px',
  justifyContent: 'space-evenly',
};

/*
    LinkedInProvider
*/
export default function LinkedInProvider({ style = defaultStyle }) {
  const authContext = React.useContext(AuthContext);
  if (!authContext) throw 'Please pass the component inside the Auth provider';
  const { setUser } = authContext;
  const getCodeFromWindowUrl = React.useCallback((url) => {
    const popupWindowURL = new URL(url);
    return popupWindowURL.searchParams.get('code');
  }, []);
  const handlePostMessage = React.useCallback(async (e) => {
    if (e.data.type === 'code') {
      const { code } = e.data;
      const res = await axios.get(`${LinkedInManager.serverUrl}?code=${code}`);
      const { accessToken, ...user } = await res.data;
      localStorage.setItem('linkedin_token', accessToken);
      setUser(user);
    }
  }, []);
  const showPopUp = React.useCallback(() => {
    const { clientId, redirectUrl, oauthUrl, scope, state } = LinkedInManager;
    const url = `${oauthUrl}&client_id=${clientId}&scope=${scope}&state=${state}&redirect_uri=${redirectUrl}`;
    const width = 450;
    const height = 730;
    const left = window.screen.width / 2 - width / 2;
    const top = window.screen.height / 2 - height / 2;
    window.open(
      url,
      'Linkedin',
      'menubar=no,location=no,resizable=no,scrollbars=no,status=no, width=' +
        width +
        ', height=' +
        height +
        ', top=' +
        top +
        ', left=' +
        left,
    );
  }, []);
  React.useEffect(() => {
    if (window.opener && window.opener !== window) {
      const code = getCodeFromWindowUrl(window.location.href);
      window.opener.postMessage({ type: 'code', code: code }, '*');
      window.close();
    }
    window.addEventListener('message', handlePostMessage);
  }, [getCodeFromWindowUrl]);

  return (
    <button onClick={showPopUp} type="button" style={{ ...style }}>
      <img
        src={LinkedInLogo}
        style={{ maxWidth: '25px', maxHeight: '25px', objectFit: 'fill' }}
      />
      Sign in with LinkedIn
    </button>
  );
}
