ALTER TABLE `posts`
  ADD COLUMN `content_format` VARCHAR(20) NOT NULL DEFAULT 'HTML',
  ADD COLUMN `author_id` VARCHAR(191) NULL;

CREATE INDEX `posts_author_id_idx` ON `posts`(`author_id`);

ALTER TABLE `posts`
  ADD CONSTRAINT `posts_author_id_fkey`
  FOREIGN KEY (`author_id`) REFERENCES `users`(`id`)
  ON DELETE SET NULL ON UPDATE CASCADE;
