import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { AuthContext } from '../AuthProvider';
import { GoogleManager, RouteManager } from '../config';
import verifyToken from '../core/verifyToken';
const GoogleContext = createContext(null);
/**
 * this hook will load gsi script
 * @param  options
 * @returns boolean (scriptLoaded)
 */
function useLoadGsiScript(options = {}) {
  const { onScriptLoadSuccess, onScriptLoadFailer } = options;
  const onScriptLoadFailerRef = useRef(onScriptLoadFailer);
  const onScriptLoadSuccessRef = useRef(onScriptLoadSuccess);
  const [scriptLoaded, setScriptLoaded] = useState(false);
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    script.onload = () => {
      setScriptLoaded(true);
      let success = onScriptLoadSuccessRef;
      if (success.current) success.call(onScriptLoadSuccessRef);
    };
    script.onerror = () => {
      setScriptLoaded(false);
      let failer = onScriptLoadFailerRef;
      if (failer.current) failer.call(onScriptLoadFailerRef);
    };
    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    };
  }, []);
  return scriptLoaded;
}
/**
 *
 * @param  {children, onScriptLoadFailer, onScriptLoadSuccess} {React component (button only), function, function}
 * @returns react component
 */
export default function GoogleAuthProvider({
  children,
  onScriptLoadSuccess,
  onScriptLoadFailer,
}) {
  const authContext = useContext(AuthContext);
  if (!authContext) throw 'Please pass the component inside the Auth provider';
  const scriptLoaded = useLoadGsiScript({
    onScriptLoadFailer,
    onScriptLoadSuccess,
  });
  const context = useMemo(
    () => ({ scriptLoaded, client_id: GoogleManager.CLIENT_ID }),
    [GoogleManager.CLIENT_ID, scriptLoaded],
  );
  return (
    <GoogleContext.Provider value={{ context }}>
      {children}
    </GoogleContext.Provider>
  );
}
function useGoogleAuth() {
  const { context } = useContext(GoogleContext);
  if (!context)
    throw 'Please pass the component inside the Google Auth provider';
  return context;
}
function GoogleLogin({
  onSuccess,
  onError,
  style = { theme: 'outline', size: 'large' },
}) {
  const { client_id, scriptLoaded } = useGoogleAuth();
  const { setUser } = React.useContext(AuthContext);
  const handleCallBack = useCallback(async (res) => {
    if (!res || !res.credential) {
      onError();
      return;
    }
    localStorage.setItem('google_token', res.credential);
    const data = await verifyToken(res.credential);
    if (!data) return;
    const {
      given_name: first_name,
      family_name: last_name,
      email,
      picture: profile,
    } = data;
    setUser({ first_name, last_name, email, profile });
    onSuccess(res);
  }, []);
  useEffect(() => {
    if (!scriptLoaded) return;
    const google = window.google;
    if (!google) return;
    google.accounts.id.initialize({
      client_id,
      callback: handleCallBack,
    });
    google.accounts.id.renderButton(document.getElementById('signInButton'), {
      ...style,
    });
  }, [scriptLoaded, handleCallBack]);
  return <div id="signInButton"></div>;
}
function GoogleLogout({ children }) {
  const handleLogout = () => {
    localStorage.removeItem('google_token');
    const origin = window.location.origin;
    window.location.href = `${origin}/${RouteManager.signedOffRedirect}`;
  };
  const ButtonWithOnClick = () => {
    if (React.isValidElement(children)) {
      return React.cloneElement(children, {
        onClick: handleLogout,
        type: 'button',
      });
    }
    return props.children;
  };
  return <ButtonWithOnClick />;
}
export { GoogleLogin, GoogleLogout };
