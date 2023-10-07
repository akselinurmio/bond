-- CreateTable
CREATE TABLE "Actor" (
    "tmdbId" INTEGER NOT NULL,
    "numberOfVotes" INTEGER NOT NULL,
    "lastVotedAt" TIMESTAMP(3),

    CONSTRAINT "Actor_pkey" PRIMARY KEY ("tmdbId")
);
