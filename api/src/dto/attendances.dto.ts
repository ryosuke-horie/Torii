import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { attendances } from "../db/schema";

export const insertAttendanceSchema = createInsertSchema(attendances);
export const selectAttendanceSchema = createSelectSchema(attendances);
