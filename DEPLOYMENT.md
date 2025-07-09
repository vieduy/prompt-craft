# Deployment Configuration Guide

## CORS Issue Resolution

The CORS error `Access to fetch at 'https://api.databutton.com/routes/lessons/categories' from origin 'https://platform.poc.vng.ai' has been blocked by CORS policy` occurs because:

1. The frontend is trying to make API requests to `https://api.databutton.com` (external service)
2. The external API server doesn't allow requests from your domain `https://platform.poc.vng.ai`

## Solution Applied

### 1. Backend CORS Configuration (✅ Fixed)

Added CORS middleware to `backend/main.py` to allow requests from your frontend domain:

```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",  # Local development
        "http://localhost:3000",  # Alternative local port
        "https://platform.poc.vng.ai",  # Production domain
        "http://platform.poc.vng.ai",   # HTTP fallback
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

### 2. Frontend API Configuration (✅ Fixed)

Updated `frontend/vite.config.ts` to properly configure API URLs for production:

- In development: Uses `http://localhost:8000`
- In production: Uses `https://platform.poc.vng.ai/api` (or environment variable `VITE_API_URL`)

### 3. Database Configuration (✅ Added)

Added support for local PostgreSQL database with `DB_LOCAL` environment variable:

- When `DB_LOCAL=true`: Uses `postgresql://prompt_craft_user:prompt_craft_password@postgres:5432/prompt_craft`
- When `DB_LOCAL=false` or not set: Uses the configured databutton secrets

## Environment Variables for Production

Set these environment variables when deploying:

```bash
# Frontend Environment Variables
VITE_API_URL=https://platform.poc.vng.ai/api
VITE_WS_API_URL=wss://platform.poc.vng.ai/ws

# Backend Environment Variables
DB_LOCAL=true  # Use local PostgreSQL database
DATABASE_URL_DEV=your_database_url  # Used when DB_LOCAL=false
# ... other backend env vars
```

## Local Development Database Setup

For local development with PostgreSQL:

1. **Set Environment Variable**:
   ```bash
   export DB_LOCAL=true
   ```

2. **Database Connection**:
   - Host: `postgres` (Docker service name)
   - Port: `5432`
   - Database: `prompt_craft`
   - Username: `prompt_craft_user`
   - Password: `prompt_craft_password`
   - Full URL: `postgresql://prompt_craft_user:prompt_craft_password@postgres:5432/prompt_craft`

3. **The backend will automatically**:
   - Detect `DB_LOCAL=true` environment variable
   - Use the local PostgreSQL connection instead of databutton secrets
   - Log which database is being used for debugging

## Deployment Steps

1. **Deploy Backend First**:
   - Ensure your backend is running on `https://platform.poc.vng.ai/api`
   - Set `DB_LOCAL=true` for local database or configure databutton secrets
   - Verify CORS headers are being sent

2. **Deploy Frontend**:
   - Set `VITE_API_URL=https://platform.poc.vng.ai/api`
   - Build and deploy frontend

3. **Verify**:
   - Check browser dev tools Network tab
   - Should see API requests going to your domain, not `api.databutton.com`
   - No CORS errors should appear

## Testing CORS Configuration

You can test CORS is working by checking the response headers:

```bash
curl -H "Origin: https://platform.poc.vng.ai" \
     -H "Access-Control-Request-Method: GET" \
     -H "Access-Control-Request-Headers: authorization" \
     -X OPTIONS \
     https://platform.poc.vng.ai/api/routes/lessons/categories
```

Should return headers like:
```
Access-Control-Allow-Origin: https://platform.poc.vng.ai
Access-Control-Allow-Methods: *
Access-Control-Allow-Headers: *
```

## Alternative Solutions

If you can't modify the backend CORS settings, you could:

1. **Proxy through your domain**: Set up a reverse proxy on your server
2. **Use a CORS proxy service**: Route requests through a CORS proxy (not recommended for production)
3. **Run frontend and backend on same domain**: Serve both from `platform.poc.vng.ai` 