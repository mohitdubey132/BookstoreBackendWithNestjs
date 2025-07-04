# 🏗️ Bookverse – Microservices System Design

Bookverse is designed using a **microservices architecture** to ensure scalability, maintainability, and independent service deployment. Each microservice owns its own data and communicates via **RabbitMQ message queues**, while an **API Gateway** acts as the unified entry point for clients.

---

## 📦 Services Overview

### 1. `user_service`
- **Domain**: User registration, authentication, and profile management.
- **Database**: PostgreSQL (`user_db`)
- **Queue Binding**: Listens to RabbitMQ for messages from other services (e.g., new order events).
- **Responsibilities**:
  - Manage user data
  - Respond to events (e.g., fetch user info for order)

---

### 2. `order_and_product`
- **Domain**: Product listing, order creation, order tracking.
- **Database**: PostgreSQL (`order_and_product`)
- **Queue Binding**: Sends messages to `user_service` and listens for user data via RabbitMQ.
- **Responsibilities**:
  - Handle product catalog
  - Manage orders
  - Publish events (e.g., "OrderCreated")

---

### 3. `api-gateway`
- **Domain**: Unified gateway for all external API requests.
- **Responsibilities**:
  - Route HTTP requests to appropriate services
  - Convert HTTP → Queue request, wait for response (when needed)
  - Handle service authentication, validation, and rate-limiting (if implemented)

---

## 🔁 Inter-Service Communication – RabbitMQ

We use **RabbitMQ** as the message broker to decouple services and ensure asynchronous communication.

### Why RabbitMQ?
- Asynchronous and reliable messaging
- Decouples services — they don't need to know about each other's HTTP endpoints
- Easy to scale consumers independently

### Example Flow – Order Creation:
1. `api-gateway` receives a POST `/orders` request.
2. It sends a message to `order_and_product` via RabbitMQ.
3. `order_and_product` handles order logic, then:
   - Publishes an event `OrderCreated` to a queue.
4. `user_service` listens for `OrderCreated` and:
   - May update user history or trigger a notification.

---

## 🗃️ Database Design (Independent per Service)

Each microservice maintains its own **PostgreSQL** database to preserve autonomy and ensure data isolation.

| Service            | Database URL (local)                                             |
|--------------------|------------------------------------------------------------------|
| `user_service`     | `postgresql://user_admin:secret123@localhost:5435/user_db`       |
| `order_and_product`| `postgresql://order_admin:order123@localhost:5433/order_and_product` |

This approach follows the **Database per Service** pattern to ensure loose coupling and service independence.

---

## ⚙️ Tech Stack

| Layer              | Technology                      |
|--------------------|---------------------------------|
| Language/Runtime   | Node.js                         |
| Communication      | RabbitMQ                        |
| API Gateway        | NestJS Gateway Service          |
| DB per Service     | PostgreSQL                      |
| Dev Orchestration  | Docker Compose                  |

---

## 📶 System Architecture Diagram (Conceptual)

              [ Clients / Frontend ]
                       |
                       v
              ┌─────────────────────┐
              │     API Gateway     │
              └─────────────────────┘
                       |
                       v
               ┌──────────────┐
               │  RabbitMQ    │
               └────┬────┬────┘
                    |    |
          ┌─────────┘    └──────────┐
          v                         v
   ┌────────────┐         ┌───────────────────┐
   │user_service│◀──────▶│ order_and_product │
   └────┬───────┘         └──────────┬────────┘
        |                            |
        v                            v
┌────────────────┐         ┌───────────────────────┐
│  user_db       │         │ order_and_product_db  │
└────────────────┘         └───────────────────────┘
