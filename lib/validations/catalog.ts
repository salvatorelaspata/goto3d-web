import { z } from "zod";

export const catalogSchema = z.object({
  title: z
    .string()
    .min(1, "Il titolo è obbligatorio")
    .max(100, "Il titolo non può superare i 100 caratteri"),
  description: z
    .string()
    .max(500, "La descrizione non può superare i 500 caratteri")
    .optional()
    .or(z.literal("")),
  visibility: z.enum(["true", "false"]).optional(),
});

export type CatalogInput = z.infer<typeof catalogSchema>;
