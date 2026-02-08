# taskNest

## How to run the file (Dev)

1) Create .env file

```bash
cp .env.example .env

PORT=3000
DB_HOST=db
DB_PORT=3306
DB_USERNAME=root
DB_PASSWORD=tasknest
DB_NAME=tasknest
CORS_ORIGIN=http://localhost:5173

```

2) Run with Docker

```bash
docker compose up --build
```

## URL

- API: http://localhost:3000
- Swagger: http://localhost:3000/docs
- phpMyAdmin: http://localhost:8082

## Example API

```bash
curl http://localhost:3000/tasks
```

```bash
curl -X POST http://localhost:3000/tasks \
  -H 'Content-Type: application/json' \
  -d '{"title":"Test","status":"TODO"}'
```
