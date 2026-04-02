import {z} from "zod";

export const PLATE_MAX_LENGTH = 8;

/** Max length for first / last name (aligned with Register.tsx). */
export const NAME_MAX_LENGTH = 50;

/** Firebase hashes passwords; we still enforce a sensible minimum and cap size server-side. */
export const PASSWORD_MIN_LENGTH = 8;
export const PASSWORD_MAX_LENGTH = 128;

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const VALID_VEHICLE_TYPES = ["car", "truck", "motorcycle"] as const;

// All 80 official barangays of Cebu City
export const VALID_BARANGAYS = [
  "Adlaon", "Agsungot", "Apas", "Babag", "Bacayan", "Banilad",
  "Basak Pardo", "Basak San Nicolas", "Binaliw", "Budlaan", "Buhisan",
  "Bulacao", "Buot-Taup Pardo", "Busay", "Calamba", "Cambinocot",
  "Camputhaw", "Capitol Site", "Carreta", "Central Poblacion",
  "Cogon Pardo", "Cogon Ramos", "Day-as", "Duljo", "Ermita",
  "Guadalupe", "Guba", "Hipodromo", "Inayawan", "Kalubihan",
  "Kalunasan", "Kamagayan", "Kasambagan", "Kinasang-an Pardo",
  "Labangon", "Lahug", "Lorega San Miguel", "Lusaran", "Luz",
  "Mabini", "Mabolo", "Malubog", "Manipis", "Nasipit", "Nga-an",
  "Nivel Hills", "Non-oc", "Pari-an", "Pasil", "Pit-os",
  "Poblacion Pardo", "Pulangbato", "Pung-ol Sibugay", "Punta Princesa",
  "Quiot Pardo", "Ramos", "San Antonio", "San Jose",
  "San Nicolas Proper", "San Roque", "Santa Cruz", "Santa Lucia",
  "Santo Niño", "Sapangdaku", "Sawang Calero", "Sinsin", "Sirao",
  "Sudlon I", "Sudlon II", "T. Padilla", "Tabunan", "Tagbao",
  "Talamban", "Taptap", "Tejero", "Tinago", "Tisa", "To-ong Pardo",
  "Tugbongan", "Zapatera",
] as const;

/** Longest official barangay label — for UI caps; whitelist enforces actual value. */
export const BARANGAY_MAX_LENGTH = Math.max(
  0,
  ...VALID_BARANGAYS.map((b) => b.length)
);

// All fuel types matching the GasTypePicker dropdown in Register.tsx
export const VALID_FUEL_TYPES = [
  // Default
  "Diesel", "Premium Unleaded", "Regular Unleaded",
  // Petron
  "Petron Blaze", "Petron Blaze 100", "Petron Diesel", "Petron Diesel Max",
  "Petron Diesel Max Euro 4", "Petron Turbo Diesel", "Petron XCS",
  "Petron XCS Euro 4", "Petron Xtra", "Petron Xtra Advance Euro 4",
  "Petron Xtra Diesel", "Petron Xtra Unleaded",
  // Caltex
  "Caltex Diesel", "Caltex Gold with Techron", "Caltex Platinum with Techron",
  "Caltex Power Diesel with Techron Diesel", "Caltex Premium",
  "Caltex Regular", "Caltex Silver Diesel", "Caltex Silver with Techron",
  // Phoenix
  "Phoenix Diesel", "Phoenix Premium", "Phoenix Regular",
  // Shell
  "Shell FuelSave Diesel", "Shell FuelSave Gasoline",
  "Shell V-Power Diesel", "Shell V-Power Gasoline", "Shell V-Power Racing",
  // Others
  "Premium 95", "Unleaded 91", "Standard Diesel", "V-Power Racing",
  "XCS", "Xtra Advance", "XTRA", "Blaze", "Silver", "Platinum",
] as const;

const VEHICLES = VALID_VEHICLE_TYPES as readonly string[];
const FUELS = VALID_FUEL_TYPES as readonly string[];
const BARANGAYS = VALID_BARANGAYS as readonly string[];

/**
 * Callable payload for `registerResident`. Unknown keys are rejected (`strictObject`).
 */
export const registerResidentSchema = z.strictObject({
  vehicleType: z
    .string()
    .trim()
    .min(1, "Vehicle type is required.")
    .refine((v) => VEHICLES.includes(v), "Invalid vehicle type."),
  plateNo: z
    .string()
    .trim()
    .min(1, "Plate number is required.")
    .max(
      PLATE_MAX_LENGTH,
      `Plate number must be at most ${PLATE_MAX_LENGTH} characters.`
    ),
  fuelType: z
    .string()
    .trim()
    .min(1, "Fuel type is required.")
    .refine((v) => FUELS.includes(v), "Invalid fuel type selected."),
  firstName: z
    .string()
    .trim()
    .min(1, "First name is required.")
    .max(
      NAME_MAX_LENGTH,
      `First name must be at most ${NAME_MAX_LENGTH} characters.`
    ),
  lastName: z
    .string()
    .trim()
    .min(1, "Last name is required.")
    .max(
      NAME_MAX_LENGTH,
      `Last name must be at most ${NAME_MAX_LENGTH} characters.`
    ),
  barangay: z
    .string()
    .trim()
    .min(1, "Barangay is required.")
    .refine((v) => BARANGAYS.includes(v), "Invalid barangay selected."),
  email: z
    .string()
    .trim()
    .min(1, "Email is required.")
    .refine((v) => EMAIL_REGEX.test(v), "Invalid email address."),
  password: z
    .string()
    .min(
      PASSWORD_MIN_LENGTH,
      `Password must be at least ${PASSWORD_MIN_LENGTH} characters.`
    )
    .max(
      PASSWORD_MAX_LENGTH,
      `Password must be at most ${PASSWORD_MAX_LENGTH} characters.`
    )
    .refine(
      (p) => /[A-Za-z]/.test(p) && /\d/.test(p),
      "Password must include at least one letter and one number."
    ),
});

export type RegisterResidentInput = z.infer<typeof registerResidentSchema>;
