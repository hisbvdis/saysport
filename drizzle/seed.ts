// import { sql } from "drizzle-orm";
// import { db } from "./client";
// import { city, object, object_link, object_on_option, object_on_section, object_phone, object_photo, object_schedule, option, section, section_on_spec, spec } from "./schema";

// main();

// async function main() {
//   // ===========================================================================
//   // CITY
//   // ===========================================================================
//   await db.insert(city).values({
//     city_id: 7525990,
//     name: "Южноукраинск",
//     name_preposition: "Южноукраинске",
//     admin1: "Николаевская область",
//     admin2: "Вознесенский район",
//     country: "Украина",
//     coord_lat: 47.82879,
//     coord_lon: 31.17513,
//   });


//   // ===========================================================================
//   // OBJECT — ORG
//   // ===========================================================================
//   await db.insert(object).values(
//     [
//       {
//         object_id: 1,
//         type: "org",
//         name: "Спорткомплекс «Олимп»",
//         name_locative: "в СК «Олимп»",
//         status: "works",
//         city_id: 7525990,
//         address: "Олимпийская улица",
//         address_2: "Городской парк «Дубки»",
//         coord_lat: 47.81995433049276,
//         coord_lon: 31.18752479553223,
//         description: "Спорткомплекс предлагает широкий выбор возможностей для занятий спортом и поддержания здорового образа жизни. \n\nСовременный тренажерный зал, просторный бассейн с дорожками для плавания и аквааэробики, игровой зал для командных видов спорта – у нас каждый найдет занятие по душе. \n\nОпытные тренеры и инструкторы помогут вам достичь ваших целей и получить максимум удовольствия от тренировок. \n\nПриходите к нам и откройте для себя мир спорта и активного отдыха!",
//         schedule_source: "https://www.google.com/maps/place/Sports+Complex+Olympus/@47.8201775,31.1858632,17.75z/data=!4m6!3m5!1s0x40cfbae3ea3cac5f:0xae8fdc74b62d5b2c!8m2!3d47.8200754!4d31.1875305!16s%2Fg%2F1hf0f4sdn?entry=ttu",
//         created: new Date(),
//       },
//       {
//         object_id: 3,
//         type: "org",
//         name: "Фитнес-клуб «Asgard»",
//         name_locative: "в клубе «Asgard»",
//         status: "works",
//         city_id: 7525990,
//         address: "Независимости проспект, 39",
//         address_2: null,
//         coord_lat: 47.8282178082006,
//         coord_lon: 31.16828262805939,
//         description: "Наш фитнес-клуб предлагает современное оборудование, просторные залы и разнообразные групповые программы для всех уровней подготовки.\n\nОпытные тренеры помогут вам достичь ваших целей, будь то снижение веса, укрепление мышц или повышение выносливости. У нас вы найдете все необходимое для комфортных тренировок: сауну, массажный кабинет и уютное кафе.\n\nПрисоединяйтесь к нам и откройте для себя мир фитнеса!",
//         schedule_source: "https://www.instagram.com/asgard_pg",
//         created: new Date(),
//       },
//     ]
//   );


