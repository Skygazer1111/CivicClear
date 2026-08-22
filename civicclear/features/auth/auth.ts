import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { compare } from "bcryptjs";
import { authConfig } from "@/features/auth/auth.config";
import {
  citizenOtpProofSchema,
  passwordLoginSchema,
} from "@/features/auth/schemas";
import { verifyCitizenLoginProof } from "@/features/auth/otp";
import { prisma } from "@/shared/db/prisma";

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  trustHost: true,
  providers: [
    Credentials({
      id: "password",
      name: "Email and password",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const parsed = passwordLoginSchema.safeParse(credentials);
        if (!parsed.success) return null;

        const user = await prisma.user.findUnique({
          where: { email: parsed.data.email.toLowerCase().trim() },
        });
        if (!user || !user.active || !user.passwordHash) return null;

        const valid = await compare(parsed.data.password, user.passwordHash);
        if (!valid) return null;

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        };
      },
    }),
    Credentials({
      id: "citizen-otp",
      name: "Citizen OTP",
      credentials: {
        email: { label: "Email", type: "email" },
        proof: { label: "Proof", type: "text" },
      },
      async authorize(credentials) {
        const parsed = citizenOtpProofSchema.safeParse(credentials);
        if (!parsed.success) return null;

        const email = parsed.data.email.toLowerCase().trim();
        if (!verifyCitizenLoginProof(email, parsed.data.proof)) return null;

        const user = await prisma.user.findUnique({ where: { email } });
        if (!user || !user.active || user.role !== "citizen") return null;

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        };
      },
    }),
  ],
});
