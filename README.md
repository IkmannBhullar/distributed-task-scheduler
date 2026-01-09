# 🚀 Distributed Task Scheduler & Monitor

![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)
![NodeJS](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white)
![Redis](https://img.shields.io/badge/redis-%23DD0031.svg?style=for-the-badge&logo=redis&logoColor=white)
![Docker](https://img.shields.io/badge/docker-%230db7ed.svg?style=for-the-badge&logo=docker&logoColor=white)
![Next JS](https://img.shields.io/badge/Next-black?style=for-the-badge&logo=next.js&logoColor=white)

A high-throughput, fault-tolerant distributed system capable of handling concurrent background jobs with zero data loss. Includes a real-time dashboard for monitoring system health.

---

## 🍔 The Concept: "The Kitchen Analogy"

Understanding distributed systems can be complex. Think of this application like a busy restaurant kitchen:

1.  **The Producer (The Cashier):** \* _Real World:_ Takes orders from customers instantly.
    - _This App:_ An API that accepts jobs and places them on the "Ticket Rail" (Redis Queue). It handles high traffic without slowing down.
2.  **The Queue (The Ticket Rail):** \* _Real World:_ Holds the orders in line so no request is lost.
    - _This App:_ A Redis list that acts as a buffer between the fast API and the heavy processing.
3.  **The Workers (The Chefs):** \* _Real World:_ They grab tickets one by one and cook the meal. If the restaurant gets busy, you hire more chefs.
    - _This App:_ Node.js microservices that pick up jobs, process them, and mark them as done. This system scales horizontally—you can spin up 100 workers with one command.

---

## 📸 System Architecture

```mermaid
graph TD
    User[User / Client] -->|HTTP Request| API[Producer API]

    subgraph Infrastructure
        Redis[(Redis Queue)]
        Dashboard[Next.js Dashboard]
    end

    subgraph Worker Cluster
        W1[Worker Node 1]
        W2[Worker Node 2]
        W3[Worker Node 3]
    end

    API -->|LPUSH job| Redis

    Redis <-->|RPOPLPUSH| W1
    Redis <-->|RPOPLPUSH| W2
    Redis <-->|RPOPLPUSH| W3

    W1 -.->|WebSocket Update| Dashboard
    W2 -.->|WebSocket Update| Dashboard
    W3 -.->|WebSocket Update| Dashboard

    Redis -.->|Poll Status| Dashboard
```
