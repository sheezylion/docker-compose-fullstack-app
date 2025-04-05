# Docker Compose Fullstack App (Frontend + Backend)
This project demonstrates how to build and run a simple fullstack application using Docker and Docker Compose. It includes:

- A dynamic frontend (HTML/CSS/JS) served by NGINX

- A backend Node.js API

- Both services are containerized and connected using Docker Compose

## Why Docker Compose?
While Docker is great for containerizing single applications, Docker Compose allows you to define and run multi-container applications — perfect for microservices or fullstack apps.

With Compose, you can:

- Run all your services (frontend, backend, database, etc.) with one command: docker-compose up

- Define how containers interact and depend on each other

- Easily scale or manage services

## Prerequisites
Make sure you have these installed:

- Docker

- Docker Compose

To verify installation, run:

```
docker --version
docker-compose --version
```
<img width="1617" alt="Screenshot 2025-04-05 at 14 23 09" src="https://github.com/user-attachments/assets/6312da0a-4417-46b7-b443-c474bc6047d3" />

## Folder Structure Overview

```
project-root/
│
├── frontend/
│   ├── index.html
│   ├── style.css
│   ├── script.js
│   └── Dockerfile
│
├── backend/
│   ├── server.js
│   └── Dockerfile
│
└── docker-compose.yml
```

## PART 1: Frontend Setup (HTML/CSS/JS with NGINX)
### **Step 1️: Create Frontend Directory**

```
mkdir frontend
cd frontend
```

### **Step 2️: Create Files**
- index.html: main HTML file

- style.css: styles

- script.js: fetches backend data dynamically

**index.html**
```
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>Docker Compose App</title>
  <link rel="stylesheet" href="style.css" />
</head>
<body>
  <div class="container">
    <h1>Welcome to My Docker App 🚀</h1>
    <p>This is a dynamic frontend served via NGINX.</p>
    <h2>Backend Message:</h2>
    <div id="backend-message">Loading...</div>
  </div>
  <script src="script.js"></script>
</body>
</html>
```

**style.css**
```
body {
  font-family: Arial, sans-serif;
  background: #f2f2f2;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  margin: 0;
}

.container {
  background: #fff;
  padding: 40px;
  border-radius: 12px;
  box-shadow: 0 5px 15px rgba(0,0,0,0.1);
  text-align: center;
}
```

**script.js**

```
fetch("http://localhost:5000/hello")
  .then((res) => res.json())
  .then((data) => {
    document.getElementById("backend-message").textContent = data.message;
  })
  .catch(() => {
    document.getElementById("backend-message").textContent =
      "Failed to fetch backend message.";
  });
```

### **Step 3️: Create Dockerfile for Frontend**
```
# frontend/Dockerfile
FROM nginx:alpine
COPY . /usr/share/nginx/html
```

<img width="1434" alt="Screenshot 2025-04-05 at 14 27 47" src="https://github.com/user-attachments/assets/ac5933a7-4374-4946-9b7d-a9d2cc700790" />


### **Step 4️: Build & Run Frontend Container**

```
docker build -t docker-frontend .
docker run -d -p 88:80 --name frontend-container docker-frontend
```
<img width="1472" alt="Screenshot 2025-04-05 at 14 29 01" src="https://github.com/user-attachments/assets/c8ee9165-3996-4cc3-aeb1-ae4109ec0fdf" />

<img width="1378" alt="Screenshot 2025-04-05 at 14 29 32" src="https://github.com/user-attachments/assets/472b342c-6cfc-42ab-a090-073d09b38ffb" />


Visit http://localhost:88 in your browser.

You’ll see your styled landing page. The backend message will show "Failed..." until we set up the backend.

<img width="1678" alt="Screenshot 2025-04-05 at 14 30 19" src="https://github.com/user-attachments/assets/45e40fa9-6034-4874-b45c-3f4a051ed8e8" />

## PART 2: Backend Setup (Node.js API)
### **Step 1️: Create Backend Directory**

```
cd ..
mkdir backend
cd backend
```
<img width="1111" alt="Screenshot 2025-04-05 at 14 32 23" src="https://github.com/user-attachments/assets/054c88c1-2081-4cce-9ec3-e5d7b44c486c" />

### **Step 2️: Create server.js**

```
const express = require("express");
const app = express();
const PORT = 5000;

app.get("/hello", (req, res) => {
  res.json({ message: "Hello from the backend! 👋" });
});

app.listen(PORT, () => {
  console.log(`Backend is running on port ${PORT}`);
});
```
### **Step 3️: Create Dockerfile for Backend**

```
# backend/Dockerfile
FROM node:alpine
WORKDIR /app
COPY server.js .
RUN npm init -y && npm install express
EXPOSE 5000
CMD ["node", "server.js"]
```


### **Step 4️: Build & Run Backend Container**

```
docker build -t docker-backend .
docker run -d -p 3000:5000 --name backend-container docker-backend
```
<img width="1377" alt="Screenshot 2025-04-05 at 14 37 14" src="https://github.com/user-attachments/assets/8ab9afeb-48ab-4f93-8e00-e0d1908d85a6" />

<img width="1371" alt="Screenshot 2025-04-05 at 14 39 27" src="https://github.com/user-attachments/assets/30e49564-8806-472c-b808-b20b269dec5a" />

**To test:**

```
curl http://localhost:3000/hello
```

**Output:**

```
{ "message": "Hello from the backend! 👋" }
```
<img width="916" alt="Screenshot 2025-04-05 at 14 40 44" src="https://github.com/user-attachments/assets/84b7618e-75f7-4c05-baff-92affdb09fb8" />

## PART 3: Docker Compose
Now that both services work, we’ll combine them using Docker Compose.

### **Step 1️: Create docker-compose.yml in project root**

```
version: "3"
services:
  frontend:
    build: ./frontend
    ports:
      - "88:80"
    depends_on:
      - backend

  backend:
    build: ./backend
    ports:
      - "3000:5000"
```
<img width="1308" alt="Screenshot 2025-04-05 at 14 44 25" src="https://github.com/user-attachments/assets/dde2a3d0-9665-4a12-9342-580f533e9513" />

- **depends_on** ensures backend starts first

- Containers can communicate internally via service name **(backend)**

### **Step 2️: Run Docker Compose**
From project root:

```
docker-compose up --build
```

<img width="1372" alt="Screenshot 2025-04-05 at 14 46 34" src="https://github.com/user-attachments/assets/11980403-7ade-4538-896f-4913c2f3abb3" />

