set client_min_messages to warning;

-- DANGER: this is NOT how to do it in the real world.
-- `drop schema` INSTANTLY ERASES EVERYTHING.
drop schema "public" cascade;

create schema "public";

CREATE TABLE "public"."users" (
	"userId" serial NOT NULL,
	"firstName" TEXT NOT NULL,
	"lastName" TEXT NOT NULL,
	"email" TEXT NOT NULL UNIQUE,
	"phoneNumber" TEXT NOT NULL UNIQUE,
	"userName" TEXT NOT NULL UNIQUE,
	"hashedPassword" TEXT NOT NULL,
	CONSTRAINT "users_pk" PRIMARY KEY ("userId")
) WITH (
  OIDS=FALSE
);



CREATE TABLE "public"."Services" (
	"serviceId" serial NOT NULL,
	"name" TEXT NOT NULL,
	"description" TEXT NOT NULL,
	"price" TEXT NOT NULL,
	"createdAt" DATE NOT NULL,
	"updatedAt" DATE NOT NULL,
	CONSTRAINT "Services_pk" PRIMARY KEY ("serviceId")
) WITH (
  OIDS=FALSE
);



CREATE TABLE "public"."orders" (
	"orderId" serial NOT NULL,
	"userId" integer NOT NULL,
	"serviceId" integer NOT NULL,
	"orderEmail" TEXT NOT NULL,
	"totalAmount" money NOT NULL,
	"createdAt" DATE NOT NULL,
	"updatedAt" DATE NOT NULL,
	CONSTRAINT "orders_pk" PRIMARY KEY ("orderId")
) WITH (
  OIDS=FALSE
);





ALTER TABLE "orders" ADD CONSTRAINT "orders_fk0" FOREIGN KEY ("userId") REFERENCES "users"("userId");
ALTER TABLE "orders" ADD CONSTRAINT "orders_fk1" FOREIGN KEY ("serviceId") REFERENCES "Services"("serviceId");
