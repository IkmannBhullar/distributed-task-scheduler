# 🔥 Distributed Grill: High-Throughput Task Scheduler

![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)
![Next JS](https://img.shields.io/badge/Next-black?style=for-the-badge&logo=next.js&logoColor=white)
![Redis](https://img.shields.io/badge/redis-%23DD0031.svg?style=for-the-badge&logo=redis&logoColor=white)
![Docker](https://img.shields.io/badge/docker-%230db7ed.svg?style=for-the-badge&logo=docker&logoColor=white)

> **A real-time visualization of a fault-tolerant, microservices-based job queue system.**

![Project Screenshot](https://via.placeholder.com/800x400?text=Paste+Your+Screenshot+Here)

## 💡 The Concept

This project demonstrates **Distributed System Architecture** by visualizing background jobs as "Food Orders" in a busy restaurant.

Instead of a boring list of logs, it uses a **Mission Control Dashboard** to show how high-volume requests are queued, processed by parallel worker nodes, and completed—all in real-time.

**It answers the question:** _"How do companies like Uber or DoorDash handle millions of requests without crashing?"_

---

## 🏗️ System Architecture

The system uses a **Producer-Consumer** pattern with **Redis** serving as the reliable message broker between the Next.js frontend (Producer) and the Node.js Microservices (Consumers).

```mermaid
graph TD
    User[User / Client] -->|HTTP POST| API[Next.js API Route]

    subgraph Infrastructure
        Redis[(Redis Queue)]
        Dashboard[Real-Time Dashboard]
    end

    subgraph "Worker Cluster (Docker)"
        W1[Worker Node 1]
        W2[Worker Node 2]
        W3[Worker Node 3]
    end

    API -->|LPUSH Job| Redis

    Redis -->|"RPOPLPUSH (Atomic)"| W1
    Redis -->|"RPOPLPUSH (Atomic)"| W2
    Redis -->|"RPOPLPUSH (Atomic)"| W3

    W1 -.->|Update Status| Dashboard
    W2 -.->|Update Status| Dashboard
    W3 -.->|Update Status| Dashboard
```
