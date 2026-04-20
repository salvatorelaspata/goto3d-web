import { z } from "zod";

export const authSchema = z.object({
  email: z.string().email("invalidEmail"),
  password: z.string().min(8, "passwordTooShort"),
});

export type AuthState = {
  errors?: {
    email?: string;
    password?: string;
  };
  message?: string;
};