//   // ===========================================================================
//   // OBJECT — PLACES
//   // ===========================================================================
//   await db.insert(object).values(
//     [
//       {
//         object_id: 2,
//         type: "place",
//         name: "Бассейн",
//         name_where: "в СК «Олимп»",
//         status_inherit: true,
//         status: "works",
//         city_id: 7525990,
//         parent_id: 1,
//         address: "Олимпийская улица",
//         address_2: "Городской парк «Дубки»",
//         coord_inherit: true,
//         coord_lat: 47.81995433049276,
//         coord_lon: 31.18752479553223,
//         description: "Бассейн – это оазис свежести и релакса.\n\nКристально чистая вода, комфортная температура, просторные дорожки для плавания и зона гидромассажа – у нас вы сможете полностью расслабиться и восстановить силы. Опытные инструкторы проводят занятия по аквааэробике и обучению плаванию для взрослых и детей.\n\nПодарите себе и своим близким здоровье и хорошее настроение!",
//         schedule_inherit: true,
//         schedule_source: "https://www.google.com/maps/place/Sports+Complex+Olympus/@47.8201775,31.1858632,17.75z/data=!4m6!3m5!1s0x40cfbae3ea3cac5f:0xae8fdc74b62d5b2c!8m2!3d47.8200754!4d31.1875305!16s%2Fg%2F1hf0f4sdn?entry=ttu",
//         created: new Date(),
//       },
//       {
//         object_id: 4,
//         type: "place",
//         name: "Тренажерный зал",
//         name_where: "в клубе «Asgard»",
//         status_inherit: true,
//         status: "works",
//         city_id: 7525990,
//         parent_id: 3,
//         address: "Независимости проспект, 39",
//         address_2: null,
//         coord_inherit: true,
//         coord_lat: 47.8282178082006,
//         coord_lon: 31.16828262805939,
//         description: "Наш тренажерный зал — это территория силы и выносливости.\n\nСовременные тренажеры, свободные веса, зоны для функционального тренинга и кардио – у нас есть все для эффективных тренировок. Опытные инструкторы помогут составить индивидуальную программу и научат правильной технике выполнения упражнений.\n\nПриходите и станьте лучшей версией себя!",
//         schedule_inherit: true,
//         schedule_source: "https://www.instagram.com/asgard_pg",
//         created: new Date(),
//       },
//       {
//         object_id: 5,
//         type: "place",
//         name: "Бассейн",
//         name_where: "в клубе «Asgard»",
//         status_inherit: true,
//         status: "works",
//         city_id: 7525990,
//         parent_id: 3,
//         address: "Независимости проспект, 39",
//         address_2: null,
//         coord_inherit: true,
//         coord_lat: 47.8282178082006,
//         coord_lon: 31.16828262805939,
//         description: "Наш тренажерный зал — это территория силы и выносливости.\n\nСовременные тренажеры, свободные веса, зоны для функционального тренинга и кардио – у нас есть все для эффективных тренировок. Опытные инструкторы помогут составить индивидуальную программу и научат правильной технике выполнения упражнений.\n\nПриходите и станьте лучшей версией себя!",
//         schedule_inherit: true,
//         schedule_source: "https://www.instagram.com/asgard_pg",
//         created: new Date(),
//       },
//     ]
//   );


//   // ===========================================================================
//   // SECTION / SPEC / OPTION
//   // ===========================================================================
//   await db.insert(section).values(
//     [
//       { section_id: 1 , name_public_plural: "Фитнес-клубы"              , name_public_singular: "Фитнес-клуб"               , object_type: "org" },
//       { section_id: 2 , name_public_plural: "Спорткомплексы"            , name_public_singular: "Спорткомплекс"             , object_type: "org" },
//       { section_id: 3 , name_public_plural: "Тренажёрные залы"          , name_public_singular: "Трежажерный зал"           , object_type: "place" },
//       { section_id: 4 , name_public_plural: "Бассейны"                  , name_public_singular: "Бассейн"                   , object_type: "place" },
//       { section_id: 5 , name_public_plural: "Общие характеристики мест" , name_public_singular: "Общие характеристики мест" , object_type: "place" }
//     ]
//   )

//   await db.insert(spec).values(
//     [
//       {spec_id: 1  , name_service: "Фитнес-клубы — Тип"        , name_public: "Тип"            , object_type: "org"    , options_number: "many"  , order: 1},
//       {spec_id: 2  , name_service: "Бассейны — Длина дорожек"  , name_public: "Длина дорожек"  , object_type: "place"  , options_number: "one"   , order: 0},
//       {spec_id: 3  , name_service: "Бассейны — Тип"            , name_public: "Тип"            , object_type: "place"  , options_number: "one"   , order: 1},
//       {spec_id: 4  , name_service: "Конструкция — Места"       , name_public: "Конструкция"    , object_type: "place"  , options_number: "one"   , order: 0},
//     ]
//   )

