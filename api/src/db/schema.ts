import {
	integer,
	sqliteTable as table,
	text,
	// index, uniqueIndex, primaryKey など必要に応じて
} from "drizzle-orm/sqlite-core";

/* ======================================
  1) gyms: ジムそのもの
     - 最上位のジム情報を管理
====================================== */
export const gyms = table("gyms", {
	id: integer("id").primaryKey({ autoIncrement: true }),
	name: text("name").notNull(), // ジム名

	// UnixTimeで作成日時・更新日時を保存（drizzleの{ mode: "timestamp" }指定）
	createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
	updatedAt: integer("updated_at", { mode: "timestamp" }).notNull(),
});

/* ======================================
  2) staff: スタッフ (旧admins相当)
     - gymId で gyms と紐づく
     - スタッフが消えてもユーザーを巻き込まない設計
====================================== */
export const staff = table("staff", {
	id: integer("id").primaryKey({ autoIncrement: true }),

	gymId: integer("gym_id")
		.references(() => gyms.id, {
			onDelete: "cascade",
		})
		.notNull(),

	name: text("name").notNull(),
	email: text("email").notNull(),
	password: text("password").notNull(),
	createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
	updatedAt: integer("updated_at", { mode: "timestamp" }).notNull(),
});

/* ======================================
  3) staffTokens: スタッフ用トークン
     - ポリモーフィックを廃止し、
       外部キーで staff.id に紐づける
====================================== */
export const staffTokens = table("staff_tokens", {
	id: integer("id").primaryKey({ autoIncrement: true }),

	staffId: integer("staff_id")
		.references(() => staff.id, {
			onDelete: "cascade",
		})
		.notNull(),

	token: text("token").notNull(),
	lastUsedAt: text("last_used_at"),
	expiresAt: text("expires_at"),

	createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
	updatedAt: integer("updated_at", { mode: "timestamp" }).notNull(),
});

/* ======================================
  4) users: 利用者 (旧users相当)
     - gymId で gyms と紐づく
     - staffId は持たず「スタッフ消し→ユーザーも消える」は回避
====================================== */
export const users = table("users", {
	id: integer("id").primaryKey({ autoIncrement: true }),

	gymId: integer("gym_id")
		.references(() => gyms.id, {
			// ジム削除時にユーザーも消す
			// cascadeにしておけば、一括削除できる
			onDelete: "cascade",
		})
		.notNull(),

	name: text("name").notNull(),
	email: text("email").notNull(),
	password: text("password").notNull(),

	createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
	updatedAt: integer("updated_at", { mode: "timestamp" }).notNull(),
});

/* ======================================
  5) userImages: ユーザーの画像
     - R2 などに格納したファイルのパスやURLを保持
     - 1ユーザーにつき複数画像が想定される
====================================== */
export const userImages = table("user_images", {
	id: integer("id").primaryKey({ autoIncrement: true }),

	userId: integer("user_id")
		.references(() => users.id, {
			// ユーザー削除時にその画像レコードも不要なら cascade
			onDelete: "cascade",
		})
		.notNull(),

	// R2 上のオブジェクトキーやURLを格納する
	imagePath: text("image_path").notNull(),

	createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
	updatedAt: integer("updated_at", { mode: "timestamp" }).notNull(),
});

/* ======================================
  6) userTokens: 利用者用トークン
     - staffTokens と同様、ユーザー用に分割
====================================== */
export const userTokens = table("user_tokens", {
	id: integer("id").primaryKey({ autoIncrement: true }),

	userId: integer("user_id")
		.references(() => users.id, {
			// ユーザー削除でトークンも不要なら cascade
			onDelete: "cascade",
		})
		.notNull(),

	token: text("token").notNull(),
	lastUsedAt: text("last_used_at"),
	expiresAt: text("expires_at"),

	createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
	updatedAt: integer("updated_at", { mode: "timestamp" }).notNull(),
});

/* ======================================
  7) schedules: ジムのクラススケジュール
     - 例: 毎週◯曜日の◯時〜◯時
====================================== */
export const schedules = table("schedules", {
	id: integer("id").primaryKey({ autoIncrement: true }),

	gymId: integer("gym_id")
		.references(() => gyms.id, {
			onDelete: "cascade",
		})
		.notNull(),

	className: text("class_name").notNull(),
	dayOfWeek: text("day_of_week").notNull(), // "Mon" / "火曜" など
	startTime: text("start_time").notNull(), // "HH:MM" 形式
	endTime: text("end_time").notNull(),

	createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
	updatedAt: integer("updated_at", { mode: "timestamp" }).notNull(),
});

/* ======================================
  8) attendances: 出席履歴
     - schedules が後から変更されても、
       当時の情報を履歴として保持したいので
       クラス情報をコピーしておく
====================================== */
export const attendances = table("attendances", {
	id: integer("id").primaryKey({ autoIncrement: true }),

	userId: integer("user_id")
		.references(() => users.id, {
			// ユーザー削除時に履歴ごと消すかは要件次第
			// cascade にしておくとデータ整理はしやすい
			onDelete: "cascade",
		})
		.notNull(),

	scheduleId: integer("schedule_id")
		.references(() => schedules.id, {
			// 「スケジュールを消しても過去の履歴を残すか？」次第
			// onDelete: "no action" にするか cascade にするか判断
			onDelete: "no action",
		})
		.notNull(),

	// 当時のスケジュール情報(スナップショット)をコピー保存
	// スケジュールの変更後も、過去履歴を正しく保持するため
	classNameAtThatTime: text("class_name_at_that_time").notNull(),
	dayOfWeekAtThatTime: text("day_of_week_at_that_time").notNull(),
	startTimeAtThatTime: text("start_time_at_that_time").notNull(),
	endTimeAtThatTime: text("end_time_at_that_time").notNull(),

	// 実際に参加した日時
	attendedAt: integer("attended_at", { mode: "timestamp" }).notNull(),

	createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
	updatedAt: integer("updated_at", { mode: "timestamp" }).notNull(),
});
