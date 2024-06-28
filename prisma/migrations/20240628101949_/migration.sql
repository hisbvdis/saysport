-- CreateEnum
CREATE TYPE "objectTypeEnum" AS ENUM ('org', 'place');

-- CreateEnum
CREATE TYPE "optionsNumberEnum" AS ENUM ('one', 'many');

-- CreateEnum
CREATE TYPE "objectStatusEnum" AS ENUM ('works', 'open_soon', 'might_not_work', 'closed_temp', 'closed_forever');

-- CreateTable
CREATE TABLE "object" (
    "object_id" SERIAL NOT NULL,
    "type" "objectTypeEnum" NOT NULL,
    "name" TEXT NOT NULL,
    "name_locative" TEXT,
    "name_where" TEXT,
    "status_inherit" BOOLEAN,
    "status" "objectStatusEnum",
    "status_comment" TEXT,
    "status_confirm" TEXT,
    "status_instead_id" INTEGER,
    "city_id" INTEGER,
    "parent_id" INTEGER,
    "address" TEXT,
    "address_2" TEXT,
    "coord_inherit" BOOLEAN,
    "coord_lat" DOUBLE PRECISION,
    "coord_lon" DOUBLE PRECISION,
    "description" TEXT,
    "schedule_inherit" BOOLEAN,
    "schedule_24_7" BOOLEAN,
    "schedule_date" TIMESTAMP(3),
    "schedule_source" TEXT,
    "schedule_comment" TEXT,
    "created" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "modified" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "object_pkey" PRIMARY KEY ("object_id")
);

-- CreateTable
CREATE TABLE "section" (
    "section_id" SERIAL NOT NULL,
    "name_plural" TEXT NOT NULL,
    "name_singular" TEXT NOT NULL,
    "object_type" "objectTypeEnum" NOT NULL,

    CONSTRAINT "section_pkey" PRIMARY KEY ("section_id")
);

-- CreateTable
CREATE TABLE "spec" (
    "spec_id" SERIAL NOT NULL,
    "name_service" TEXT NOT NULL,
    "name_public" TEXT NOT NULL,
    "object_type" "objectTypeEnum" NOT NULL,
    "options_number" "optionsNumberEnum" NOT NULL,

    CONSTRAINT "spec_pkey" PRIMARY KEY ("spec_id")
);

-- CreateTable
CREATE TABLE "option" (
    "option_id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "order" INTEGER NOT NULL,
    "spec_id" INTEGER NOT NULL,

    CONSTRAINT "option_pkey" PRIMARY KEY ("option_id")
);

-- CreateTable
CREATE TABLE "section_on_spec" (
    "section_id" INTEGER NOT NULL,
    "spec_id" INTEGER NOT NULL,

    CONSTRAINT "section_on_spec_pkey" PRIMARY KEY ("section_id","spec_id")
);

-- CreateTable
CREATE TABLE "object_on_section" (
    "object_id" INTEGER NOT NULL,
    "section_id" INTEGER NOT NULL,

    CONSTRAINT "object_on_section_pkey" PRIMARY KEY ("object_id","section_id")
);

-- CreateTable
CREATE TABLE "object_on_option" (
    "object_id" INTEGER NOT NULL,
    "option_id" INTEGER NOT NULL,

    CONSTRAINT "object_on_option_pkey" PRIMARY KEY ("object_id","option_id")
);

-- CreateTable
CREATE TABLE "object_link" (
    "contact_id" SERIAL NOT NULL,
    "object_id" INTEGER NOT NULL,
    "order" INTEGER NOT NULL,
    "value" TEXT NOT NULL,
    "comment" TEXT,

    CONSTRAINT "object_link_pkey" PRIMARY KEY ("contact_id")
);

