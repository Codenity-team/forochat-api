\c postgres

select pg_terminate_backend(pid) from pg_stat_activity where datname='forochat';

DROP DATABASE if exists forochat;
CREATE DATABASE forochat
WITH ENCODING = "UTF8"
CONNECTION LIMIT = -1;

\c forochat

\encoding UTF8

CREATE TABLE public.users (
	id bigserial NOT NULL,
	
	first_name VARCHAR(100) NOT NULL,
	last_name VARCHAR(100) NOT NULL,

	username VARCHAR(100) NOT NULL,
	
	status VARCHAR(100) NOT NULL,

	email VARCHAR(50) NOT NULL,
	identification VARCHAR(50) NULL,

	phone VARCHAR(50) NULL,

	password VARCHAR(50) NOT NULL,

	address text NULL,

	create_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
	update_at timestamp NULL,

	CONSTRAINT users_mail_key UNIQUE (email),
	CONSTRAINT users_pkey PRIMARY KEY (id)
);


CREATE TABLE public.cars (
	id bigserial NOT NULL,
	
	model VARCHAR(100) NOT NULL,
	color VARCHAR(100) NOT NULL,
	
	brand VARCHAR(100) NOT NULL,
	plate VARCHAR(50) NOT NULL,
	
	id_user int4 NOT NULL,
	
	status VARCHAR(100) NOT NULL,
	creation_date timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
	modification_date timestamp NULL,
	
	CONSTRAINT cars_pkey PRIMARY KEY (id),
	CONSTRAINT cars_plate_key UNIQUE (plate),
	CONSTRAINT cars_id_user_fkey FOREIGN KEY (id_user) REFERENCES public.users(id)
);

CREATE TABLE public.repairs (
	id bigserial NOT NULL,
	
	name VARCHAR(100) NOT NULL,
	description VARCHAR(400) NOT NULL,
	id_car int4 NOT NULL,
	
	status VARCHAR(100) NOT NULL,
	creation_date timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
	modification_date timestamp NULL,
	
	CONSTRAINT repairs_pkey PRIMARY KEY (id),
	CONSTRAINT repairs_id_car_fkey FOREIGN KEY (id_car) REFERENCES public.cars(id)
);