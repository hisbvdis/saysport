CREATE SCHEMA IF NOT EXISTS public;

CREATE TYPE objectType AS ENUM ('org', 'place');
CREATE TYPE optionsNumber AS ENUM ('many', 'one');
CREATE TYPE objectStatus AS ENUM ('works', 'open_soon', 'might_closed', 'closed_temp', 'closed_forever');


-- ===========================================================================
-- CITY
-- ===========================================================================
CREATE TABLE IF NOT EXISTS city
(
    city_id   INTEGER PRIMARY KEY,
    name      VARCHAR,
    admin1    VARCHAR,
    admin2    VARCHAR,
    country   VARCHAR,
    coord_lat DOUBLE PRECISION NOT NULL,
    coord_lon DOUBLE PRECISION NOT NULL
);

-- ===========================================================================
-- OBJECT
-- ===========================================================================
CREATE TABLE IF NOT EXISTS object
(
    object_id         SERIAL PRIMARY KEY,
    type              objectType NOT NULL,
    name              VARCHAR    NOT NULL,
    name_locative     VARCHAR,
    name_where        VARCHAR,
    status_inherit    BOOLEAN,
    status            objectStatus,
    status_comment    VARCHAR,
    status_source     VARCHAR,
    status_instead_id INTEGER,
    city_id           INTEGER    NOT NULL REFERENCES city (city_id),
    parent_id         INTEGER,
    address           VARCHAR,
    address_2         VARCHAR,
    coord_inherit     BOOLEAN,
    coord_lat         DOUBLE PRECISION,
    coord_lon         DOUBLE PRECISION,
    description       VARCHAR,
    schedule_inherit  BOOLEAN,
    schedule_24_7     BOOLEAN,
    schedule_date     TIMESTAMP,
    schedule_source   VARCHAR,
    schedule_comment  VARCHAR,
    created           TIMESTAMP DEFAULT now(),
    modified          TIMESTAMP DEFAULT now()
);

-- ===========================================================================
-- SECTION / SPEC / OPTION
-- ===========================================================================
CREATE TABLE IF NOT EXISTS section
(
    section_id    SERIAL PRIMARY KEY,
    name_plural   VARCHAR    NOT NULL,
    name_singular VARCHAR    NOT NULL,
    object_type   objectType NOT NULL
);

CREATE TABLE IF NOT EXISTS spec
(
    spec_id        SERIAL PRIMARY KEY,
    name_service   VARCHAR       NOT NULL,
    name_public    VARCHAR       NOT NULL,
    object_type    objectType    NOT NULL,
    options_number optionsNumber NOT NULL
);

CREATE TABLE IF NOT EXISTS option
(
    option_id SERIAL PRIMARY KEY,
    name      VARCHAR NOT NULL,
    "order"   INTEGER NOT NULL,
    spec_id   INTEGER NOT NULL REFERENCES spec (spec_id) ON UPDATE CASCADE ON DELETE CASCADE
);

CREATE UNIQUE INDEX option_order_spec_id_key ON option ("order", spec_id);


-- ===========================================================================
-- RELATIONS: MANY-TO-MANY
-- ===========================================================================
CREATE TABLE IF NOT EXISTS section_on_spec
(
    section_id INTEGER NOT NULL REFERENCES section (section_id) ON DELETE CASCADE,
    spec_id    INTEGER NOT NULL REFERENCES spec (spec_id) ON DELETE RESTRICT
);

CREATE UNIQUE INDEX section_on_spec_section_id_spec_id_key ON section_on_spec (section_id, spec_id);

CREATE TABLE IF NOT EXISTS object_on_section
(
    object_id  INTEGER NOT NULL REFERENCES object (object_id) ON DELETE CASCADE,
    section_id INTEGER NOT NULL REFERENCES section (section_id) ON DELETE CASCADE
);

CREATE UNIQUE INDEX object_on_section_object_id_section_id_key ON object_on_section (object_id, section_id);

CREATE TABLE IF NOT EXISTS object_on_option
(
    object_id INTEGER NOT NULL REFERENCES object (object_id) ON DELETE CASCADE,
    option_id INTEGER NOT NULL REFERENCES option (option_id) ON DELETE RESTRICT
);

CREATE UNIQUE INDEX object_on_option_object_id_option_id_key ON object_on_option (object_id, option_id);


-- ===========================================================================
-- CONTACTS
-- ===========================================================================
CREATE TABLE IF NOT EXISTS object_link
(
    object_id INTEGER NOT NULL REFERENCES object (object_id) ON DELETE CASCADE,
    "order"   INTEGER NOT NULL,
    value     VARCHAR NOT NULL,
    comment   VARCHAR
);

CREATE UNIQUE INDEX object_link_object_id_order_key ON object_link (object_id, "order");

CREATE TABLE IF NOT EXISTS object_phone
(
    object_id INTEGER NOT NULL REFERENCES object (object_id) ON DELETE CASCADE,
    "order"   INTEGER NOT NULL,
    value     VARCHAR NOT NULL,
    comment   VARCHAR
);

CREATE UNIQUE INDEX object_phone_object_id_order_key ON object_phone (object_id, "order");


-- ===========================================================================
-- PHOTO
-- ===========================================================================
CREATE TABLE IF NOT EXISTS object_photo
(
    object_id INTEGER NOT NULL REFERENCES object (object_id) ON DELETE CASCADE,
    name      VARCHAR NOT NULL,
    "order"   INTEGER NOT NULL,
    uploaded  TIMESTAMP DEFAULT now()
);

CREATE UNIQUE INDEX object_photo_object_id_name_order_key ON object_photo (object_id, name, "order");


-- ===========================================================================
-- SCHEDULE
-- ===========================================================================
CREATE TABLE IF NOT EXISTS object_schedule
(
    object_id INTEGER NOT NULL,
    day_num   INTEGER NOT NULL,
    time      VARCHAR NOT NULL,
    "from"    INTEGER NOT NULL,
    "to"      INTEGER NOT NULL
);

CREATE UNIQUE INDEX object_schedule_object_id_day_num_key ON object_schedule (object_id, day_num);