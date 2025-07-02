import { Secret } from "jsonwebtoken";
import { JwtHelpers } from "../../../helpers/jwt-helpers";

//decode suer
export const decodedUser = (token: string, secret: Secret) => {
	const decoded = JwtHelpers.verifyToken(token, secret);
	return decoded;
};
