import { jwtDecode } from "jwt-decode";
const verifyToken = (token: string) => {
  const decoded = jwtDecode(token);
  console.log("Decoded token:", decoded);
  return decoded;
};
export default verifyToken;
