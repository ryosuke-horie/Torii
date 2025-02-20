import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { staffTokens } from "../db/schema";

export const insertStaffTokenSchema = createInsertSchema(staffTokens);
export const selectStaffTokenSchema = createSelectSchema(staffTokens);
