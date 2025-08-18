ALTER TABLE `user` ADD `slug` text NOT NULL;--> statement-breakpoint
CREATE UNIQUE INDEX `user_slug_unique` ON `user` (`slug`);