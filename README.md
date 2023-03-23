# Talking to AI

This project is created to have combination of multiple tools and how to combine them to reach the full power of all these API integrations and AI.

---

## How to run Locally?

To run locally copy `.env.example` to an empty `.env` file and replace the variables there.

| Key                    | Description                                                 |
| ---------------------- | ----------------------------------------------------------- |
| `DATABASE_URL`         | should refer postgresql database it can be local db.        |
| `SUPABASE_URL`         | supabase project url                                        |
| `SUPABASE_SERVICE_KEY` | supebase service key. (not: anon key that is used publicly) |

### 1. Install Packages

Run following commands at the first time running of the project.

```bash

npm install // to install packages locally

npm run db:migrate:dev // to make sure database structure is aligned with prisma.schema

```

Application by default will work on `localhost:3000` then you need to signup yourself locally.

#### Database

If you are not sure how to setup database follow these steps:

- Download Docker Desktop on your machine
- Run `npm run db:local`, this will install postgresql and start database locally.
  - You can replace `DATABASE_URL` to `postgres://prisma:password@localhost:5432/talktoai?schema=public`

### 2. Running Application

To run application after setup up the application with the steps above, use commands below

```bash

npm run dev // make sure to replace .env variables before running.

```

---