//   await db.insert(option).values(
//     [
//       {option_id: 1 , name: "С бассейном" , order: 0 , spec_id: 1},
//       {option_id: 2 , name: "С тренажёрным залом" , order: 1 , spec_id: 1},
//       {option_id: 3 , name: "Только для женщин" , order: 2 , spec_id: 1},
//       {option_id: 4 , name: "Другие" , order: 3 , spec_id: 1},
//       {option_id: 5 , name: "50 метров" , order: 0 , spec_id: 2},
//       {option_id: 6 , name: "25 метров" , order: 1 , spec_id: 2},
//       {option_id: 7 , name: "до 24 метров" , order: 2 , spec_id: 2},
//       {option_id: 8 , name: "Отсутствуют" , order: 3 , spec_id: 2},
//       {option_id: 9 , name: "Спортивные" , order: 0 , spec_id: 3},
//       {option_id: 10 , name: "Плавательные" , order: 1 , spec_id: 3},
//       {option_id: 11 , name: "Детские" , order: 2 , spec_id: 3},
//       {option_id: 12 , name: "Грудничковые" , order: 3 , spec_id: 3},
//       {option_id: 13 , name: "Крытое" , order: 0 , spec_id: 4},
//       {option_id: 14 , name: "Открытое" , order: 1 , spec_id: 4},
//     ]
//   )


//   // ===========================================================================
//   // RELATIONS: MANY-TO-MANY
//   // ===========================================================================
//   await db.insert(section_on_spec).values(
//     [
//       {section_id: 1, spec_id: 1},
//       {section_id: 4, spec_id: 2},
//       {section_id: 4, spec_id: 3},
//       {section_id: 5, spec_id: 4},
//     ]
//   )

//   await db.insert(object_on_section).values(
//     [
//       {object_id: 1, section_id: 2},
//       {object_id: 3, section_id: 1},
//       {object_id: 4, section_id: 3},
//       {object_id: 2, section_id: 4},
//       {object_id: 2, section_id: 5},
//       {object_id: 1, section_id: 1},
//       {object_id: 5, section_id: 4},
//     ]
//   )

//   await db.insert(object_on_option).values(
//     [
//       {object_id: 3, option_id: 2},
//       {object_id: 2, option_id: 9},
//       {object_id: 2, option_id: 6},
//       {object_id: 2, option_id: 13},
//       {object_id: 1, option_id: 2},
//       {object_id: 1, option_id: 1},
//       {object_id: 5, option_id: 5},
//       {object_id: 5, option_id: 10},
//     ]
//   )


//   // ===========================================================================
//   // SCHEDULE
//   // ===========================================================================
//   await db.insert(object_schedule).values(
//     [
//       {object_id: 4, day_num: 0, time: "8:00 - 22:00", from: 480, to: 1320},
//       {object_id: 4, day_num: 1, time: "8:00 - 22:00", from: 480, to: 1320},
//       {object_id: 4, day_num: 2, time: "8:00 - 22:00", from: 480, to: 1320},
//       {object_id: 4, day_num: 3, time: "8:00 - 22:00", from: 480, to: 1320},
//       {object_id: 4, day_num: 4, time: "8:00 - 22:00", from: 480, to: 1320},
//       {object_id: 4, day_num: 5, time: "9:00 - 20:00", from: 540, to: 1200},
//       {object_id: 4, day_num: 6, time: "9:00 - 20:00", from: 540, to: 1200},
//       {object_id: 1, day_num: 0, time: "9:00 - 21:00", from: 540, to: 1260},
//       {object_id: 1, day_num: 1, time: "9:00 - 21:00", from: 540, to: 1260},
//       {object_id: 1, day_num: 2, time: "9:00 - 21:00", from: 540, to: 1260},
//       {object_id: 1, day_num: 3, time: "9:00 - 21:00", from: 540, to: 1260},
//       {object_id: 1, day_num: 4, time: "9:00 - 21:00", from: 540, to: 1260},
//       {object_id: 1, day_num: 5, time: "9:00 - 21:00", from: 540, to: 1260},
//       {object_id: 1, day_num: 6, time: "9:00 - 21:00", from: 540, to: 1260},
//       {object_id: 2, day_num: 0, time: "9:00 - 21:00", from: 540, to: 1260},
//       {object_id: 2, day_num: 1, time: "9:00 - 21:00", from: 540, to: 1260},
//       {object_id: 2, day_num: 2, time: "9:00 - 21:00", from: 540, to: 1260},
//       {object_id: 2, day_num: 3, time: "9:00 - 21:00", from: 540, to: 1260},
//       {object_id: 2, day_num: 4, time: "9:00 - 21:00", from: 540, to: 1260},
//       {object_id: 2, day_num: 5, time: "9:00 - 21:00", from: 540, to: 1260},
//       {object_id: 2, day_num: 6, time: "9:00 - 21:00", from: 540, to: 1260},
//       {object_id: 3, day_num: 0, time: "8:00 - 22:00", from: 480, to: 1320},
//       {object_id: 3, day_num: 1, time: "8:00 - 22:00", from: 480, to: 1320},
//       {object_id: 3, day_num: 2, time: "8:00 - 22:00", from: 480, to: 1320},
//       {object_id: 3, day_num: 3, time: "8:00 - 22:00", from: 480, to: 1320},
//       {object_id: 3, day_num: 4, time: "8:00 - 22:00", from: 480, to: 1320},
//       {object_id: 3, day_num: 5, time: "9:00 - 20:00", from: 540, to: 1200},
//       {object_id: 3, day_num: 6, time: "9:00 - 20:00", from: 540, to: 1200},
//       {object_id: 5, day_num: 0, time: "8:00 - 22:00", from: 480, to: 1320},
//       {object_id: 5, day_num: 1, time: "8:00 - 22:00", from: 480, to: 1320},
//       {object_id: 5, day_num: 2, time: "8:00 - 22:00", from: 480, to: 1320},
//       {object_id: 5, day_num: 3, time: "8:00 - 22:00", from: 480, to: 1320},
//       {object_id: 5, day_num: 4, time: "8:00 - 22:00", from: 480, to: 1320},
//       {object_id: 5, day_num: 5, time: "9:00 - 20:00", from: 540, to: 1200},
//       {object_id: 5, day_num: 6, time: "9:00 - 20:00", from: 540, to: 1200},
//     ]
//   )


