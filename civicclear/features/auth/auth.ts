import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { compare } from "bcryptjs";
import { authConfig } from "@/features/auth/auth.config";
import {
  citizenOtpSchema,
  officialLoginSchema,
} from "@/features/auth/schemas";
import { hashOtpCode } from "@/features/auth/otp";
import { prisma } from "@/shared/db/prisma";

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  trustHost: true,
  providers: [
    Credentials({
      id: "official-password",
      name: "Official password",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
        portal: { label: "Portal", type: "text" },
      },
      async authorize(credentials) {
        const parsed = officialLoginSchema.safeParse(credentials);
        if (!parsed.success) return null;

        const user = await prisma.user.findUnique({
          where: { email: parsed.data.email },
        });
        if (!user || !user.active || !user.passwordHash) return null;
        if (user.role !== "official" && user.role !== "admin") return null;

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
        code: { label: "Code", type: "text" },
        name: { label: "Name", type: "text" },
        phone: { label: "Phone", type: "text" },
      },
      async authorize(credentials) {
        const parsed = citizenOtpSchema.safeParse(credentials);
        if (!parsed.success) return null;

        const email = parsed.data.email.toLowerCase();
        const otp = await prisma.loginOtp.findFirst({
          where: { email },
          orderBy: { createdAt: "desc" },
        });

        if (!otp || otp.expiresAt.getTime() < Date.now()) return null;
        if (otp.attempts >= 5) return null;

        const matches = otp.codeHash === hashOtpCode(parsed.data.code);
        if (!matches) {
          await prisma.loginOtp.update({
            where: { id: otp.id },
            data: { attempts: { increment: 1 } },
          });
          return null;
        }

        await prisma.loginOtp.deleteMany({ where: { email } });

        let user = await prisma.user.findUnique({ where: { email } });
        if (!user) {
          if (!parsed.data.name || !parsed.data.phone) return null;
          user = await prisma.user.create({
            data: {
              email,
              name: parsed.data.name,
              phone: parsed.data.phone,
              role: "citizen",
              passwordHash: null,
            },
          });
        }

        if (!user.active || user.role !== "citizen") return null;

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
