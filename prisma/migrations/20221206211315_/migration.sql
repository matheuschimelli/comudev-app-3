-- CreateTable
CREATE TABLE "Project" (
    "id" STRING NOT NULL,
    "public" BOOL NOT NULL DEFAULT false,
    "code" STRING NOT NULL,
    "userId" STRING NOT NULL,

    CONSTRAINT "Project_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Project" ADD CONSTRAINT "Project_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
