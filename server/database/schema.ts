CREATE TABLE "users"(
  "id" int PRIMARY KEY,
  "name" varchar,
  "friends" int[],
  "photo" varchar
);

CREATE TABLE "messages"(
  "id" int PRIMARY KEY,
  "text" varchar,
  "user_id" int,
  "recipient_id" int
);

CREATE TABLE "artwork"(
  "id" int PRIMARY KEY,
  "type" varchar
);

CREATE TABLE "visualart"(
  "id" int PRIMARY KEY,
  "artwork_id" int,
  "title" varchar,
  "content" text,
  "url" text
);

CREATE TABLE "audio"(
  "id" int PRIMARY KEY,
  "artwork_id" int,
  "title" varchar,
  "content" text,
  "url" text
);

CREATE TABLE "stories"(
  "id" int PRIMARY KEY,
  "artwork_id" int,
  "title" varchar,
  "content" text,
  "page_count" int,
  "original_creator_id" int
);

CREATE TABLE "sculptures"(
  "id" int PRIMARY KEY,
  "artwork_id" int,
  "title" varchar,
  "content" text
);

CREATE TABLE "collaborations"(
  "id" int PRIMARY KEY,
  "artwork_id" int,
  "artwork_type" varchar,
  "is_private" boolean
);

CREATE TABLE "users_collaborations"(
  "id" int PRIMARY KEY,
  "collaboration_id" int,
  "user_id" int
);

ALTER TABLE "visualart" ADD FOREIGN KEY("artwork_id") REFERENCES "artwork"("id");

ALTER TABLE "audio" ADD FOREIGN KEY("artwork_id") REFERENCES "artwork"("id");

ALTER TABLE "stories" ADD FOREIGN KEY("artwork_id") REFERENCES "artwork"("id");

ALTER TABLE "stories" ADD FOREIGN KEY("original_creator_id") REFERENCES "users"("id");

ALTER TABLE "sculptures" ADD FOREIGN KEY("artwork_id") REFERENCES "artwork"("id");

ALTER TABLE "users_collaborations" ADD FOREIGN KEY("collaboration_id") REFERENCES "collaborations"("id");

ALTER TABLE "users_collaborations" ADD FOREIGN KEY("user_id") REFERENCES "users"("id");

ALTER TABLE "messages" ADD FOREIGN KEY("user_id") REFERENCES "users"("id");

ALTER TABLE "messages" ADD FOREIGN KEY("recipient_id") REFERENCES "users"("id");