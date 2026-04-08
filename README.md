# 🚀 Aplicación Web con Node.js y Express
## Módulo 8 – API REST segura con JWT y subida de archivos

Este proyecto corresponde a la **continuación de los módulos 6 y 7**. Se mantiene la estructura base del servidor, se agregan las funcionalidades: autenticación con **JWT**, cifrado de contraseñas con **bcryptjs**, rutas privadas, subida de archivos con **Multer** y respuestas consistentes para consumo desde clientes externos.

---

## 🧠 Objetivo del proyecto

Implementar una **API RESTful segura y modular** que permita:

- registrar y autenticar usuarios
- proteger rutas mediante JWT
- mantener el CRUD de usuarios y tareas del módulo 7
- subir imágenes al servidor y asociarlas a usuarios
- dejar el backend listo para ser consumido desde un frontend o cliente externo

---

## 🛠️ Tecnologías utilizadas

- Node.js
- Express.js
- PostgreSQL
- Sequelize
- bcryptjs
- jsonwebtoken
- multer
- dotenv
- nodemon

---

## 📁 Estructura del proyecto

```bash
.
├── index.js
├── routes/
│   └── router.js
├── controllers/
│   ├── authController.js
│   ├── homeController.js
│   ├── statusController.js
│   ├── usersController.js
│   ├── tasksController.js
│   └── uploadController.js
├── models/
│   ├── index.js
│   ├── User.js
│   └── Task.js
├── services/
│   └── seedService.js
├── middlewares/
│   ├── authMiddleware.js
│   ├── errorHandler.js
│   ├── logger.js
│   └── uploadMiddleware.js
├── config/
│   └── database.js
├── utils/
│   ├── apiResponse.js
│   ├── asyncHandler.js
│   ├── auth.js
│   └── validators.js
├── public/
│   └── styles.css
├── uploads/
├── logs/
│   └── log.txt
├── postman/
│   └── Modulo8-Pauli-Collection.json
├── .env.example
├── .gitignore
├── package.json
└── README.md
```

---

## ⚙️ Instalación y ejecución

1. Clonar el repositorio:

```bash
git clone https://github.com/TU-USUARIO/TU-REPO.git
cd TU-REPO
```

2. Instalar dependencias:

```bash
npm install
```

3. Crear una base de datos PostgreSQL, por ejemplo:

```sql
CREATE DATABASE modulo8_db;
```

4. Crear un archivo `.env` tomando como base `.env.example`:

```env
PORT=3000
NODE_ENV=development
APP_NAME=Node-Express-WebApp
DB_HOST=localhost
DB_PORT=5432
DB_NAME=modulo8_db
DB_USER=postgres
DB_PASSWORD=tu_password
DB_DIALECT=postgres
DB_LOGGING=false
JWT_SECRET=super_secret_jwt_key
JWT_EXPIRES_IN=2h
UPLOAD_MAX_SIZE_MB=2
```

5. Ejecutar el proyecto:

```bash
npm run dev
```

6. Abrir en el navegador:

```text
http://localhost:3000
```

---

## 🔐 Autenticación

### Registro
`POST /api/auth/register`

```json
{
  "name": "Paulina",
  "email": "pauli@example.com",
  "password": "Pauli1234",
  "role": "viewer",
  "active": true
}
```

### Login
`POST /api/auth/login`

```json
{
  "email": "pauli@example.com",
  "password": "Pauli1234"
}
```

La respuesta entrega un token JWT. Para consumir rutas protegidas debes enviarlo en el header:

```http
Authorization: Bearer TU_TOKEN
```

### Perfil autenticado
`GET /api/auth/me`

---

## 🔌 Endpoints principales

### Públicos
- `GET /`
- `GET /status`
- `GET /api/public/endpoints`
- `POST /api/auth/register`
- `POST /api/auth/login`

### Protegidos con JWT
- `GET /api/auth/me`
- `GET /api/users`
- `GET /api/users/raw`
- `GET /api/users/:id`
- `POST /api/users`
- `PUT /api/users/:id`
- `DELETE /api/users/:id`
- `GET /api/users/:id/tasks`
- `POST /api/users/transactional`
- `GET /api/tasks`
- `GET /api/tasks/:id`
- `POST /api/tasks`
- `PUT /api/tasks/:id`
- `DELETE /api/tasks/:id`
- `POST /api/upload`

---

## 📂 Subida de archivos

Se implementó un endpoint para subir imágenes usando **Multer**.

### Endpoint
`POST /api/upload`

### Reglas
- campo del formulario: `avatar`
- tipos permitidos: `jpg`, `png`, `webp`
- tamaño máximo: `2 MB`
- carpeta destino: `uploads/`

### Uso opcional
También puedes enviar `userId` para asociar el archivo subido al usuario y guardar la ruta en la base de datos.

---

## 🧪 Pruebas con Postman

El proyecto incluye una colección lista para importar:

```text
postman/Modulo8-Pauli-Collection.json
```

Orden sugerido para probar:
1. `POST /api/auth/register`
2. `POST /api/auth/login`
3. Guardar el token
4. Probar rutas protegidas
5. Probar `POST /api/upload`

---

## ⚠️ Validaciones y manejo de errores

- validación de campos obligatorios
- validación de email y contraseña
- validación de IDs
- validación de tipo y tamaño de archivo
- errores controlados con `try/catch`, middleware central y respuestas consistentes

Formato general de respuesta:

```json
{
  "status": "success",
  "message": "Operación realizada correctamente",
  "data": {}
}
```

---

## 📈 Evolución respecto a los módulos anteriores

| Módulo 6 | Módulo 7 | Módulo 8 |
|----------|----------|----------|
| servidor base, rutas y logs | base de datos, ORM, CRUD y relaciones | API REST, JWT, bcrypt, rutas protegidas y upload |

---

## 📌 Decisiones técnicas

- Se utilizó **PostgreSQL + Sequelize** para conservar la base del módulo 7.
- Se eligió **bcryptjs** para almacenar contraseñas cifradas.
- Se utilizó **jsonwebtoken** para proteger endpoints mediante tokens temporales.
- Se integró **Multer** para cumplir con la carga de archivos solicitada en la pauta.

---

## 👩‍💻 Autora

**Paulina Villegas**  
Full Stack JavaScript Trainee 

---