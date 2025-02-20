import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { userImages } from "../db/schema";

export const insertUserImageSchema = createInsertSchema(userImages);
export const selectUserImageSchema = createSelectSchema(userImages);
