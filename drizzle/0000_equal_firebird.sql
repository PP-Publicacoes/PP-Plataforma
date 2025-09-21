CREATE TABLE `password_reset_tokens` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`token_hash` text NOT NULL,
	`created_at` integer NOT NULL,
	`expires_at` integer NOT NULL,
	`used_at` integer,
	`ip` text,
	`user_agent` text,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `sessions` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`expires_at` integer NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` text PRIMARY KEY NOT NULL,
	`age` integer,
	`username` text NOT NULL,
	`email` text NOT NULL,
	`bio` text,
	`slug` text NOT NULL,
	`password_hash` text NOT NULL,
	`created_at` integer NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `users_username_unique` ON `users` (`username`);--> statement-breakpoint
CREATE UNIQUE INDEX `users_email_unique` ON `users` (`email`);--> statement-breakpoint
CREATE UNIQUE INDEX `users_slug_unique` ON `users` (`slug`);--> statement-breakpoint
CREATE TABLE `attributes` (
	`name` text PRIMARY KEY NOT NULL,
	`description` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `attributes_sheet` (
	`id` text PRIMARY KEY NOT NULL,
	`character_id` text NOT NULL,
	`strength` integer NOT NULL,
	`dexterity` integer NOT NULL,
	`attention` integer NOT NULL,
	`study` integer NOT NULL,
	`spirit` integer NOT NULL,
	`charisma` integer NOT NULL,
	FOREIGN KEY (`character_id`) REFERENCES `characters`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `characters` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`rank_id` text NOT NULL,
	`load_capacity` integer NOT NULL,
	`defense` integer NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`rank_id`) REFERENCES `ranks`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `characters_to_powers` (
	`character_id` text NOT NULL,
	`power_id` text NOT NULL,
	PRIMARY KEY(`character_id`, `power_id`),
	FOREIGN KEY (`character_id`) REFERENCES `characters`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`power_id`) REFERENCES `powers`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `characters_to_skill_bonus` (
	`character_id` text NOT NULL,
	`skill_bonus_id` text NOT NULL,
	PRIMARY KEY(`character_id`, `skill_bonus_id`),
	FOREIGN KEY (`character_id`) REFERENCES `characters`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`skill_bonus_id`) REFERENCES `skill_bonuses`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `ranks` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`description` text,
	`proficiency_credits` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `skill_bonuses` (
	`id` text PRIMARY KEY NOT NULL,
	`skill_name` text NOT NULL,
	`skill_level` text,
	`other` integer,
	FOREIGN KEY (`skill_name`) REFERENCES `skills`(`name`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`skill_level`) REFERENCES `skill_levels`(`level`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `skill_levels` (
	`level` text PRIMARY KEY NOT NULL,
	`bonus` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `skills` (
	`name` text PRIMARY KEY NOT NULL,
	`description` text NOT NULL,
	`attribute_name` text NOT NULL,
	`load_penalty` integer DEFAULT false NOT NULL,
	`trained_only` integer DEFAULT false NOT NULL,
	FOREIGN KEY (`attribute_name`) REFERENCES `attributes`(`name`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `status_sheet` (
	`id` text PRIMARY KEY NOT NULL,
	`character_id` text NOT NULL,
	`hp` integer NOT NULL,
	`hope` integer NOT NULL,
	`level` integer NOT NULL,
	`fear` integer NOT NULL,
	FOREIGN KEY (`character_id`) REFERENCES `characters`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `statuses` (
	`name` text PRIMARY KEY NOT NULL,
	`description` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `damage_types` (
	`name` text PRIMARY KEY NOT NULL,
	`description` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `proficiencies` (
	`name` text PRIMARY KEY NOT NULL,
	`description` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `proficiency_levels` (
	`level` text PRIMARY KEY NOT NULL,
	`cost` integer NOT NULL,
	`credits` integer
);
--> statement-breakpoint
CREATE TABLE `weapons` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`die_name` text NOT NULL,
	`dice_count` integer DEFAULT 1 NOT NULL,
	`critical_margin` integer DEFAULT 0 NOT NULL,
	`threat` integer DEFAULT 2 NOT NULL,
	`damage_type_name` text NOT NULL,
	`proficiency_name` text NOT NULL,
	FOREIGN KEY (`die_name`) REFERENCES `dices`(`name`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`damage_type_name`) REFERENCES `damage_types`(`name`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`proficiency_name`) REFERENCES `proficiencies`(`name`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `weapons_extras` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`description` text NOT NULL,
	`attack_bonus` integer,
	`damage_bonus` integer,
	`critical_margin` integer,
	`threat` integer
);
--> statement-breakpoint
CREATE TABLE `weapons_to_weapons_extras` (
	`weapons_id` text NOT NULL,
	`weapons_extras_id` text NOT NULL,
	PRIMARY KEY(`weapons_id`, `weapons_extras_id`),
	FOREIGN KEY (`weapons_id`) REFERENCES `weapons`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`weapons_extras_id`) REFERENCES `weapons_extras`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `affinity_levels` (
	`level` text PRIMARY KEY NOT NULL,
	`value` integer
);
--> statement-breakpoint
CREATE TABLE `hauntings` (
	`name` text PRIMARY KEY NOT NULL,
	`description` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `damage_reduction_levels` (
	`level` text PRIMARY KEY NOT NULL,
	`value` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `damage_reductions` (
	`id` text PRIMARY KEY NOT NULL,
	`damage_type_name` text NOT NULL,
	`damage_reduction_level` text NOT NULL,
	FOREIGN KEY (`damage_type_name`) REFERENCES `damage_types`(`name`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`damage_reduction_level`) REFERENCES `damage_reduction_levels`(`level`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `defense_bonus_levels` (
	`level` text PRIMARY KEY NOT NULL,
	`bonus` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `power_affinity_requirements` (
	`power_requirement_id` text NOT NULL,
	`haunting_name` text NOT NULL,
	`affinity_level` text NOT NULL,
	PRIMARY KEY(`power_requirement_id`, `haunting_name`),
	FOREIGN KEY (`power_requirement_id`) REFERENCES `power_requirements`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`haunting_name`) REFERENCES `hauntings`(`name`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`affinity_level`) REFERENCES `affinity_levels`(`level`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `power_attribute_requirements` (
	`power_requirement_id` text NOT NULL,
	`attribute_name` text NOT NULL,
	`value` integer NOT NULL,
	PRIMARY KEY(`power_requirement_id`, `attribute_name`),
	FOREIGN KEY (`power_requirement_id`) REFERENCES `power_requirements`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`attribute_name`) REFERENCES `attributes`(`name`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `power_power_requirements` (
	`power_requirement_id` text NOT NULL,
	`power_id` text NOT NULL,
	PRIMARY KEY(`power_requirement_id`, `power_id`),
	FOREIGN KEY (`power_requirement_id`) REFERENCES `power_requirements`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`power_id`) REFERENCES `powers`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `power_proficiency_requirements` (
	`power_requirement_id` text NOT NULL,
	`proficiency_name` text NOT NULL,
	`proficiency_level` text NOT NULL,
	PRIMARY KEY(`power_requirement_id`, `proficiency_name`),
	FOREIGN KEY (`power_requirement_id`) REFERENCES `power_requirements`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`proficiency_name`) REFERENCES `proficiencies`(`name`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`proficiency_level`) REFERENCES `proficiency_levels`(`level`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `power_requirements` (
	`id` text PRIMARY KEY NOT NULL
);
--> statement-breakpoint
CREATE TABLE `power_skill_requirements` (
	`power_requirement_id` text NOT NULL,
	`skill_name` text NOT NULL,
	`skill_level` text NOT NULL,
	PRIMARY KEY(`power_requirement_id`, `skill_name`),
	FOREIGN KEY (`power_requirement_id`) REFERENCES `power_requirements`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`skill_name`) REFERENCES `skills`(`name`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`skill_level`) REFERENCES `skill_levels`(`level`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `powers` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`description` text NOT NULL,
	`static_id` text,
	`scalable_id` text,
	`requirement_id` text,
	FOREIGN KEY (`static_id`) REFERENCES `static_powers`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`scalable_id`) REFERENCES `scalable_powers`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`requirement_id`) REFERENCES `power_requirements`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `proficiency_damages` (
	`id` text PRIMARY KEY NOT NULL,
	`proficiency_name` text NOT NULL,
	`value` integer NOT NULL,
	FOREIGN KEY (`proficiency_name`) REFERENCES `proficiencies`(`name`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `scalable_powers` (
	`id` text PRIMARY KEY NOT NULL,
	`each` integer NOT NULL,
	`modifies_hp` integer DEFAULT false,
	`modifies_hope` integer DEFAULT false,
	`based_on_fear` integer DEFAULT false,
	`based_on_level` integer DEFAULT false,
	`based_on_rank` integer DEFAULT false,
	`modification` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `static_bonus_damages` (
	`id` text PRIMARY KEY NOT NULL
);
--> statement-breakpoint
CREATE TABLE `static_bonus_damages_to_proficiency_damages` (
	`static_bonus_damage_id` text NOT NULL,
	`proficiency_damage_id` text NOT NULL,
	PRIMARY KEY(`static_bonus_damage_id`, `proficiency_damage_id`),
	FOREIGN KEY (`static_bonus_damage_id`) REFERENCES `static_bonus_damages`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`proficiency_damage_id`) REFERENCES `proficiency_damages`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `static_bonus_damages_to_type_damages` (
	`static_bonus_damage_id` text NOT NULL,
	`type_damage_id` text NOT NULL,
	PRIMARY KEY(`static_bonus_damage_id`, `type_damage_id`),
	FOREIGN KEY (`static_bonus_damage_id`) REFERENCES `static_bonus_damages`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`type_damage_id`) REFERENCES `type_damages`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `static_damage_reductions` (
	`id` text PRIMARY KEY NOT NULL
);
--> statement-breakpoint
CREATE TABLE `static_damage_reductions_to_damage_reductions` (
	`static_damage_reduction_id` text NOT NULL,
	`damage_reduction_id` text NOT NULL,
	PRIMARY KEY(`static_damage_reduction_id`, `damage_reduction_id`),
	FOREIGN KEY (`static_damage_reduction_id`) REFERENCES `static_damage_reductions`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`damage_reduction_id`) REFERENCES `damage_reductions`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `static_powers` (
	`id` text PRIMARY KEY NOT NULL,
	`static_skill_id` text,
	`defense_bonus_level` text,
	`static_damage_reduction_id` text,
	`static_damage_id` text,
	FOREIGN KEY (`static_skill_id`) REFERENCES `static_skills`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`defense_bonus_level`) REFERENCES `defense_bonus_levels`(`level`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`static_damage_reduction_id`) REFERENCES `static_damage_reductions`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`static_damage_id`) REFERENCES `static_bonus_damages`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `static_skills` (
	`id` text PRIMARY KEY NOT NULL,
	`skill_name` text NOT NULL,
	`level` integer,
	`dices` integer,
	FOREIGN KEY (`skill_name`) REFERENCES `skills`(`name`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `type_damages` (
	`id` text PRIMARY KEY NOT NULL,
	`damage_type_name` text NOT NULL,
	`value` integer NOT NULL,
	FOREIGN KEY (`damage_type_name`) REFERENCES `damage_types`(`name`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `dices` (
	`name` text PRIMARY KEY NOT NULL,
	`faces` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `communities` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`description` text NOT NULL,
	`slug` text NOT NULL,
	`creator_id` text NOT NULL,
	`created_at` integer NOT NULL,
	FOREIGN KEY (`creator_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `communities_slug_unique` ON `communities` (`slug`);--> statement-breakpoint
CREATE TABLE `genres` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `members` (
	`user_id` text NOT NULL,
	`community_id` text NOT NULL,
	`nickname` text NOT NULL,
	`role_id` text NOT NULL,
	`joined_at` integer NOT NULL,
	PRIMARY KEY(`user_id`, `community_id`),
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`community_id`) REFERENCES `communities`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`role_id`) REFERENCES `roles`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `roles` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`description` text,
	`community_id` text NOT NULL,
	FOREIGN KEY (`community_id`) REFERENCES `communities`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `roles_community_id_name_unique` ON `roles` (`community_id`,`name`);--> statement-breakpoint
CREATE TABLE `systems` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`description` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `tables` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`description` text NOT NULL,
	`system_id` text NOT NULL,
	`created_at` integer NOT NULL,
	FOREIGN KEY (`system_id`) REFERENCES `systems`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `tables_to_genres` (
	`table_id` text NOT NULL,
	`genre_id` text NOT NULL,
	PRIMARY KEY(`table_id`, `genre_id`),
	FOREIGN KEY (`table_id`) REFERENCES `tables`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`genre_id`) REFERENCES `genres`(`id`) ON UPDATE no action ON DELETE no action
);
