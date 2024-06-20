import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();


async function main() {
  await prisma.section_on_spec.deleteMany();
  await prisma.object_on_section.deleteMany();
  await prisma.object_on_option.deleteMany();
  await prisma.section.deleteMany();
  await prisma.spec.deleteMany();
  await prisma.option.deleteMany();
  await prisma.object.deleteMany();
  await prisma.object_schedule.deleteMany();
  await prisma.object_link.deleteMany();
  await prisma.object_phone.deleteMany();
  await prisma.object_photo.deleteMany();

  await prisma.$executeRawUnsafe(`ALTER SEQUENCE  section_id_seq           RESTART WITH 1`)
  await prisma.$executeRawUnsafe(`ALTER SEQUENCE  spec_id_seq              RESTART WITH 1`)
  await prisma.$executeRawUnsafe(`ALTER SEQUENCE  section_on_spec_id_seq   RESTART WITH 1`)
  await prisma.$executeRawUnsafe(`ALTER SEQUENCE  option_id_seq            RESTART WITH 1`)
  await prisma.$executeRawUnsafe(`ALTER SEQUENCE  object_id_seq            RESTART WITH 1`)
  await prisma.$executeRawUnsafe(`ALTER SEQUENCE  object_on_section_id_seq RESTART WITH 1`)
  await prisma.$executeRawUnsafe(`ALTER SEQUENCE  object_on_option_id_seq  RESTART WITH 1`)
  await prisma.$executeRawUnsafe(`ALTER SEQUENCE  object_schedule_id_seq   RESTART WITH 1`)
  await prisma.$executeRawUnsafe(`ALTER SEQUENCE  object_link_id_seq       RESTART WITH 1`)
  await prisma.$executeRawUnsafe(`ALTER SEQUENCE  object_phone_id_seq      RESTART WITH 1`)
  await prisma.$executeRawUnsafe(`ALTER SEQUENCE  object_photo_id_seq      RESTART WITH 1`)
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error( e );
    await prisma.$disconnect();
    process.exit(1);
  })