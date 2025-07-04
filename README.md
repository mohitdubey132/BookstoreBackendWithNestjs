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

## Problems that i face 
1. 🔁 Not Receiving Response from Another Service
  Problem:
  I was trying to call another service and expected a response, but wasn’t receiving anything. The service call was using the ClientProxy.send() method, but I did not await the result properly.
  ts
    ```
    // ❌ Incorrect (no response handled)
    this.client.send('user.get', { userId });
    ```
    Result:

    No response was received.

    Debugging was difficult because the call just hung silently or did nothing.

    Solution:
    Used firstValueFrom() from rxjs to await the observable response correctly.

    ```
    // ✅ Correct usage
    import { firstValueFrom } from 'rxjs';

    const result: any = await firstValueFrom(
      this.client.send('user.get', { userId })
    );
    ```

2. ⚠️ Razorpay Integration Issue & Fix
    ❌ Problem
    While setting up Razorpay in the NestJS microservice, we encountered this runtime error:

    vbnet
    ```
    TypeError: razorpay_1.default is not a constructor
    ```
    This happens when Razorpay is not imported properly in a TypeScript (ESModule-based) project.

    ✅ Root Cause
    Incorrect import usage of Razorpay in a TypeScript/NestJS environment:

    ts
    ```
    // ❌ This causes the error:
    import * as Razorpay from 'razorpay';
    const razorpay = new Razorpay(); // ❌ Fails: not a constructor
    ```
    ✅ Solution
    Use default import syntax instead:

    ts
    // ✅ Correct way
    ```
    import Razorpay from 'razorpay';

    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });
    ```
    Also ensure the SDK is installed:

    bash
    ```
    npm install razorpay
    ```
    🧪 Confirmed Fix
    After switching to the correct import syntax and verifying the environment variables (RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET), Razorpay started working as expected.

    Payments were created and verified

    No runtime issues after the fix

