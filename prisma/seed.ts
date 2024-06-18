import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();


async function main() {
  await prisma.section.createMany({
    data: [
      /* 1 */ { name_plural: "Фитнес-клубы", name_singular: "Фитнес-клуб", object_type: "org" },
      /* 2 */ { name_plural: "Бассейны", name_singular: "Бассейн", object_type: "place" },
      /* 3 */ { name_plural: "Тренажёрные залы", name_singular: "Трежажерный зал", object_type: "place" },
      /* 4 */ { name_plural: "Спорткомплексы", name_singular: "Спорткомплекс", object_type: "org" },
    ]
  })

  await prisma.spec.createMany({
    data: [
      /* 1 */  { name_service: "Фитнес-клубы — Тип", name_public: "Тип", options_number: "many", object_type: "org" },
      /* 2 */  { name_service: "Бассейны — Тип", name_public: "Тип", options_number: "one", object_type: "place" },
      /* 3 */  { name_service: "Бассейны — Длина", name_public: "Длина", options_number: "one", object_type: "place" },
      /* 4 */  { name_service: "Конструкция", name_public: "Конструкция", options_number: "many", object_type: "place" },
    ]
  })

  await prisma.section_on_spec.createMany({
    data: [
      { section_id: 1, spec_id: 1 },
      { section_id: 2, spec_id: 2 },
      { section_id: 2, spec_id: 3 },
      { section_id: 2, spec_id: 4 },
      { section_id: 3, spec_id: 4 },
    ]
  })

  await prisma.option.createMany({
    data: [
      /* 1 */  { name: "С бассейном",         order: 1, spec_id: 1 },
      /* 2 */  { name: "С тренажёрным залом", order: 2, spec_id: 1 },
      /* 3 */  { name: "Только для женщин",   order: 3, spec_id: 1 },
      /* 4 */  { name: "Другие",              order: 4, spec_id: 1 },
      // ————————————————————————————————————————————————————————————
      /* 5 */  { name: "Спортивные",          order: 1, spec_id: 2 },
      /* 6 */  { name: "Плавательные",        order: 2, spec_id: 2 },
      /* 7 */  { name: "Детские",             order: 3, spec_id: 2 },
      /* 8 */  { name: "Грудничковые",        order: 4, spec_id: 2 },
      // ————————————————————————————————————————————————————————————
      /* 9 */  { name: "50 метров",           order: 1, spec_id: 3 },
      /* 10 */ { name: "25 метров",           order: 2, spec_id: 3 },
      /* 11 */ { name: "до 24 метров",        order: 3, spec_id: 3 },
      // ————————————————————————————————————————————————————————————
      /* 12 */ { name: "Крытое",              order: 1, spec_id: 4 },
      /* 13 */ { name: "Открытое",            order: 2, spec_id: 4 },
    ]
  })

  await prisma.object.createMany({
    data: [
      /* 1 */ { type: "org", name: "Спорткомплекс «Олимп»", name_locative: "в СК «Олимп»", parent_id: null, status: "works", city_id: 7525990, address: "Олимпийская улица", coord_lat: 47.82010170345875, coord_lon: 31.187607200024328 },
      /* 2 */ { type: "org", name: "Фитнес-клуб «Asgard»", name_locative: "в клубе «Asgard»", parent_id: null, status: "works", city_id: 7525990, address: "Независимости проспект, 39", coord_lat: 47.82830017815951, coord_lon: 31.168224345045765 },
      /* 3 */ { type: "place", name: "Тренажёрный зал", parent_id: 2, name_where: "в клубе «Asgard»", parent_id: 2, status: "works", city_id: 7525990, address: "Независимости проспект, 39", coord_lat: 47.82830017815951, coord_lon: 31.168224345045765 },
    ]
  })

  await prisma.object_on_section.createMany({
    data: [
      /* 1 */ { object_id: 1, section_id: 1 },
      /* 2 */ { object_id: 1, section_id: 4 },
      /* 3 */ { object_id: 2, section_id: 1 },
      /* 4 */ { object_id: 3, section_id: 3 },
    ]
  })

  await prisma.object_on_option.createMany({
    data: [
      /* 1 */ { object_id: 1, option_id: 1 },
      /* 2 */ { object_id: 1, option_id: 2 },
      /* 3 */ { object_id: 2, option_id: 2 },
    ]
  })

  await prisma.object_schedule.createMany({
    data: [
      /* 1 */ { object_id: 1, day_num: 0, from: 540, to: 1200, time: "9:00 - 20:00" },
      /* 2 */ { object_id: 1, day_num: 1, from: 540, to: 1200, time: "9:00 - 20:00" },
      /* 3 */ { object_id: 1, day_num: 2, from: 540, to: 1200, time: "9:00 - 20:00" },
      /* 4 */ { object_id: 1, day_num: 3, from: 540, to: 1200, time: "9:00 - 20:00" },
      /* 5 */ { object_id: 1, day_num: 4, from: 540, to: 1200, time: "9:00 - 20:00" },
      /* 6 */ { object_id: 1, day_num: 5, from: 540, to: 1080, time: "9:00 - 20:00" },
      /* 7 */ { object_id: 1, day_num: 6, from: 540, to: 1080, time: "9:00 - 20:00" },
      /* 8 */ { object_id: 2, day_num: 0, from: 480, to: 1140, time: "8:00 - 19:00" },
      /* 9 */ { object_id: 2, day_num: 1, from: 480, to: 1140, time: "8:00 - 19:00" },
      /* 10 */ { object_id: 2, day_num: 2, from: 480, to: 1140, time: "8:00 - 19:00" },
      /* 11 */ { object_id: 2, day_num: 3, from: 480, to: 1140, time: "8:00 - 19:00" },
      /* 12 */ { object_id: 2, day_num: 4, from: 480, to: 1140, time: "8:00 - 19:00" },
      /* 13 */ { object_id: 2, day_num: 5, from: 480, to: 960, time: "8:00 - 16:00" },
    ]
  })
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