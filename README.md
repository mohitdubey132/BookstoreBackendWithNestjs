# 📦 Microservices Project – Bookverse

This project is built using Node.js and follows a microservices architecture with the following services:

- `user_service`
- `order_and_product`
- `api-gateway`

You can run these services individually for development or use Docker Compose to run everything together.

---
### start docker service 
  docker compose up -d


## 🚀 Start Services Individually (Development Mode)

Make sure you're in the project root directory before running the commands below.

### Start  Service
```bash
npm run start:dev user_service
npm run start:dev order_and_product
npm run start:dev api-gateway
```


### migrate db for order and product service 
##  apps/order_and_product
npx prisma migrate deploy

### migrate db for user service 
##  apps/user_service
npx prisma migrate deploy



### add .env file in apps/user_service with this key-vales 
```
DATABASE_URL="postgresql://user_admin:secret123@localhost:5435/user_db?schema=public"
```
### add .env file in apps/order_and_product with this key-vales 
```
DATABASE_URL="postgresql://order_admin:order123@localhost:5433/order_and_product?schema=public"

```