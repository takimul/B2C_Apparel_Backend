import { prisma } from "../../config/prisma.js";
import { AppError } from "../../utils/appError.js";
import { comparePassword } from "../../utils/password.js";
import { signAccessToken } from "../../utils/jwt.js";

interface LoginInput {
  email: string;
  password: string;
}

export const loginAdmin = async ({ email, password }: LoginInput) => {
  const admin = await prisma.admin.findUnique({
    where: {
      email: email.toLowerCase(),
    },
  });

  if (!admin || !admin.isActive) {
    throw new AppError("Invalid email or password", 401);
  }

  const passwordMatches = await comparePassword(password, admin.passwordHash);

  if (!passwordMatches) {
    throw new AppError("Invalid email or password", 401);
  }

  const token = signAccessToken({
    adminId: admin.id,
    email: admin.email,
    role: admin.role,
  });

  return {
    token,

    admin: {
      id: admin.id,
      name: admin.name,
      email: admin.email,
      role: admin.role,
    },
  };
};
