import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { users } from "../db/schema";

export const insertUserSchema = createInsertSchema(users);
export const selectUserSchema = createSelectSchema(users);
