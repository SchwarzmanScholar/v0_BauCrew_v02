import { z } from "zod";

/**
 * Zod validation schema for job request form
 * Ensures data integrity before submission
 */
export const jobRequestSchema = z.object({
  category: z.enum(
    [
      "ELECTRICIAN",
      "PLUMBER",
      "PAINTING",
      "DRYWALL",
      "HANDYMAN",
      "CARPENTRY",
      "FLOORING",
      "MASONRY",
      "HVAC",
      "OTHER",
    ],
    {
      required_error: "Bitte wähle eine Kategorie",
    }
  ),
  title: z
    .string()
    .min(5, "Titel muss mindestens 5 Zeichen haben")
    .max(100, "Titel darf maximal 100 Zeichen haben"),
  description: z
    .string()
    .min(20, "Beschreibung muss mindestens 20 Zeichen haben")
    .max(2000, "Beschreibung darf maximal 2000 Zeichen haben"),
  addressLine1: z
    .string()
    .min(5, "Adresse muss mindestens 5 Zeichen haben")
    .max(100, "Adresse darf maximal 100 Zeichen haben"),
  addressLine2: z
    .string()
    .max(100, "Adresszusatz darf maximal 100 Zeichen haben")
    .optional()
    .or(z.literal("")),
  city: z
    .string()
    .min(2, "Stadt muss mindestens 2 Zeichen haben")
    .max(50, "Stadt darf maximal 50 Zeichen haben"),
  postalCode: z
    .string()
    .regex(/^\d{5}$/, "Postleitzahl muss genau 5 Ziffern haben"),
  timeframe: z.enum(["ASAP", "NEXT_7_DAYS", "SPECIFIC_DATE"], {
    required_error: "Bitte wähle einen Zeitrahmen",
  }),
  desiredDate: z
    .date()
    .min(new Date(), "Datum muss in der Zukunft liegen")
    .optional(),
  photoUrls: z.array(z.string().url()).optional(),
});

export type JobRequestFormData = z.infer<typeof jobRequestSchema>;

/**
 * Human-readable labels for listing categories
 */
export const ListingCategoryLabels: Record<string, string> = {
  ELECTRICIAN: "Elektriker",
  PLUMBER: "Sanitär & Heizung",
  PAINTING: "Maler & Lackierer",
  DRYWALL: "Trockenbau",
  HANDYMAN: "Allgemeiner Handwerker",
  CARPENTRY: "Tischler & Schreiner",
  FLOORING: "Fliesenleger & Bodenleger",
  MASONRY: "Maurer",
  HVAC: "Klimatechnik",
  OTHER: "Sonstiges",
};

/**
 * Human-readable labels for timeframes
 */
export const JobTimeframeLabels: Record<string, string> = {
  ASAP: "So schnell wie möglich (48h)",
  NEXT_7_DAYS: "Innerhalb 7 Tagen",
  SPECIFIC_DATE: "Zu einem bestimmten Datum",
};
