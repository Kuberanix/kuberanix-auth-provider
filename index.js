import AuthProvider, { AuthContext } from './AuthProvider';
import GoogleAuthProvider, {
  GoogleLogin,
  GoogleLogout,
} from './providers/GoogleProvider';
import { LinkedInManager, GoogleManager } from './config';
import LinkedProvider from './providers/LinkedInProvider';
import verifyToken from './core/verifyToken';
export default AuthProvider;
export {
  GoogleAuthProvider,
  GoogleLogin,
  GoogleLogout,
  AuthContext,
  verifyToken,
  LinkedInManager,
  LinkedProvider,
  GoogleManager,
};
