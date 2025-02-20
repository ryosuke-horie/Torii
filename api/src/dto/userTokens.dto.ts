import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { userTokens } from "../db/schema";

export const insertUserTokenSchema = createInsertSchema(userTokens);
export const selectUserTokenSchema = createSelectSchema(userTokens);
