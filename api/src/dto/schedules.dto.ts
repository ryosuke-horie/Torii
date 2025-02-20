import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { schedules } from "../db/schema";

export const insertScheduleSchema = createInsertSchema(schedules);
export const selectScheduleSchema = createSelectSchema(schedules);
