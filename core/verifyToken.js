import jwtDecode from 'jwt-decode';
const verifyToken = async (token) => {
  let data = null;
  try {
    data = await jwtDecode(token);
  } catch (error) {
    console.log(error);
  }
  return data;
};
export default verifyToken;
