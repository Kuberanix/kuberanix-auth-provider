import React from 'react';
import { PROVIDERS, PROVIDERS_TYPE } from './config';
import verifyToken from './core/verifyToken';
const AuthContext = React.createContext(null);
export default function AuthProvider({ children }) {
  const [user, setUser] = React.useState(null);
  React.useEffect(() => {
    // auto token verification logic here
    const verify = async () => {
      const google_token = localStorage.getItem('google_token');
      if (PROVIDERS[PROVIDERS_TYPE.GOOGLE] && google_token) {
        const user = await verifyToken(google_token);
        if (!user) return;
        const {
          given_name: first_name,
          family_name: last_name,
          email,
          picture: profile,
        } = user;
        setUser({ first_name, last_name, email, profile });
      }
    };
    verify();
  }, []);
  return (
    <AuthContext.Provider value={{ user, setUser }}>
      {children}
    </AuthContext.Provider>
  );
}
export { AuthContext };
