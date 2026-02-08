# taskNest

## How to run the file (Dev)

1) Create .env file

```bash
cp .env.example .env
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
