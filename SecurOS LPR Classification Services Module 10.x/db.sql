-- Table: registros

-- DROP TABLE registros;

CREATE TABLE registros
(
  tid serial NOT NULL,
  fecha timestamp with time zone DEFAULT now(),
  placa text,
  clase text,
  modelo text,
  combustible text,
  cilindraje text,
  tipo text,
  id_reconocedor text,
  nombre_reconocedor text,
  grupo text,
  pm10 double precision,
  pm25 double precision,
  co2 double precision,
  co double precision,
  nox double precision
)
WITH (
  OIDS=FALSE
);
ALTER TABLE registros
  OWNER TO postgres;
  
-- Table: runt

-- DROP TABLE runt;

CREATE TABLE runt
(
  placa text,
  clase text,
  modelo text,
  combustible text,
  cilindraje text,
  tipo text,
  id serial NOT NULL,
  last_modify_date timestamp without time zone,
  last_modify_operator text,
  CONSTRAINT runt_pkey PRIMARY KEY (id )
)
WITH (
  OIDS=FALSE
);
ALTER TABLE runt
  OWNER TO postgres;
