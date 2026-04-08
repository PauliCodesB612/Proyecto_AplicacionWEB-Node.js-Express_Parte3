const homeController = {
  getHome: (_req, res) => {
    res.send(`
      <!DOCTYPE html>
      <html lang="es">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
        <title>Node & Express App - Módulo 8</title>
        <link rel="stylesheet" href="/styles.css" />
      </head>
      <body>
        <main class="page">
          <section class="card hero-card">
            <span class="badge">Módulo 8</span>
            <h1>🚀 API REST segura con Node.js</h1>
            <p>
              Continuación de los módulos 6 y 7 con autenticación JWT, bcrypt,
              rutas protegidas y subida de archivos al servidor.
            </p>
            <div class="actions">
              <a href="/status">Ver estado del servidor</a>
              <a href="/api/public/endpoints">Ver endpoints públicos</a>
            </div>
          </section>

          <section class="grid">
            <article class="card info-card">
              <h2>Qué agrega esta versión</h2>
              <ul>
                <li>Registro y login con JWT.</li>
                <li>Rutas privadas protegidas con middleware.</li>
                <li>Subida de imágenes con Multer.</li>
                <li>Asociación opcional del avatar a un usuario.</li>
                <li>API lista para consumirse desde un cliente externo.</li>
              </ul>
            </article>

            <article class="card info-card">
              <h2>Primeros pasos sugeridos</h2>
              <ol>
                <li><code>POST /api/auth/register</code></li>
                <li><code>POST /api/auth/login</code></li>
                <li>Copiar el token Bearer</li>
                <li>Probar <code>GET /api/auth/me</code> o <code>GET /api/users</code></li>
                <li>Subir un avatar en <code>POST /api/upload</code></li>
              </ol>
            </article>
          </section>
        </main>
      </body>
      </html>
    `);
  },
};

module.exports = homeController;
