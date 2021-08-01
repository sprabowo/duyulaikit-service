/*
  Warnings:

  - You are about to drop the column `hasLiked` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `user_id` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `voteDirection` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `vote_id` on the `users` table. All the data in the column will be lost.
  - Added the required column `slug` to the `votes` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "users" DROP CONSTRAINT "users_vote_id_fkey";

-- DropIndex
DROP INDEX "votes.id_unique";

-- AlterTable
ALTER TABLE "users" DROP COLUMN "hasLiked",
DROP COLUMN "user_id",
DROP COLUMN "voteDirection",
DROP COLUMN "vote_id";

-- AlterTable
ALTER TABLE "votes" ADD COLUMN     "slug" TEXT NOT NULL,
ADD PRIMARY KEY ("id");

-- CreateTable
CREATE TABLE "user_votes" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "vote_id" TEXT NOT NULL,
    "voteDirection" INTEGER NOT NULL,
    "hasLiked" BOOLEAN NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "user_votes" ADD FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_votes" ADD FOREIGN KEY ("vote_id") REFERENCES "votes"("id") ON DELETE CASCADE ON UPDATE CASCADE;
