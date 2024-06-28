-- ===========================================================================
-- CITY
-- ===========================================================================
INSERT INTO city (city_id, name, admin1, admin2, country, coord_lat, coord_lon)
VALUES (7525990, 'Южноукраинск', 'Николаевская область', 'Вознесенский район', 'Украина', 47.82879, 31.17513);


-- ===========================================================================
-- OBJECT
-- ===========================================================================
INSERT INTO object (object_id, type, name, name_locative, status, city_id, address, address_2, coord_lat, coord_lon,
                    description, schedule_source)
VALUES (1, 'org', 'Спорткомплекс «Олимп»', 'в СК «Олимп»', 'works', 7525990, 'Олимпийская улица',
        'Городской парк «Дубки»', 47.81995433049276, 31.18752479553223,
        'Спорткомплекс предлагает широкий выбор возможностей для занятий спортом и поддержания здорового образа жизни. \n\nСовременный тренажерный зал, просторный бассейн с дорожками для плавания и аквааэробики, игровой зал для командных видов спорта – у нас каждый найдет занятие по душе. \n\nОпытные тренеры и инструкторы помогут вам достичь ваших целей и получить максимум удовольствия от тренировок. \n\nПриходите к нам и откройте для себя мир спорта и активного отдыха!',
        'https://www.google.com/maps/place/Sports+Complex+Olympus/@47.8201775,31.1858632,17.75z/data=!4m6!3m5!1s0x40cfbae3ea3cac5f:0xae8fdc74b62d5b2c!8m2!3d47.8200754!4d31.1875305!16s%2Fg%2F1hf0f4sdn?entry=ttu'),
       (3, 'org', 'Фитнес-клуб «Asgard»', 'в клубе «Asgard»', 'works', 7525990, 'Независимости проспект, 39', null,
        47.8282178082006, 31.16828262805939,
        'Наш фитнес-клуб предлагает современное оборудование, просторные залы и разнообразные групповые программы для всех уровней подготовки.\n\nОпытные тренеры помогут вам достичь ваших целей, будь то снижение веса, укрепление мышц или повышение выносливости. У нас вы найдете все необходимое для комфортных тренировок: сауну, массажный кабинет и уютное кафе.\n\nПрисоединяйтесь к нам и откройте для себя мир фитнеса!',
        'https://www.instagram.com/asgard_pg');

INSERT INTO object (object_id, type, name, name_where, status_inherit, status, city_id, parent_id, address, address_2,
                    coord_inherit, coord_lat, coord_lon, description, schedule_inherit, schedule_source)
VALUES (2, 'place', 'Бассейн', 'в СК «Олимп»', true, 'works', 7525990, 1, 'Олимпийская улица', 'Городской парк «Дубки»',
        true, 47.81995433049276, 31.18752479553223,
        'Бассейн – это оазис свежести и релакса.\n\nКристально чистая вода, комфортная температура, просторные дорожки для плавания и зона гидромассажа – у нас вы сможете полностью расслабиться и восстановить силы. Опытные инструкторы проводят занятия по аквааэробике и обучению плаванию для взрослых и детей.\n\nПодарите себе и своим близким здоровье и хорошее настроение!',
        true,
        'https://www.google.com/maps/place/Sports+Complex+Olympus/@47.8201775,31.1858632,17.75z/data=!4m6!3m5!1s0x40cfbae3ea3cac5f:0xae8fdc74b62d5b2c!8m2!3d47.8200754!4d31.1875305!16s%2Fg%2F1hf0f4sdn?entry=ttu'),
       (4, 'place', 'Тренажерный зал', 'в клубе «Asgard»', true, 'works', 7525990, 3, 'Независимости проспект, 39',
        null, true, 47.8282178082006, 31.16828262805939,
        'Наш тренажерный зал — это территория силы и выносливости.\n\nСовременные тренажеры, свободные веса, зоны для функционального тренинга и кардио – у нас есть все для эффективных тренировок. Опытные инструкторы помогут составить индивидуальную программу и научат правильной технике выполнения упражнений.\n\nПриходите и станьте лучшей версией себя!',
        true, 'https://www.instagram.com/asgard_pg');

SELECT setval('object_object_id_seq', (SELECT MAX(object_id) FROM object) + 1);


-- ===========================================================================
-- SECTION / SPEC / OPTION
-- ===========================================================================
INSERT INTO section (section_id, name_plural, name_singular, object_type)
VALUES (1, 'Фитнес-клубы', 'Фитнес-клуб', 'org'),
       (2, 'Спорткомплексы', 'Спорткомплекс', 'org'),
       (3, 'Тренажёрные залы', 'Трежажерный зал', 'place'),
       (4, 'Бассейны', 'Бассейн', 'place'),
       (5, 'Общие характеристики', 'Общие характеристики', 'place');

SELECT setval('section_section_id_seq', (SELECT MAX(section_id) FROM section) + 1);

