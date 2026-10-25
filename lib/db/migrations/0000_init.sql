CREATE TABLE `body_measurement` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`measured_at` text NOT NULL,
	`weight_kg` real,
	`height_cm` real,
	`body_fat_pct` real,
	`updated_at` text NOT NULL,
	`deleted_at` text,
	`version` integer DEFAULT 0 NOT NULL,
	`server_seq` integer,
	FOREIGN KEY (`user_id`) REFERENCES `app_user`(`id`) ON UPDATE no action ON DELETE no action,
	CONSTRAINT "body_measurement_any" CHECK("body_measurement"."weight_kg" IS NOT NULL OR "body_measurement"."height_cm" IS NOT NULL OR "body_measurement"."body_fat_pct" IS NOT NULL)
);
--> statement-breakpoint
CREATE INDEX `body_measurement_measured_idx` ON `body_measurement` (`measured_at`);--> statement-breakpoint
CREATE TABLE `user_activity` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`activity_type_id` integer,
	`name` text NOT NULL,
	`started_at` text NOT NULL,
	`duration_min` integer NOT NULL,
	`kcal_burned` integer NOT NULL,
	`source` text NOT NULL,
	`external_id` text,
	`updated_at` text NOT NULL,
	`deleted_at` text,
	`version` integer DEFAULT 0 NOT NULL,
	`server_seq` integer,
	FOREIGN KEY (`user_id`) REFERENCES `app_user`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`activity_type_id`) REFERENCES `activity_type`(`id`) ON UPDATE no action ON DELETE no action,
	CONSTRAINT "user_activity_external_id" CHECK(("user_activity"."source" = 'manual') = ("user_activity"."external_id" IS NULL))
);
--> statement-breakpoint
CREATE INDEX `user_activity_started_idx` ON `user_activity` (`started_at`);--> statement-breakpoint
CREATE TABLE `activity_type` (
	`id` integer PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`met` real NOT NULL
);
--> statement-breakpoint
CREATE TABLE `allergen` (
	`id` integer PRIMARY KEY NOT NULL,
	`code` text NOT NULL,
	`name` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `allergen_code_unique` ON `allergen` (`code`);--> statement-breakpoint
CREATE TABLE `category` (
	`id` integer PRIMARY KEY NOT NULL,
	`parent_id` integer,
	`slug` text NOT NULL,
	`name` text NOT NULL,
	`icon` text NOT NULL,
	`sort_order` integer DEFAULT 0 NOT NULL,
	FOREIGN KEY (`parent_id`) REFERENCES `category`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `category_slug_unique` ON `category` (`slug`);--> statement-breakpoint
CREATE TABLE `category_translation` (
	`category_id` integer NOT NULL,
	`locale` text NOT NULL,
	`name` text NOT NULL,
	PRIMARY KEY(`category_id`, `locale`),
	FOREIGN KEY (`category_id`) REFERENCES `category`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `food` (
	`id` integer PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`category_id` integer NOT NULL,
	`kcal_per_100g` integer NOT NULL,
	`fat_g_per_100g` real NOT NULL,
	`carbs_g_per_100g` real NOT NULL,
	`protein_g_per_100g` real NOT NULL,
	`info` text,
	`additional_info` text,
	`updated_at` text NOT NULL,
	`is_active` integer DEFAULT true NOT NULL,
	FOREIGN KEY (`category_id`) REFERENCES `category`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE INDEX `food_category_idx` ON `food` (`category_id`);--> statement-breakpoint
CREATE INDEX `food_updated_idx` ON `food` (`updated_at`);--> statement-breakpoint
CREATE TABLE `food_allergen` (
	`food_id` integer NOT NULL,
	`allergen_id` integer NOT NULL,
	PRIMARY KEY(`food_id`, `allergen_id`),
	FOREIGN KEY (`food_id`) REFERENCES `food`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`allergen_id`) REFERENCES `allergen`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE INDEX `food_allergen_allergen_idx` ON `food_allergen` (`allergen_id`);--> statement-breakpoint
CREATE TABLE `food_nutrient` (
	`food_id` integer NOT NULL,
	`nutrient_id` integer NOT NULL,
	`amount_per_100g` real NOT NULL,
	PRIMARY KEY(`food_id`, `nutrient_id`),
	FOREIGN KEY (`food_id`) REFERENCES `food`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`nutrient_id`) REFERENCES `nutrient`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `food_translation` (
	`food_id` integer NOT NULL,
	`locale` text NOT NULL,
	`name` text NOT NULL,
	`info` text,
	PRIMARY KEY(`food_id`, `locale`),
	FOREIGN KEY (`food_id`) REFERENCES `food`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `meal_type` (
	`id` integer PRIMARY KEY NOT NULL,
	`code` text NOT NULL,
	`default_name` text NOT NULL,
	`default_icon` text NOT NULL,
	`default_start_time` text,
	`default_end_time` text,
	`sort_order` integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `meal_type_code_unique` ON `meal_type` (`code`);--> statement-breakpoint
CREATE TABLE `meal_type_translation` (
	`meal_type_id` integer NOT NULL,
	`locale` text NOT NULL,
	`name` text NOT NULL,
	PRIMARY KEY(`meal_type_id`, `locale`),
	FOREIGN KEY (`meal_type_id`) REFERENCES `meal_type`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `nutrient` (
	`id` integer PRIMARY KEY NOT NULL,
	`code` text NOT NULL,
	`name` text NOT NULL,
	`unit` text NOT NULL,
	`sort_order` integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `nutrient_code_unique` ON `nutrient` (`code`);--> statement-breakpoint
CREATE TABLE `log_entry` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`food_id` integer,
	`user_food_id` text,
	`meal_group_id` text,
	`saved_meal_id` text,
	`serving_id` text,
	`serving_count` real,
	`quantity_g` real NOT NULL,
	`consumed_at` text NOT NULL,
	`local_date` text NOT NULL,
	`source` text NOT NULL,
	`ai_confidence` real,
	`name_snapshot` text NOT NULL,
	`serving_label_snapshot` text,
	`kcal_snapshot` integer NOT NULL,
	`fat_g_snapshot` real NOT NULL,
	`carbs_g_snapshot` real NOT NULL,
	`protein_g_snapshot` real NOT NULL,
	`updated_at` text NOT NULL,
	`deleted_at` text,
	`version` integer DEFAULT 0 NOT NULL,
	`server_seq` integer,
	FOREIGN KEY (`user_id`) REFERENCES `app_user`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`food_id`) REFERENCES `food`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`user_food_id`) REFERENCES `user_food`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`meal_group_id`) REFERENCES `meal_group`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`saved_meal_id`) REFERENCES `saved_meal`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`serving_id`) REFERENCES `food_serving`(`id`) ON UPDATE no action ON DELETE no action,
	CONSTRAINT "log_entry_food_ref" CHECK(("log_entry"."food_id" IS NULL) <> ("log_entry"."user_food_id" IS NULL)),
	CONSTRAINT "log_entry_serving" CHECK(("log_entry"."serving_id" IS NULL) = ("log_entry"."serving_count" IS NULL)),
	CONSTRAINT "log_entry_ai_confidence" CHECK(("log_entry"."source" = 'ai_photo') = ("log_entry"."ai_confidence" IS NOT NULL)),
	CONSTRAINT "log_entry_saved_meal" CHECK(("log_entry"."source" = 'saved_meal') = ("log_entry"."saved_meal_id" IS NOT NULL))
);
--> statement-breakpoint
CREATE INDEX `log_entry_local_date_idx` ON `log_entry` (`local_date`);--> statement-breakpoint
CREATE INDEX `log_entry_meal_group_idx` ON `log_entry` (`meal_group_id`);--> statement-breakpoint
CREATE TABLE `meal_group` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`meal_type_id` integer,
	`name` text NOT NULL,
	`icon` text NOT NULL,
	`start_time` text,
	`end_time` text,
	`target_kcal` integer,
	`target_fat_g` real,
	`target_carbs_g` real,
	`target_protein_g` real,
	`sort_order` integer DEFAULT 0 NOT NULL,
	`is_archived` integer DEFAULT false NOT NULL,
	`updated_at` text NOT NULL,
	`deleted_at` text,
	`version` integer DEFAULT 0 NOT NULL,
	`server_seq` integer,
	FOREIGN KEY (`user_id`) REFERENCES `app_user`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`meal_type_id`) REFERENCES `meal_type`(`id`) ON UPDATE no action ON DELETE no action,
	CONSTRAINT "meal_group_window" CHECK(("meal_group"."start_time" IS NULL) = ("meal_group"."end_time" IS NULL))
);
--> statement-breakpoint
CREATE TABLE `saved_meal` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`meal_group_id` text,
	`name` text NOT NULL,
	`updated_at` text NOT NULL,
	`deleted_at` text,
	`version` integer DEFAULT 0 NOT NULL,
	`server_seq` integer,
	FOREIGN KEY (`user_id`) REFERENCES `app_user`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`meal_group_id`) REFERENCES `meal_group`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `saved_meal_item` (
	`id` text PRIMARY KEY NOT NULL,
	`saved_meal_id` text NOT NULL,
	`food_id` integer,
	`user_food_id` text,
	`serving_id` text,
	`serving_count` real,
	`quantity_g` real NOT NULL,
	`sort_order` integer DEFAULT 0 NOT NULL,
	`updated_at` text NOT NULL,
	`deleted_at` text,
	`version` integer DEFAULT 0 NOT NULL,
	`server_seq` integer,
	FOREIGN KEY (`saved_meal_id`) REFERENCES `saved_meal`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`food_id`) REFERENCES `food`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`user_food_id`) REFERENCES `user_food`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`serving_id`) REFERENCES `food_serving`(`id`) ON UPDATE no action ON DELETE no action,
	CONSTRAINT "saved_meal_item_food_ref" CHECK(("saved_meal_item"."food_id" IS NULL) <> ("saved_meal_item"."user_food_id" IS NULL)),
	CONSTRAINT "saved_meal_item_serving" CHECK(("saved_meal_item"."serving_id" IS NULL) = ("saved_meal_item"."serving_count" IS NULL))
);
--> statement-breakpoint
CREATE INDEX `saved_meal_item_meal_idx` ON `saved_meal_item` (`saved_meal_id`);--> statement-breakpoint
CREATE TABLE `water_log` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`amount_ml` integer NOT NULL,
	`logged_at` text NOT NULL,
	`local_date` text NOT NULL,
	`updated_at` text NOT NULL,
	`deleted_at` text,
	`version` integer DEFAULT 0 NOT NULL,
	`server_seq` integer,
	FOREIGN KEY (`user_id`) REFERENCES `app_user`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE INDEX `water_log_local_date_idx` ON `water_log` (`local_date`);--> statement-breakpoint
