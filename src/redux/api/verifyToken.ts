// import { jwtDecode } from "jwt-decode";
// const verifyToken = (token: string) => {
//   const decoded = jwtDecode(token);
//   return decoded;
// };

import { jwtDecode } from "jwt-decode";

// export default verifyToken;
interface DecodedToken {
  userId: string;
  exp: number;
}

// Example function to decode the token
const decodeToken = (token: string): DecodedToken => {
  return jwtDecode<DecodedToken>(token);
};
export default decodeToken;
