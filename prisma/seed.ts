import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();


async function main() {
  await prisma.section.createMany({
    data: [
      /* 1 */ { name_plural: "Fitness clubs", name_singular: "Fitness club", object_type: "org" },
      /* 2 */ { name_plural: "Swimming pools", name_singular: "Swimming pool", object_type: "place" },
      /* 3 */ { name_plural: "Gyms", name_singular: "Gym", object_type: "place" },
      /* 4 */ { name_plural: "Sports centers", name_singular: "Sports center", object_type: "org" },
    ]
  })

  await prisma.spec.createMany({
    data: [
      /* 1 */  { name_service: "Fitness club — Type", name_public: "Type", options_number: "many", object_type: "org" },
      /* 2 */  { name_service: "Swimming pools — Type", name_public: "Type", options_number: "one", object_type: "place" },
      /* 3 */  { name_service: "Swimming pools — Length", name_public: "Length", options_number: "one", object_type: "place" },
      /* 4 */  { name_service: "Construction — Places", name_public: "Construction", options_number: "many", object_type: "place" },
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
      /* 1 */  { name: "With swimming pool", order: 1, spec_id: 1 },
      /* 2 */  { name: "With gym",           order: 2, spec_id: 1 },
      /* 3 */  { name: "Only for women",     order: 3, spec_id: 1 },
      /* 4 */  { name: "Other",              order: 4, spec_id: 1 },
      /* 5 */  { name: "Sports",             order: 1, spec_id: 2 },
      /* 6 */  { name: "Other swimming",     order: 2, spec_id: 2 },
      /* 7 */  { name: "Child",              order: 3, spec_id: 2 },
      /* 8 */  { name: "Children's",         order: 4, spec_id: 2 },
      /* 9 */  { name: "50 meters",          order: 1, spec_id: 3 },
      /* 10 */ { name: "25 meters",          order: 2, spec_id: 3 },
      /* 11 */ { name: "up to 24 meters",    order: 3, spec_id: 3 },
      /* 12 */ { name: "Indoor",             order: 1, spec_id: 4 },
      /* 13 */ { name: "Outdoor",            order: 2, spec_id: 4 },
    ]
  })

  await prisma.object.createMany({
    data: [
      /* 1 */ { type: "org", name: "Sports complex «Olymp»", name_locative: "in SC «Olymp»", parent_id: null, status: "works", city_id: 7525990, address: "Olympyiska street", coord_lat: 47.82010170345875, coord_lon: 31.187607200024328 },
      /* 2 */ { type: "org", name: "Sport club «Asgard»", name_locative: "in SC «Asgard»", parent_id: null, status: "works", city_id: 7525990, address: "Nezalezhnosti Avenue, 39", coord_lat: 47.82830017815951, coord_lon: 31.168224345045765 },
      /* 3 */ { type: "place", name: "Gym", name_where: "in SC «Asgard»", parent_id: 2, status: "works", city_id: 7525990, address: "Nezalezhnosti Avenue, 39", coord_lat: 47.82830017815951, coord_lon: 31.168224345045765 },
    ]
  })

  await prisma.object_on_section.createMany({
    data: [
      /* 1 */ { object_id: 1, section_id: 1 },
      /* 2 */ { object_id: 1, section_id: 3 },
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