CREATE TABLE `reminder` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`kind` text NOT NULL,
	`meal_group_id` text,
	`time` text NOT NULL,
	`days_of_week` integer NOT NULL,
	`is_enabled` integer DEFAULT true NOT NULL,
	`updated_at` text NOT NULL,
	`deleted_at` text,
	`version` integer DEFAULT 0 NOT NULL,
	`server_seq` integer,
	FOREIGN KEY (`user_id`) REFERENCES `app_user`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`meal_group_id`) REFERENCES `meal_group`(`id`) ON UPDATE no action ON DELETE no action,
	CONSTRAINT "reminder_meal_group" CHECK(("reminder"."kind" = 'meal') = ("reminder"."meal_group_id" IS NOT NULL)),
	CONSTRAINT "reminder_days" CHECK("reminder"."days_of_week" BETWEEN 1 AND 127)
);
--> statement-breakpoint
CREATE TABLE `user_allergen` (
	`user_id` text NOT NULL,
	`allergen_id` integer NOT NULL,
	`updated_at` text NOT NULL,
	`deleted_at` text,
	`version` integer DEFAULT 0 NOT NULL,
	`server_seq` integer,
	PRIMARY KEY(`user_id`, `allergen_id`),
	FOREIGN KEY (`user_id`) REFERENCES `app_user`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`allergen_id`) REFERENCES `allergen`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `user_food_preference` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`food_id` integer,
	`user_food_id` text,
	`kind` text NOT NULL,
	`updated_at` text NOT NULL,
	`deleted_at` text,
	`version` integer DEFAULT 0 NOT NULL,
	`server_seq` integer,
	FOREIGN KEY (`user_id`) REFERENCES `app_user`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`food_id`) REFERENCES `food`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`user_food_id`) REFERENCES `user_food`(`id`) ON UPDATE no action ON DELETE no action,
	CONSTRAINT "user_food_preference_food_ref" CHECK(("user_food_preference"."food_id" IS NULL) <> ("user_food_preference"."user_food_id" IS NULL))
);
--> statement-breakpoint
CREATE TABLE `user_goal` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`effective_from` text NOT NULL,
	`kcal` integer NOT NULL,
	`fat_g` real NOT NULL,
	`carbs_g` real NOT NULL,
	`protein_g` real NOT NULL,
	`water_ml` integer NOT NULL,
	`updated_at` text NOT NULL,
	`deleted_at` text,
	`version` integer DEFAULT 0 NOT NULL,
	`server_seq` integer,
	FOREIGN KEY (`user_id`) REFERENCES `app_user`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE INDEX `user_goal_effective_idx` ON `user_goal` (`effective_from`);--> statement-breakpoint