INSERT INTO spec (spec_id, name_service, name_public, object_type, options_number)
VALUES (1, 'Фитнес-клубы — Тип', 'Тип', 'org', 'many'),
       (2, 'Бассейны — Длина', 'Длина', 'place', 'one'),
       (3, 'Бассейны — Тип', 'Тип', 'place', 'one'),
       (4, 'Конструкция — Места', 'Конструкция', 'place', 'one');

SELECT setval('spec_spec_id_seq', (SELECT MAX(spec_id) FROM spec) + 1);

INSERT INTO option (option_id, name, "order", spec_id)
VALUES (1, 'С бассейном', 0, 1),
       (2, 'С тренажёрным залом', 1, 1),
       (3, 'Только для женщин', 2, 1),
       (4, 'Другие', 3, 1),
       (5, '50 метров', 0, 2),
       (6, '25 метров', 1, 2),
       (7, 'до 24 метров', 2, 2),
       (8, 'Неизвестно', 3, 2),
       (9, 'Спортивные', 0, 3),
       (10, 'Плавательные', 1, 3),
       (11, 'Детские', 2, 3),
       (12, 'Грудничковые', 3, 3),
       (13, 'Крытое', 0, 4),
       (14, 'Открытое', 1, 4);

SELECT setval('option_option_id_seq', (SELECT MAX(option_id) FROM option) + 1);


-- ===========================================================================
-- RELATIONS: MANY-TO-MANY
-- ===========================================================================
INSERT INTO section_on_spec (section_id, spec_id)
VALUES (1, 1),
       (4, 2),
       (4, 3),
       (5, 4);

INSERT INTO object_on_section (object_id, section_id)
VALUES (1, 2),
       (2, 3),
       (3, 1),
       (4, 3),
       (2, 4),
       (2, 5),
       (1, 1);

INSERT INTO object_on_option (object_id, option_id)
VALUES (3, 2),
       (2, 9),
       (2, 6),
       (2, 13),
       (1, 2),
       (1, 1);

INSERT INTO object_schedule (object_id, day_num, time, "from", "to")
VALUES (4, 0, '8:00 - 22:00', 480, 1320),
       (4, 1, '8:00 - 22:00', 480, 1320),
       (4, 2, '8:00 - 22:00', 480, 1320),
       (4, 3, '8:00 - 22:00', 480, 1320),
       (4, 4, '8:00 - 22:00', 480, 1320),
       (4, 5, '9:00 - 20:00', 540, 1200),
       (4, 6, '9:00 - 20:00', 540, 1200),
       (1, 0, '9:00 - 21:00', 540, 1260),
       (1, 1, '9:00 - 21:00', 540, 1260),
       (1, 2, '9:00 - 21:00', 540, 1260),
       (1, 3, '9:00 - 21:00', 540, 1260),
       (1, 4, '9:00 - 21:00', 540, 1260),
       (1, 5, '9:00 - 21:00', 540, 1260),
       (1, 6, '9:00 - 21:00', 540, 1260),
       (2, 0, '9:00 - 21:00', 540, 1260),
       (2, 1, '9:00 - 21:00', 540, 1260),
       (2, 2, '9:00 - 21:00', 540, 1260),
       (2, 3, '9:00 - 21:00', 540, 1260),
       (2, 4, '9:00 - 21:00', 540, 1260),
       (2, 5, '9:00 - 21:00', 540, 1260),
       (2, 6, '9:00 - 21:00', 540, 1260),
       (3, 0, '8:00 - 22:00', 480, 1320),
       (3, 1, '8:00 - 22:00', 480, 1320),
       (3, 2, '8:00 - 22:00', 480, 1320),
       (3, 3, '8:00 - 22:00', 480, 1320),
       (3, 4, '8:00 - 22:00', 480, 1320),
       (3, 5, '9:00 - 20:00', 540, 1200),
       (3, 6, '9:00 - 20:00', 540, 1200);


-- ===========================================================================
-- CONTACTS
-- ===========================================================================
INSERT INTO object_link (object_id, "order", value)
VALUES (3, 0, 'https://www.instagram.com/asgard_pg'),
       (4, 0, 'https://www.instagram.com/asgard_pg');

INSERT INTO object_phone (object_id, "order", value)
VALUES (1, 0, '+380 (5136) 5-59-10'),
       (2, 0, '+380 (5136) 5-59-10'),
       (3, 0, '+380 (97) 558-79-89'),
       (4, 0, '+380 (97) 558-79-89');


-- ===========================================================================
-- PHOTO
-- ===========================================================================
INSERT INTO object_photo (object_id, name, "order", uploaded)
VALUES (1, 'object_1_0.webp', 0, '2024-06-19 13:03:00.782'),
       (2, 'object_2_0.webp', 0, '2024-06-19 14:07:28.237'),
       (3, 'object_3_0.webp', 0, '2024-06-19 16:22:55.162'),
       (3, 'object_3_1.webp', 1, '2024-06-19 16:22:55.162'),
       (4, 'object_4_0.webp', 0, '2024-06-19 16:59:43.395'),
       (4, 'object_4_1.webp', 1, '2024-06-19 16:59:43.395');