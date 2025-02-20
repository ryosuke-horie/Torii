import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { gyms } from "../db/schema";

export const insertGymSchema = createInsertSchema(gyms, {
	// Zod のパイプライン拡張があればここにカラム別に書ける
	// 例: name に文字数制限を付けたいなど
	// name: z.string().min(1).max(255),
});
export const selectGymSchema = createSelectSchema(gyms);
