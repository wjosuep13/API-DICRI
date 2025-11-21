
USE DICRI;
GO


CREATE TABLE ROL (
	id int IDENTITY(1,1) PRIMARY KEY,
	nombre varchar(50) not null,
	descripcion varchar(150) not null
)

CREATE TABLE "USER" (
	id int IDENTITY(1,1) PRIMARY KEY,
	"password" varchar(64) not null,
	user_name varchar(50) not null,
	is_active bit not null default 1,
	id_rol int not null,
	FOREIGN KEY (id_rol) REFERENCES ROL
);

CREATE TABLE TECNICO (
	id int IDENTITY(1,1) PRIMARY KEY,
	nombre varchar(50) not null,
	apellido varchar(50) not null,
	no_telefono varchar(8) null,
	id_usuario int not null,
	FOREIGN KEY (id_usuario) REFERENCES "USER" 
);

CREATE TABLE ESTADO_EXPEDIENTE (
	id int IDENTITY(1,1) PRIMARY KEY,
	descripcion_estado varchar(50) not null,
)

CREATE TABLE EXPEDIENTE(
	no_expediente int IDENTITY(1,1) PRIMARY KEY,
	nombre varchar(50) not null,
	descripcion varchar(200) null,
	fecha_creacion date not null,
	id_tecnico int not null,
	FOREIGN KEY (id_tecnico) REFERENCES TECNICO
)

CREATE TABLE INDICIO (
	id int IDENTITY(1,1) PRIMARY KEY,
	descripcion varchar(100) not null,
	color varchar(20) not null,
	tamanio varchar(100) not null,
	peso_libras DECIMAL(10,2) not null,
	ubicacion varchar(100) not null,
	id_tecnico int not null,
	no_expediente int not null,
	FOREIGN KEY (id_tecnico) REFERENCES TECNICO,
	FOREIGN KEY (no_expediente) REFERENCES EXPEDIENTE
)

CREATE TABLE HISTORIAL_EXPEDIENTE (
	id int IDENTITY(1,1) PRIMARY KEY,
	id_usuario int not null,
	id_estado int not null,
	id_expediente int not null,
	fecha_actualizacion date not null default GETDATE(),
	descripcion_cambio VARCHAR(200) NULL,
	FOREIGN KEY (id_usuario) REFERENCES "USER",
	FOREIGN KEY (id_estado) REFERENCES ESTADO_EXPEDIENTE,
	FOREIGN KEY (id_expediente) REFERENCES EXPEDIENTE
	)

	INSERT INTO ROL (nombre,descripcion)
	VALUES ('Editor','Rol para poder crear expedientes e indicios')
	INSERT INTO ROL (nombre,descripcion)
	VALUES ('Coordinador','Rol para la persona que puede aprobar o rechazar expedientes')


INSERT INTO ESTADO_EXPEDIENTE (descripcion_estado) VALUES('ABIERTO')
INSERT INTO ESTADO_EXPEDIENTE (descripcion_estado) VALUES('REVISION')
INSERT INTO ESTADO_EXPEDIENTE (descripcion_estado) VALUES('RECHAZADO')
INSERT INTO ESTADO_EXPEDIENTE (descripcion_estado) VALUES('APROBADO')

