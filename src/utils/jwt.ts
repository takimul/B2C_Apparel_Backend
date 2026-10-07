import jwt from "jsonwebtoken";
import { env } from "../config/env.js";

export interface JwtPayload {
  adminId: string;
  email: string;
  role: "ADMIN" | "SUPER_ADMIN";
}

const JWT_ALGORITHM = "HS256" as const;

export const signAccessToken = (payload: JwtPayload): string => {
  return jwt.sign(payload, env.JWT_SECRET, {
    algorithm: JWT_ALGORITHM,
    expiresIn: env.JWT_EXPIRES_IN,
  } as jwt.SignOptions);
};

export const verifyAccessToken = (token: string): JwtPayload => {
  return jwt.verify(token, env.JWT_SECRET, {
    algorithms: [JWT_ALGORITHM],
  }) as JwtPayload;
};