-- CreateTable
CREATE TABLE "object_phone" (
    "contact_id" SERIAL NOT NULL,
    "object_id" INTEGER NOT NULL,
    "order" INTEGER NOT NULL,
    "value" TEXT NOT NULL,
    "comment" TEXT,

    CONSTRAINT "object_phone_pkey" PRIMARY KEY ("contact_id")
);

-- CreateTable
CREATE TABLE "object_photo" (
    "photo_id" SERIAL NOT NULL,
    "object_id" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "order" INTEGER NOT NULL,
    "uploaded" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "object_photo_pkey" PRIMARY KEY ("photo_id")
);

-- CreateTable
CREATE TABLE "object_schedule" (
    "schedule_id" SERIAL NOT NULL,
    "object_id" INTEGER NOT NULL,
    "day_num" INTEGER NOT NULL,
    "time" TEXT NOT NULL,
    "from" INTEGER NOT NULL,
    "to" INTEGER NOT NULL,

    CONSTRAINT "object_schedule_pkey" PRIMARY KEY ("schedule_id")
);

-- CreateTable
CREATE TABLE "city" (
    "city_id" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "admin1" TEXT,
    "admin2" TEXT,
    "country" TEXT NOT NULL,
    "coord_lat" DOUBLE PRECISION NOT NULL,
    "coord_lon" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "city_pkey" PRIMARY KEY ("city_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "option_order_spec_id_key" ON "option"("order", "spec_id");

-- CreateIndex
CREATE UNIQUE INDEX "object_link_object_id_order_key" ON "object_link"("object_id", "order");

-- CreateIndex
CREATE UNIQUE INDEX "object_phone_object_id_order_key" ON "object_phone"("object_id", "order");

-- CreateIndex
CREATE UNIQUE INDEX "object_schedule_object_id_day_num_key" ON "object_schedule"("object_id", "day_num");

-- AddForeignKey
ALTER TABLE "object" ADD CONSTRAINT "object_status_instead_id_fkey" FOREIGN KEY ("status_instead_id") REFERENCES "object"("object_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "object" ADD CONSTRAINT "object_parent_id_fkey" FOREIGN KEY ("parent_id") REFERENCES "object"("object_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "object" ADD CONSTRAINT "object_city_id_fkey" FOREIGN KEY ("city_id") REFERENCES "city"("city_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "option" ADD CONSTRAINT "option_spec_id_fkey" FOREIGN KEY ("spec_id") REFERENCES "spec"("spec_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "section_on_spec" ADD CONSTRAINT "section_on_spec_section_id_fkey" FOREIGN KEY ("section_id") REFERENCES "section"("section_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "section_on_spec" ADD CONSTRAINT "section_on_spec_spec_id_fkey" FOREIGN KEY ("spec_id") REFERENCES "spec"("spec_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "object_on_section" ADD CONSTRAINT "object_on_section_object_id_fkey" FOREIGN KEY ("object_id") REFERENCES "object"("object_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "object_on_section" ADD CONSTRAINT "object_on_section_section_id_fkey" FOREIGN KEY ("section_id") REFERENCES "section"("section_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "object_on_option" ADD CONSTRAINT "object_on_option_object_id_fkey" FOREIGN KEY ("object_id") REFERENCES "object"("object_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "object_on_option" ADD CONSTRAINT "object_on_option_option_id_fkey" FOREIGN KEY ("option_id") REFERENCES "option"("option_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "object_link" ADD CONSTRAINT "object_link_object_id_fkey" FOREIGN KEY ("object_id") REFERENCES "object"("object_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "object_phone" ADD CONSTRAINT "object_phone_object_id_fkey" FOREIGN KEY ("object_id") REFERENCES "object"("object_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "object_photo" ADD CONSTRAINT "object_photo_object_id_fkey" FOREIGN KEY ("object_id") REFERENCES "object"("object_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "object_schedule" ADD CONSTRAINT "object_schedule_object_id_fkey" FOREIGN KEY ("object_id") REFERENCES "object"("object_id") ON DELETE CASCADE ON UPDATE CASCADE;
