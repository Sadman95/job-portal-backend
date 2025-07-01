import jwt, { JwtPayload, Secret, SignOptions } from 'jsonwebtoken'

const generateJwtToken = (
  payload: string | Buffer | object,
  secret: Secret,
  expiresTime:  string
): string => {
  return jwt.sign(payload, secret, { expiresIn: expiresTime } as SignOptions)
}

const verifyToken = (token: string, secret: Secret): JwtPayload => {
  return jwt.verify(token, secret) as JwtPayload
}

export const JwtHelpers = {
  generateJwtToken,
  verifyToken,
}
