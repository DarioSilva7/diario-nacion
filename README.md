# Challenge Técnico - Backend SSR para LA NACION

## 📝 Descripción

Este proyecto es una API REST desarrollada como parte del challenge técnico para el puesto de Backend SSR en LA NACION. La aplicación gestiona contactos con sus respectivas direcciones y ofrece funcionalidades CRUD completas.

## 🚀 Características Principales

Gestión de contactos: CRUD completo con validaciones

Autenticación JWT: Seguridad con token

Subida de imágenes: Para fotos de perfil

Notificaciones: Envío de emails para cumpleaños (simulacion)

Documentación: Swagger integrado

Pruebas: Unitarias

## 🛠 Tecnologías Utilizadas

Backend: Node.js, Express, TypeScript

Base de datos: PostgreSQL con TypeORM

Cache: Redis

Autenticación: JWT

Documentación: Swagger UI

Testing: Jest, Supertest

Otras: Docker, Multer (upload de archivos)

## ⚙️ Configuración del Entorno

1. Clonar el repositorio:

```
git clone https://github.com/DarioSilva7/diario-nacion.git
cd la-nacion-challenge
```

2. Instalar dependencias

```
npm install
```

3. Configurar variables de entorno

```
renombrar el archivo .env.example a .env
```

## Crear la base de datos

```
Crear base de datos con las mismas credenciales del .env
```

## 🐳 Ejecución con Docker

```
docker-compose up --build
```

## 📚 Documentación de la API

Accede a la documentación interactiva en:
http://localhost:3000/api-docs

## 🧪 Ejecución de Pruebas

```
npm test        # Pruebas unitarias
```

## 🌟 Endpoints Principales

### Autenticación

POST /api/auth/register - Registro de usuarios

```
curl --location 'http://localhost:3001/api/auth/register' \
--header 'Content-Type: application/json' \
--data-raw '{
    "email": "dario@example.com",
    "password": "Erina7",
    "name": "Dario"
}'
```

POST /api/auth/login - Inicio de sesión

```
curl --location 'http://localhost:3001/api/auth/login' \
--header 'Content-Type: application/json' \
--data-raw '{
    "email": "dario@example.com",
    "password": "Erina7"
}'
```

### Contactos

GET /api/contacts - Listar todos los contactos

GET /api/contacts/birthday-people?month - Listar todos los contactos que cumplen años en el mes, si no se pasa month, trae los del corriente mes.

GET /api/contacts/location?state&city - Listar todos los contactos por state y/o city

POST /api/contacts - Crear nuevo contacto

```
curl --location 'http://localhost:3001/api/contacts' \
--header 'Authorization: Bearer {{access_token}}' \
--form 'name="John Doe"' \
--form 'company="Coca-cola"' \
--form 'email="nick@example.com"' \
--form 'birthdate="1988-03-25"' \
--form 'phonePersonal="+5491112345678"' \
--form 'address[street]="Main St 123"' \
--form 'address[city]="Buenos Aires"' \
--form 'address[state]="caba"' \
--form 'profileImage=@"/C:/Users/Modernizacion01/Pictures/Screenshots/Screenshot 2025-03-21 103823.png"'
```

POST /api/contacts/notify-congratulation-email - Simula envio de email para saluar a los contactos que cumplen años el corriente dia

GET /api/contacts/:id - Obtener contacto específico

PATCH /api/contacts/:id - Actualizar contacto

DELETE /api/contacts/:id - Eliminar contacto

PATCH /api/contacts/:id/restore - Restaura contacto eliminado

GET /api/contacts/search/:term - Obtener contacto por email o telefono

```
curl --location 'http://localhost:3001/api/contact/term/3364687486'
```

PATCH /api/contacts/:id/profile-image - Actualiza foto de perfil del contacto
