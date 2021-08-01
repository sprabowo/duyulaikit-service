-- AlterTable
ALTER TABLE "user_votes" ALTER COLUMN "voteDirection" DROP NOT NULL,
ALTER COLUMN "hasLiked" DROP NOT NULL;
