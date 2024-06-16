-- CreateEnum
CREATE TYPE "objectTypeEnum" AS ENUM ('org', 'place');

-- CreateEnum
CREATE TYPE "optionsNumberEnum" AS ENUM ('one', 'many');

-- CreateEnum
CREATE TYPE "objectStatusEnum" AS ENUM ('works', 'open_soon', 'might_not_work', 'closed_temp', 'closed_forever');

-- CreateTable
CREATE TABLE "object" (
    "id" SERIAL NOT NULL,
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
    "modified" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "object_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "section" (
    "id" SERIAL NOT NULL,
    "name_plural" TEXT NOT NULL,
    "name_singular" TEXT NOT NULL,
    "object_type" "objectTypeEnum" NOT NULL,

    CONSTRAINT "section_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "spec" (
    "id" SERIAL NOT NULL,
    "name_service" TEXT NOT NULL,
    "name_public" TEXT NOT NULL,
    "object_type" "objectTypeEnum" NOT NULL,
    "options_number" "optionsNumberEnum" NOT NULL,

    CONSTRAINT "spec_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "option" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "order" INTEGER NOT NULL,
    "spec_id" INTEGER NOT NULL,

    CONSTRAINT "option_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "section_on_spec" (
    "id" SERIAL NOT NULL,
    "section_id" INTEGER NOT NULL,
    "spec_id" INTEGER NOT NULL,

    CONSTRAINT "section_on_spec_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "object_on_section" (
    "id" SERIAL NOT NULL,
    "object_id" INTEGER NOT NULL,
    "section_id" INTEGER NOT NULL,

    CONSTRAINT "object_on_section_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "object_on_option" (
    "id" SERIAL NOT NULL,
    "object_id" INTEGER NOT NULL,
    "option_id" INTEGER NOT NULL,

    CONSTRAINT "object_on_option_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "object_link" (
    "id" SERIAL NOT NULL,
    "object_id" INTEGER NOT NULL,
    "order" INTEGER NOT NULL,
    "value" TEXT NOT NULL,
    "comment" TEXT,

    CONSTRAINT "object_link_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "object_phone" (
    "id" SERIAL NOT NULL,
    "object_id" INTEGER NOT NULL,
    "order" INTEGER NOT NULL,
    "value" TEXT NOT NULL,
    "comment" TEXT,

    CONSTRAINT "object_phone_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "object_photo" (
    "id" SERIAL NOT NULL,
    "object_id" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "order" INTEGER NOT NULL,
    "uploaded" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "object_photo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "object_schedule" (
    "id" SERIAL NOT NULL,
    "object_id" INTEGER NOT NULL,
    "day_num" INTEGER NOT NULL,
    "time" TEXT NOT NULL,
    "from" INTEGER NOT NULL,
    "to" INTEGER NOT NULL,

    CONSTRAINT "object_schedule_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "city" (
    "id" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "asciiname" TEXT,
    "alternatenames" TEXT,
    "coord_lat" DOUBLE PRECISION,
    "cootd_lon" DOUBLE PRECISION,
    "feature_class" TEXT,
    "feature_code" TEXT,
    "country_code" TEXT NOT NULL,
    "cc2" TEXT,
    "admin1_code" TEXT,
    "admin2_code" TEXT,
    "admin3_code" TEXT,
    "admin4_code" TEXT,
    "population" INTEGER,
    "elevation" INTEGER,
    "dem" INTEGER,
    "timezone" TEXT,
    "modification_date" TEXT,

    CONSTRAINT "city_pkey" PRIMARY KEY ("id")
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
ALTER TABLE "object" ADD CONSTRAINT "object_status_instead_id_fkey" FOREIGN KEY ("status_instead_id") REFERENCES "object"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "object" ADD CONSTRAINT "object_parent_id_fkey" FOREIGN KEY ("parent_id") REFERENCES "object"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "object" ADD CONSTRAINT "object_city_id_fkey" FOREIGN KEY ("city_id") REFERENCES "city"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "option" ADD CONSTRAINT "option_spec_id_fkey" FOREIGN KEY ("spec_id") REFERENCES "spec"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "section_on_spec" ADD CONSTRAINT "section_on_spec_section_id_fkey" FOREIGN KEY ("section_id") REFERENCES "section"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "section_on_spec" ADD CONSTRAINT "section_on_spec_spec_id_fkey" FOREIGN KEY ("spec_id") REFERENCES "spec"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "object_on_section" ADD CONSTRAINT "object_on_section_object_id_fkey" FOREIGN KEY ("object_id") REFERENCES "object"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "object_on_section" ADD CONSTRAINT "object_on_section_section_id_fkey" FOREIGN KEY ("section_id") REFERENCES "section"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "object_on_option" ADD CONSTRAINT "object_on_option_object_id_fkey" FOREIGN KEY ("object_id") REFERENCES "object"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "object_on_option" ADD CONSTRAINT "object_on_option_option_id_fkey" FOREIGN KEY ("option_id") REFERENCES "option"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "object_link" ADD CONSTRAINT "object_link_object_id_fkey" FOREIGN KEY ("object_id") REFERENCES "object"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "object_phone" ADD CONSTRAINT "object_phone_object_id_fkey" FOREIGN KEY ("object_id") REFERENCES "object"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "object_photo" ADD CONSTRAINT "object_photo_object_id_fkey" FOREIGN KEY ("object_id") REFERENCES "object"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "object_schedule" ADD CONSTRAINT "object_schedule_object_id_fkey" FOREIGN KEY ("object_id") REFERENCES "object"("id") ON DELETE CASCADE ON UPDATE CASCADE;
