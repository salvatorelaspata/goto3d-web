import { z } from "zod";

// Enums matching Supabase database
export const detailsEnum = z.enum(["preview", "reduced", "medium", "full", "raw"]);
export const ordersEnum = z.enum(["unordered", "sequential"]);
export const featuresEnum = z.enum(["normal", "high"]);

// Project creation schema
export const projectSchema = z.object({
  name: z
    .string()
    .min(1, "Il nome è obbligatorio")
    .max(100, "Il nome non può superare i 100 caratteri"),
  description: z
    .string()
    .max(500, "La descrizione non può superare i 500 caratteri")
    .optional()
    .or(z.literal("")),
  detail: detailsEnum,
  order: ordersEnum,
  feature: featuresEnum,
});

// File validation schema
export const fileSchema = z
  .instanceof(File)
  .refine((file) => file.size > 0, "Il file è vuoto")
  .refine(
    (file) => file.size <= 50 * 1024 * 1024,
    "Il file non può superare i 50MB"
  )
  .refine(
    (file) =>
      ["image/jpeg", "image/png", "image/webp", "image/heic", "image/heif"].includes(
        file.type
      ) || file.name.toLowerCase().endsWith(".heic"),
    "Formato immagine non supportato. Usa JPEG, PNG, WebP o HEIC"
  );

export const filesSchema = z
  .array(fileSchema)
  .min(1, "Carica almeno un'immagine")
  .max(20, "Puoi caricare massimo 20 immagini");

// Complete wizard form schema
export const wizardFormSchema = projectSchema.extend({
  files: filesSchema,
});

// Type inference
export type ProjectInput = z.infer<typeof projectSchema>;
export type WizardFormInput = z.infer<typeof wizardFormSchema>;

// Helper to validate FormData
export function validateProjectFormData(formData: FormData) {
  const data = {
    name: formData.get("name"),
    description: formData.get("description"),
    detail: formData.get("detail"),
    order: formData.get("order"),
    feature: formData.get("feature"),
    files: formData.getAll("files").filter((f) => f instanceof File && f.size > 0),
  };

  return wizardFormSchema.safeParse(data);
}
