CREATE DATABASE IF NOT EXISTS admin_los_pastos
CHARACTER SET utf8mb4
COLLATE utf8mb4_unicode_ci;

USE admin_los_pastos;

-- =========================================
-- PRODUCTOS
-- =========================================

CREATE TABLE productos (
    id_producto INT AUTO_INCREMENT PRIMARY KEY,
    tipo_producto ENUM('PRENDA', 'TELA') NOT NULL,
    nombre VARCHAR(150) NOT NULL,
    color VARCHAR(100),
    descripcion TEXT,
    precio DECIMAL(10,2),
    talla_tamano VARCHAR(100),
    imagen VARCHAR(255),
    activo BOOLEAN DEFAULT TRUE
);

-- =========================================
-- USUARIOS DEL MÓDULO ADMINISTRATIVO
-- =========================================

CREATE TABLE usuarios (
    id_usuario INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(150) NOT NULL,
    correo VARCHAR(150) NOT NULL UNIQUE,
    google_id VARCHAR(255) UNIQUE,
    rol ENUM('ADMIN', 'DEVELOPER', 'EDITOR') NOT NULL,
    activo BOOLEAN DEFAULT TRUE
);

-- =========================================
-- DATOS / EVENTOS PARA EL DASHBOARD
-- =========================================

CREATE TABLE datos (
    id_dato INT AUTO_INCREMENT PRIMARY KEY,
    tipo_evento VARCHAR(100) NOT NULL,
    fecha_hora DATETIME DEFAULT CURRENT_TIMESTAMP
);

USE admin_los_pastos;
INSERT INTO productos
(tipo_producto, nombre, color, descripcion, precio, talla_tamano, imagen, activo)
VALUES
(
    'TELA',
    'Gabardina azul',
    'Azul marino',
    'Tela para confección de prendas',
    6.50,
    '20 m x 2 m',
    '',
    TRUE
),
(
    'PRENDA',
    'Pantalón de trabajo',
    'Negro',
    'Pantalón para trabajo',
    25.00,
    'M',
    '',
    TRUE
);
select * from productos;