//   // ===========================================================================
//   // CONTACTS
//   // ===========================================================================
//   await db.insert(object_link).values(
//     [
//       {object_id: 3, order: 0, value: "https://www.instagram.com/asgard_pg"},
//       {object_id: 4, order: 0, value: "https://www.instagram.com/asgard_pg"},
//       {object_id: 5, order: 0, value: "https://www.instagram.com/asgard_pg"},
//     ]
//   )

//   await db.insert(object_phone).values(
//     [
//       {object_id: 1, order: 0, value: "+380 (5136) 5-59-10"},
//       {object_id: 2, order: 0, value: "+380 (5136) 5-59-10"},
//       {object_id: 3, order: 0, value: "+380 (97) 558-79-89"},
//       {object_id: 4, order: 0, value: "+380 (97) 558-79-89"},
//       {object_id: 5, order: 0, value: "+380 (97) 558-79-89"},
//     ]
//   )


//   // ===========================================================================
//   // PHOTO
//   // ===========================================================================
//   await db.insert(object_photo).values(
//     [
//       {object_id: 1, order: 0, name: "object_1_0.webp", uploaded: new Date("2024-06-19 13:03:00.782")},
//       {object_id: 2, order: 0, name: "object_2_0.webp", uploaded: new Date("2024-06-19 14:07:28.237")},
//       {object_id: 3, order: 0, name: "object_3_0.webp", uploaded: new Date("2024-06-19 16:22:55.162")},
//       {object_id: 3, order: 1, name: "object_3_1.webp", uploaded: new Date("2024-06-19 16:22:55.162")},
//       {object_id: 4, order: 0, name: "object_4_0.webp", uploaded: new Date("2024-06-19 16:59:43.395")},
//       {object_id: 4, order: 1, name: "object_4_1.webp", uploaded: new Date("2024-06-19 16:59:43.395")},
//       {object_id: 5, order: 1, name: "object_5_0.webp", uploaded: new Date("2024-06-19 16:59:43.395")},
//     ]
//   )


//   // ===========================================================================
//   // SEQUENCES
//   // ===========================================================================
//   await db.execute(sql`SELECT setval('object_object_id_seq', (SELECT MAX(object_id) FROM object) + 1)`);
//   await db.execute(sql`SELECT setval('section_section_id_seq', (SELECT MAX(section_id) FROM section) + 1)`);
//   await db.execute(sql`SELECT setval('spec_spec_id_seq', (SELECT MAX(spec_id) FROM spec) + 1)`);
//   await db.execute(sql`SELECT setval('option_option_id_seq', (SELECT MAX(option_id) FROM option) + 1)`);

//   return "value";
// }