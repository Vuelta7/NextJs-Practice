Initializing Prisma for DB

```bash
npx prisma init
```

for database docker run

```bash
docker-compose up -d postgres
docker compose up -d
```

add @unique and bcrypt

To initialize the DB inside the postgres

```bash
npx prisma db push
npx prisma generate
```

To look inside the prisma DB

```bash
npx prisma studio
```
