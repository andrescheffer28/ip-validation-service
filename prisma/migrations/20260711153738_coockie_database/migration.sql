-- CreateTable
CREATE TABLE "cookies" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL,
    "country" TEXT,
    "city" TEXT,

    CONSTRAINT "cookies_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "cookies" ADD CONSTRAINT "cookies_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