CREATE TABLE `user_preferences` (
	`user_id` text PRIMARY KEY NOT NULL,
	`units` text NOT NULL,
	`locale` text NOT NULL,
	`timezone` text NOT NULL,
	`diet` text NOT NULL,
	`excluded_ingredients` text NOT NULL,
	`dashboard_layout` text,
	`updated_at` text NOT NULL,
	`deleted_at` text,
	`version` integer DEFAULT 0 NOT NULL,
	`server_seq` integer,
	FOREIGN KEY (`user_id`) REFERENCES `app_user`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `sync_outbox` (
	`id` text PRIMARY KEY NOT NULL,
	`entity` text NOT NULL,
	`entity_id` text NOT NULL,
	`op` text NOT NULL,
	`payload` text NOT NULL,
	`created_at` text NOT NULL,
	`attempts` integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE INDEX `sync_outbox_created_idx` ON `sync_outbox` (`created_at`);--> statement-breakpoint
CREATE TABLE `sync_state` (
	`key` text PRIMARY KEY NOT NULL,
	`value` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `app_user` (
	`id` text PRIMARY KEY NOT NULL,
	`email` text NOT NULL,
	`created_at` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `food_barcode` (
	`id` text PRIMARY KEY NOT NULL,
	`code` text NOT NULL,
	`user_id` text,
	`food_id` integer,
	`user_food_id` text,
	`source` text NOT NULL,
	`updated_at` text NOT NULL,
	`deleted_at` text,
	`version` integer DEFAULT 0 NOT NULL,
	`server_seq` integer,
	FOREIGN KEY (`user_id`) REFERENCES `app_user`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`food_id`) REFERENCES `food`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`user_food_id`) REFERENCES `user_food`(`id`) ON UPDATE no action ON DELETE no action,
	CONSTRAINT "food_barcode_food_ref" CHECK(("food_barcode"."food_id" IS NULL) <> ("food_barcode"."user_food_id" IS NULL))
);
--> statement-breakpoint
CREATE INDEX `food_barcode_code_idx` ON `food_barcode` (`code`);--> statement-breakpoint
CREATE TABLE `food_serving` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text,
	`food_id` integer,
	`user_food_id` text,
	`label` text NOT NULL,
	`grams` real NOT NULL,
	`is_default` integer DEFAULT false NOT NULL,
	`updated_at` text NOT NULL,
	`deleted_at` text,
	`version` integer DEFAULT 0 NOT NULL,
	`server_seq` integer,
	FOREIGN KEY (`user_id`) REFERENCES `app_user`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`food_id`) REFERENCES `food`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`user_food_id`) REFERENCES `user_food`(`id`) ON UPDATE no action ON DELETE no action,
	CONSTRAINT "food_serving_food_ref" CHECK(("food_serving"."food_id" IS NULL) <> ("food_serving"."user_food_id" IS NULL))
);
--> statement-breakpoint
CREATE INDEX `food_serving_food_idx` ON `food_serving` (`food_id`);--> statement-breakpoint
CREATE INDEX `food_serving_user_food_idx` ON `food_serving` (`user_food_id`);--> statement-breakpoint
CREATE TABLE `user_food` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`base_food_id` integer,
	`is_recipe` integer DEFAULT false NOT NULL,
	`recipe_yield_g` real,
	`name` text,
	`category_id` integer,
	`kcal_per_100g` integer,
	`fat_g_per_100g` real,
	`carbs_g_per_100g` real,
	`protein_g_per_100g` real,
	`info` text,
	`additional_info` text,
	`updated_at` text NOT NULL,
	`deleted_at` text,
	`version` integer DEFAULT 0 NOT NULL,
	`server_seq` integer,
	FOREIGN KEY (`user_id`) REFERENCES `app_user`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`base_food_id`) REFERENCES `food`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`category_id`) REFERENCES `category`(`id`) ON UPDATE no action ON DELETE no action,
	CONSTRAINT "user_food_own_food_complete" CHECK("user_food"."base_food_id" IS NOT NULL OR (
                "user_food"."name" IS NOT NULL AND "user_food"."category_id" IS NOT NULL
                AND "user_food"."kcal_per_100g" IS NOT NULL AND "user_food"."fat_g_per_100g" IS NOT NULL
                AND "user_food"."carbs_g_per_100g" IS NOT NULL AND "user_food"."protein_g_per_100g" IS NOT NULL
            )),
	CONSTRAINT "user_food_recipe_no_base" CHECK(NOT "user_food"."is_recipe" OR "user_food"."base_food_id" IS NULL),
	CONSTRAINT "user_food_recipe_yield" CHECK("user_food"."is_recipe" = ("user_food"."recipe_yield_g" IS NOT NULL))
);
--> statement-breakpoint
CREATE INDEX `user_food_base_idx` ON `user_food` (`base_food_id`);--> statement-breakpoint
CREATE TABLE `user_food_allergen` (
	`user_food_id` text NOT NULL,
	`allergen_id` integer NOT NULL,
	`updated_at` text NOT NULL,
	`deleted_at` text,
	`version` integer DEFAULT 0 NOT NULL,
	`server_seq` integer,
	PRIMARY KEY(`user_food_id`, `allergen_id`),
	FOREIGN KEY (`user_food_id`) REFERENCES `user_food`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`allergen_id`) REFERENCES `allergen`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `user_food_ingredient` (
	`id` text PRIMARY KEY NOT NULL,
	`user_food_id` text NOT NULL,
	`food_id` integer,
	`ingredient_user_food_id` text,
	`quantity_g` real NOT NULL,
	`sort_order` integer DEFAULT 0 NOT NULL,
	`updated_at` text NOT NULL,
	`deleted_at` text,
	`version` integer DEFAULT 0 NOT NULL,
	`server_seq` integer,
	FOREIGN KEY (`user_food_id`) REFERENCES `user_food`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`food_id`) REFERENCES `food`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`ingredient_user_food_id`) REFERENCES `user_food`(`id`) ON UPDATE no action ON DELETE no action,
	CONSTRAINT "user_food_ingredient_food_ref" CHECK(("user_food_ingredient"."food_id" IS NULL) <> ("user_food_ingredient"."ingredient_user_food_id" IS NULL)),
	CONSTRAINT "user_food_ingredient_not_self" CHECK("user_food_ingredient"."ingredient_user_food_id" IS NULL OR "user_food_ingredient"."ingredient_user_food_id" <> "user_food_ingredient"."user_food_id")
);
--> statement-breakpoint
CREATE INDEX `user_food_ingredient_recipe_idx` ON `user_food_ingredient` (`user_food_id`);--> statement-breakpoint
CREATE TABLE `user_food_nutrient` (
	`user_food_id` text NOT NULL,
	`nutrient_id` integer NOT NULL,
	`amount_per_100g` real NOT NULL,
	`updated_at` text NOT NULL,
	`deleted_at` text,
	`version` integer DEFAULT 0 NOT NULL,
	`server_seq` integer,
	PRIMARY KEY(`user_food_id`, `nutrient_id`),
	FOREIGN KEY (`user_food_id`) REFERENCES `user_food`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`nutrient_id`) REFERENCES `nutrient`(`id`) ON UPDATE no action ON DELETE no action
);
