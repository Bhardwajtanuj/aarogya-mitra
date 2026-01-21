# 🐳 Docker Deployment Guide - Aarogya Mitra

This guide explains how to run the Aarogya Mitra e-Healthcare Management System using Docker, making it portable across any platform.

## 📋 Table of Contents

- [Prerequisites](#prerequisites)
- [Quick Start](#quick-start)
- [Configuration](#configuration)
- [Building and Running](#building-and-running)
- [Development Mode](#development-mode)
- [Production Deployment](#production-deployment)
- [Troubleshooting](#troubleshooting)
- [Docker Commands Reference](#docker-commands-reference)

## 🔧 Prerequisites

Before you begin, ensure you have the following installed:

- **Docker** (version 20.10 or higher)
  - [Install Docker Desktop](https://www.docker.com/products/docker-desktop) (Windows/Mac)
  - [Install Docker Engine](https://docs.docker.com/engine/install/) (Linux)
- **Docker Compose** (version 2.0 or higher - included with Docker Desktop)

Verify installation:
```bash
docker --version
docker-compose --version
```

## 🚀 Quick Start

Get the application running in 3 simple steps:

### 1. Clone and Navigate
```bash
cd aarogya-mitra
```

### 2. Configure Environment
```bash
# Copy the environment template
cp .env.docker .env

# Edit .env and add your credentials
# Required: JWT_SECRET, CLOUDINARY credentials
```

### 3. Start All Services
```bash
docker-compose up -d
```

That's it! The application will be available at:
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000
- **ML Service**: http://localhost:5001
- **MongoDB**: localhost:27017

## ⚙️ Configuration

### Environment Variables

Edit the `.env` file with your actual values:

```env
# JWT Configuration (REQUIRED)
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production

# Cloudinary Configuration (REQUIRED for file uploads)
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

# Frontend API URL (optional, defaults to http://localhost:5000/api)
VITE_API_URL=http://localhost:5000/api
```

#### Getting Cloudinary Credentials

1. Sign up for a free account at [Cloudinary](https://cloudinary.com/)
2. Go to Dashboard
3. Copy your Cloud Name, API Key, and API Secret
4. Paste them into the `.env` file

### Port Configuration

Default ports used by services:

| Service    | Port | Can be changed in |
|------------|------|-------------------|
| Frontend   | 3000 | `docker-compose.yml` |
| Backend    | 5000 | `docker-compose.yml` |
| ML Service | 5001 | `docker-compose.yml` |
| MongoDB    | 27017| `docker-compose.yml` |

To change ports, edit `docker-compose.yml`:
```yaml
services:
  frontend:
    ports:
      - "8080:80"  # Change 8080 to your desired port
```

## 🏗️ Building and Running

### Build All Services
```bash
# Build all Docker images
docker-compose build

# Build a specific service
docker-compose build backend
docker-compose build frontend
docker-compose build ml-service
```

### Start Services
```bash
# Start all services in detached mode (background)
docker-compose up -d

# Start all services with logs visible
docker-compose up

# Start specific services
docker-compose up -d backend ml-service
```

### Stop Services
```bash
# Stop all services
docker-compose down

# Stop and remove volumes (WARNING: deletes database data)
docker-compose down -v

# Stop a specific service
docker-compose stop backend
```

### View Logs
```bash
# View logs from all services
docker-compose logs

# Follow logs in real-time
docker-compose logs -f

# View logs for a specific service
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f ml-service
```

### Check Service Status
```bash
# List running containers
docker-compose ps

# Check health status
docker-compose ps
```

## 💻 Development Mode

For active development with hot-reload:

### Option 1: Use Docker Compose Override

Create `docker-compose.override.yml`:
```yaml
version: '3.8'

services:
  backend:
    volumes:
      - ./backend:/app
      - /app/node_modules
    environment:
      - NODE_ENV=development
    command: npm run dev

  frontend:
    build:
      target: build
    volumes:
      - ./frontend:/app
      - /app/node_modules
    command: npm run dev
    ports:
      - "5173:5173"

  ml-service:
    volumes:
      - ./ml-service:/app
    environment:
      - FLASK_ENV=development
      - FLASK_DEBUG=1
```

Then run:
```bash
docker-compose up
```

### Option 2: Run Services Individually

Run only MongoDB in Docker:
```bash
docker-compose up -d mongodb
```

Run other services locally:
```bash
# Terminal 1 - Backend
cd backend
npm install
npm run dev

# Terminal 2 - Frontend
cd frontend
npm install
npm run dev

# Terminal 3 - ML Service
cd ml-service
pip install -r requirements.txt
python app.py
```

## 🌐 Production Deployment

### Build for Production
```bash
# Build optimized images
docker-compose build --no-cache

# Tag images for registry
docker tag aarogya-frontend:latest your-registry/aarogya-frontend:v1.0.0
docker tag aarogya-backend:latest your-registry/aarogya-backend:v1.0.0
docker tag aarogya-ml-service:latest your-registry/aarogya-ml-service:v1.0.0
```

### Security Best Practices

1. **Use Strong Secrets**
   ```bash
   # Generate a strong JWT secret
   openssl rand -base64 32
   ```

2. **Enable MongoDB Authentication**
   
   Uncomment in `.env`:
   ```env
   MONGO_INITDB_ROOT_USERNAME=admin
   MONGO_INITDB_ROOT_PASSWORD=your_secure_password
   ```
   
   Update `docker-compose.yml`:
   ```yaml
   mongodb:
     environment:
       MONGO_INITDB_ROOT_USERNAME: ${MONGO_INITDB_ROOT_USERNAME}
       MONGO_INITDB_ROOT_PASSWORD: ${MONGO_INITDB_ROOT_PASSWORD}
   
   backend:
     environment:
       MONGODB_URI: mongodb://${MONGO_INITDB_ROOT_USERNAME}:${MONGO_INITDB_ROOT_PASSWORD}@mongodb:27017/aarogya-mitra?authSource=admin
   ```

3. **Use HTTPS**
   - Set up a reverse proxy (nginx, Traefik, Caddy)
   - Obtain SSL certificates (Let's Encrypt)
   - Configure HTTPS redirects

4. **Limit Resource Usage**
   
   Add to `docker-compose.yml`:
   ```yaml
   services:
     backend:
       deploy:
         resources:
           limits:
             cpus: '1'
             memory: 512M
           reservations:
             cpus: '0.5'
             memory: 256M
   ```

### Backup and Restore

#### Backup MongoDB Data
```bash
# Create backup
docker-compose exec mongodb mongodump --out /data/backup

# Copy backup to host
docker cp aarogya-mongodb:/data/backup ./mongodb-backup
```

#### Restore MongoDB Data
```bash
# Copy backup to container
docker cp ./mongodb-backup aarogya-mongodb:/data/restore

# Restore data
docker-compose exec mongodb mongorestore /data/restore
```

## 🔍 Troubleshooting

### Common Issues

#### 1. Port Already in Use
```bash
# Error: Bind for 0.0.0.0:5000 failed: port is already allocated

# Solution: Find and stop the process using the port
# Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Linux/Mac
lsof -i :5000
kill -9 <PID>

# Or change the port in docker-compose.yml
```

#### 2. MongoDB Connection Failed
```bash
# Check if MongoDB is running
docker-compose ps mongodb

# Check MongoDB logs
docker-compose logs mongodb

# Restart MongoDB
docker-compose restart mongodb
```

#### 3. Frontend Shows API Error
```bash
# Check backend is running
docker-compose ps backend

# Check backend logs
docker-compose logs backend

# Verify API URL in frontend
# Should match backend service URL
```

#### 4. ML Service Not Responding
```bash
# Check ML service logs
docker-compose logs ml-service

# Verify model files exist
docker-compose exec ml-service ls -la /app/model

# Restart ML service
docker-compose restart ml-service
```

#### 5. Out of Disk Space
```bash
# Remove unused Docker resources
docker system prune -a

# Remove specific volumes
docker volume ls
docker volume rm <volume_name>
```

#### 6. Build Fails
```bash
# Clear Docker cache and rebuild
docker-compose build --no-cache

# Remove all containers and rebuild
docker-compose down
docker-compose up --build
```

### Health Checks

Check if services are healthy:
```bash
# Backend health
curl http://localhost:5000/health

# Frontend health
curl http://localhost:3000/health

# ML Service health
curl http://localhost:5001/health

# MongoDB health
docker-compose exec mongodb mongosh --eval "db.adminCommand('ping')"
```

### Accessing Container Shell

Debug inside containers:
```bash
# Backend container
docker-compose exec backend sh

# Frontend container
docker-compose exec frontend sh

# ML Service container
docker-compose exec ml-service bash

# MongoDB container
docker-compose exec mongodb mongosh
```

## 📚 Docker Commands Reference

### Container Management
```bash
# List all containers
docker ps -a

# Remove a container
docker rm <container_id>

# Remove all stopped containers
docker container prune
```

### Image Management
```bash
# List all images
docker images

# Remove an image
docker rmi <image_id>

# Remove unused images
docker image prune -a
```

### Volume Management
```bash
# List volumes
docker volume ls

# Inspect a volume
docker volume inspect <volume_name>

# Remove a volume
docker volume rm <volume_name>

# Remove all unused volumes
docker volume prune
```

### Network Management
```bash
# List networks
docker network ls

# Inspect network
docker network inspect aarogya-network

# Remove network
docker network rm <network_name>
```

### System Cleanup
```bash
# Remove all unused resources
docker system prune -a --volumes

# Show disk usage
docker system df
```

## 🎯 Next Steps

After successful deployment:

1. **Access the Application**: Open http://localhost:3000
2. **Create Admin User**: Register first user as admin
3. **Add Doctors**: Create doctor profiles
4. **Test Features**: Book appointments, upload reports, try ML predictions
5. **Monitor Logs**: Keep an eye on service logs for any issues

## 📞 Support

For issues or questions:
- Check the [main README](README.md) for application details
- Review [troubleshooting](#troubleshooting) section
- Check Docker logs: `docker-compose logs -f`

## 📄 License

This project is licensed under the MIT License.

---

**Note**: This Docker setup is production-ready but ensure you follow security best practices, especially for healthcare applications. Consider compliance with regulations like HIPAA if deploying in a healthcare environment.
