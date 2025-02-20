import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { staff } from "../db/schema";

export const insertStaffSchema = createInsertSchema(staff, {
	// 例: email をさらに厳密なメールフォーマットにしたい
	// email: z.string().email(),
	// password の長さ制限など
	// password: z.string().min(8),
});
export const selectStaffSchema = createSelectSchema(staff);
