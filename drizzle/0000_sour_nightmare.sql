CREATE TABLE `password_reset_tokens` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`token_hash` text NOT NULL,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	`expires_at` integer NOT NULL,
	`used_at` integer,
	`ip` text,
	`user_agent` text
);
--> statement-breakpoint
CREATE TABLE `sessions` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`expires_at` integer NOT NULL
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
	`created_at` integer DEFAULT (unixepoch()) NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `users_username_unique` ON `users` (`username`);--> statement-breakpoint
CREATE UNIQUE INDEX `users_email_unique` ON `users` (`email`);--> statement-breakpoint
CREATE UNIQUE INDEX `users_slug_unique` ON `users` (`slug`);--> statement-breakpoint
CREATE TABLE `pericias` (
	`id` text PRIMARY KEY NOT NULL,
	`nome` text NOT NULL,
	`descricao` text NOT NULL,
	`atributo` text NOT NULL,
	`bonus` text NOT NULL,
	`penalidade_carga` integer DEFAULT false NOT NULL,
	`somente_treinado` integer DEFAULT false NOT NULL
);
--> statement-breakpoint
CREATE TABLE `personagens` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text,
	`vida` integer NOT NULL,
	`esperanca` integer NOT NULL,
	`nivel` integer NOT NULL,
	`medo` integer NOT NULL,
	`patente` text NOT NULL,
	`carga` integer NOT NULL,
	`defesa` integer NOT NULL,
	`fisico` integer NOT NULL,
	`destreza` integer NOT NULL,
	`carisma` integer NOT NULL,
	`erudicao` integer NOT NULL,
	`raciocinio` integer NOT NULL,
	`sabedoria` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `personagens_to_pericias` (
	`personagem_id` text NOT NULL,
	`pericia_id` text NOT NULL,
	PRIMARY KEY(`personagem_id`, `pericia_id`),
	FOREIGN KEY (`personagem_id`) REFERENCES `personagens`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`pericia_id`) REFERENCES `pericias`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `personagens_to_poderes` (
	`personagem_id` text NOT NULL,
	`poder_id` text NOT NULL,
	PRIMARY KEY(`personagem_id`, `poder_id`),
	FOREIGN KEY (`personagem_id`) REFERENCES `personagens`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`poder_id`) REFERENCES `poderes`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `weapons` (
	`nome` text NOT NULL,
	`dado` text NOT NULL,
	`numero_dados` integer DEFAULT 1 NOT NULL,
	`margem_critico` integer DEFAULT 0 NOT NULL,
	`ameaca` integer DEFAULT 1 NOT NULL,
	`tipo_dano` text NOT NULL,
	`extras` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `poderes` (
	`id` text PRIMARY KEY NOT NULL,
	`nome` text NOT NULL,
	`descricao` text NOT NULL,
	`tipo` text NOT NULL,
	`escalavel` text,
	`estatico` text,
	`requerimentos` text
);
--> statement-breakpoint
CREATE TABLE `communities` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`description` text NOT NULL,
	`slug` text,
	`creator_id` text NOT NULL,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `communities_slug_unique` ON `communities` (`slug`);--> statement-breakpoint
CREATE TABLE `genres` (
	`id` text PRIMARY KEY NOT NULL,
	`text` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `members` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`community_id` text NOT NULL,
	`nickname` text NOT NULL,
	`role_id` text NOT NULL,
	`joined_at` integer DEFAULT (unixepoch())
);
--> statement-breakpoint
CREATE UNIQUE INDEX `members_community_id_user_id_unique` ON `members` (`community_id`,`user_id`);--> statement-breakpoint
CREATE TABLE `members_to_communities` (
	`member_id` text NOT NULL,
	`community_id` text NOT NULL,
	PRIMARY KEY(`member_id`, `community_id`),
	FOREIGN KEY (`member_id`) REFERENCES `members`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`community_id`) REFERENCES `communities`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `roles` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`description` text,
	`community_id` text NOT NULL
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
	`created_at` integer DEFAULT (unixepoch()) NOT NULL
);
--> statement-breakpoint
CREATE TABLE `tables_to_genres` (
	`table_id` text NOT NULL,
	`genres_id` text NOT NULL,
	PRIMARY KEY(`table_id`, `genres_id`),
	FOREIGN KEY (`table_id`) REFERENCES `tables`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`genres_id`) REFERENCES `genres`(`id`) ON UPDATE no action ON DELETE no action
);
