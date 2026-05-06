-- AlterTable
ALTER TABLE `applications` ADD COLUMN `is_draft` BOOLEAN NOT NULL DEFAULT false;

-- CreateIndex
CREATE INDEX `chat_messages_session_id_created_at_idx` ON `chat_messages`(`session_id`, `created_at`);
