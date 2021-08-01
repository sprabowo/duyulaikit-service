-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "vote_id" TEXT NOT NULL,
    "voteDirection" INTEGER NOT NULL,
    "hasLiked" BOOLEAN NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "votes" (
    "id" TEXT NOT NULL,
    "namespace" TEXT NOT NULL,
    "total" INTEGER NOT NULL,
    "type" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "votes.id_unique" ON "votes"("id");

-- AddForeignKey
ALTER TABLE "users" ADD FOREIGN KEY ("vote_id") REFERENCES "votes"("id") ON DELETE CASCADE ON UPDATE CASCADE;
