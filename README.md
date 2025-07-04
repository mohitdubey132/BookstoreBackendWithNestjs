# 📦 Microservices Project – Bookverse

This project is built using Node.js and follows a microservices architecture with the following services:

- `user_service`
- `order_and_product`
- `api-gateway`

You can run these services individually for development or use Docker Compose to run everything together.

---
### start docker service 
```
  docker compose up -d
```

## 🚀 Start Services Individually (Development Mode)
Make sure you're in the project root directory before running the commands below.
### migrate db for order and product service 
##  apps/order_and_product
npx prisma migrate deploy
### ⚙️ run api-gateway 
```
npm i 
npm run start:dev api-gateway
```

### ⚙️ run order service 
```
npm i
cd apps/order_and_product
npx prisma migrate deploy  
cd ../..
npm run start:dev order_and_product
```
### Seed Product Table in root folder 
```
npx prisma db seed
```

### ⚙️ run user_service service 
```
npm i 
cd apps/user_service
npx prisma migrate deploy  
cd ../..
npm run start:dev user_service
```
### add .env file  with this key-vales in root 
```
DATABASE_URL1="postgresql://user_admin:secret123@localhost:5435/user_db?schema=public"
DATABASE_URL="postgresql://order_admin:order123@localhost:5433/order_and_product?schema=public"
RABBITMQ_URL="amqp://admin:admin@localhost:5672"
RAZORPAY_KEY_ID="rzp_test_nV62MButqwbJQk"
RAZORPAY_KEY_SECRET="X7mvwUKnkUmtkz0QWYCkzlbd"
```