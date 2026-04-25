# Društvo naturista Hrvatske – Web

Angular 20 SPA with a PHP 8 backend API and MariaDB database.

## Local development

**Prerequisites:** Node.js 22, a reachable PHP + MariaDB instance on port 54321.

```bash
npm install
npm start        # dev server at http://localhost:4200, proxies /api → localhost:54321
npm run build    # production build → dist/dnh-web/browser/
npm test         # Karma/Jasmine unit tests
```

---

## Deployment

### Docker (current setup)

The repository ships a multi-stage `Dockerfile` that builds the Angular app and
packages it together with nginx 1.29 and PHP-FPM 8.4 into a single image.

```bash
docker build -t dnh-web .
docker run -d \
  -p 50004:50004 \
  -e DB_HOST=host.docker.internal \
  -e DB_NAME=dnh \
  -e DB_USER=dnh_user \
  -e DB_PASS=secret \
  -v /srv/dnh/images:/usr/share/nginx/html/images \
  -v /srv/dnh/documents:/usr/share/nginx/html/documents \
  dnh-web
```

Persistent uploads live in the two host-mounted volumes; everything else is
rebuilt from the image on each deploy.

---

### Traditional / shared hosting

The stack is a standard Angular + PHP + MySQL combination that runs on any host
offering **PHP 8.1+** and **MySQL/MariaDB**, with either Apache (mod_rewrite) or
nginx. No Docker, no Node.js runtime on the server is required.

#### 1. Build locally

```bash
npm install
npm run build
```

This produces `dist/dnh-web/browser/` – static HTML/JS/CSS ready to upload.

#### 2. Upload files

Copy the following to your web root (`public_html/`, `www/`, or equivalent):

```
dist/dnh-web/browser/*   → web root (index.html, main-*.js, styles-*.css, …)
api/                     → web root/api/
db/                      → web root/db/   (only needed for running migrations)
```

Create two writable directories in the web root:

```bash
mkdir images documents
chmod 755 images documents   # web server must be able to write here
```

#### 3. Set up the database

Create a MySQL/MariaDB database and user, then run the migrations in order:

```bash
mysql -u dnh_user -p dnh < db/schema.sql
```

To create the first admin user, run `api/insert_user.php` once (delete or
protect it afterwards).

#### 4. Configure database credentials

The PHP backend reads credentials from environment variables:
`DB_HOST`, `DB_NAME`, `DB_USER`, `DB_PASS`.

**Apache** – add to `.htaccess` in your web root (requires `AllowOverride All`
or `AllowOverride Env` in the server config, which most shared hosts enable):

```apache
SetEnv DB_HOST localhost
SetEnv DB_NAME dnh
SetEnv DB_USER dnh_user
SetEnv DB_PASS secret
```

**nginx + PHP-FPM** – add to the `location ~ \.php$` block in your server config:

```nginx
fastcgi_param DB_HOST localhost;
fastcgi_param DB_NAME dnh;
fastcgi_param DB_USER dnh_user;
fastcgi_param DB_PASS secret;
```

#### 5. Configure SPA routing

The Angular app is a single-page application: the server must return
`index.html` for every URL that is not a real file or the `/api`, `/images`, or
`/documents` directories.

**Apache** – create (or add to) `.htaccess` in the web root:

```apache
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /

  # Pass through PHP API, uploaded images and documents
  RewriteRule ^api/ - [L]
  RewriteRule ^images/ - [L]
  RewriteRule ^documents/ - [L]

  # Serve existing files/directories directly
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d

  # Everything else → Angular entry point
  RewriteRule . /index.html [L]
</IfModule>
```

**nginx** – the `try_files` directive already in `nginx.conf` covers this; copy
the relevant `location /` block to your server config.

#### Summary of what ends up in the web root

```
index.html
main-*.js / polyfills-*.js / styles-*.css / …   ← Angular build output
assets/
api/
images/      ← writable, initially empty
documents/   ← writable, initially empty
.htaccess    ← Apache only
```
