# API Testing Guide

This guide will help you test all API endpoints in your Blog project.

## Prerequisites

1. **MongoDB Connection**: Ensure `MONGODB_URI` is set in your `.env` file
2. **Development Server**: The Next.js server must be running

## Quick Start

### 1. Start the Development Server

```powershell
npm run dev
```

The server should start at `http://localhost:3000`

### 2. Run the Test Script

```powershell
.\test-apis.ps1
```

## Available Endpoints

### ✅ Currently Implemented

#### Health Check
- **GET** `/api/health`
- Tests server connectivity

#### Posts CRUD
- **GET** `/api/posts` - Get all posts (with optional filters)
  - Query params: `tag`, `status`, `source`, `readTimeMinutes`, `createdAt`
- **POST** `/api/posts` - Create a new post
- **PUT** `/api/posts/[id]` - Update a post
- **DELETE** `/api/posts/[id]` - Delete a post

### ⚠️ Planned (Not Yet Implemented)

These integration endpoints are defined in your Postman collection but not implemented:

- **POST** `/api/integrations/linkedin` - LinkedIn sharing
- **POST** `/api/integrations/reddit` - Reddit posting  
- **POST** `/api/integrations/patreon` - Patreon content
- **POST** `/api/integrations/twitter` - Twitter posting (disabled due to cost)

## Environment Variables

Check your `.env` file for these variables:

```bash
# Required
MONGODB_URI=your_mongodb_connection_string
DATABASE_URL=your_mongodb_connection_string

# Optional (for integrations)
PATREON_ACCESS_TOKEN=
PATREON_CAMPAIGN_ID=
REDDIT_CLIENT_ID=
REDDIT_CLIENT_SECRET=
REDDIT_USER_AGENT=
LINKEDIN_ACCESS_TOKEN=
TWITTER_BEARER_TOKEN=
```

## MongoDB Connection Test

To specifically test MongoDB connectivity:

```powershell
# Quick test - just check health endpoint
Invoke-WebRequest -Uri "http://localhost:3000/api/health" | Select-Object -ExpandProperty Content | ConvertFrom-Json
```

## Manual Testing with curl/Invoke-WebRequest

### Create a Post
```powershell
$body = @{
    title = "Test Post"
    content = "Content here"
    excerpt = "Excerpt"
    tags = @("tech", "blog")
    readTimeMinutes = 5
    source = "manual"
    status = "draft"
} | ConvertTo-Json

Invoke-WebRequest -Uri "http://localhost:3000/api/posts" -Method POST -Body $body -ContentType "application/json"
```

### Get All Posts
```powershell
Invoke-WebRequest -Uri "http://localhost:3000/api/posts?status=all" | Select-Object -ExpandProperty Content
```

## Postman Collection

A Postman collection is available at:
```
postman/collections/Next.js + Prisma + MongoDB - Local Testing.postman_collection.json
```

Import this into Postman for a full testing suite.

## Troubleshooting

### Server Not Running
```
Error: Server is not running at http://localhost:3000
```
**Solution**: Start the dev server with `npm run dev`

### MongoDB Connection Failed
```
Error: Missing MONGODB_URI environment variable
```
**Solution**: Add `MONGODB_URI` to your `.env` file

### Port Already in Use
```
Error: Port 3000 is already in use
```
**Solution**: Kill the process or change the port in `package.json`

## Next Steps

To implement the missing integration endpoints, create route files:
- `src/app/api/integrations/linkedin/route.ts`
- `src/app/api/integrations/reddit/route.ts`
- `src/app/api/integrations/patreon/route.ts`
- `src/app/api/integrations/twitter/route.ts`

Each should follow the pattern in your existing Postman collection with mock mode support.
