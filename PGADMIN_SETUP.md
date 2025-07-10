# pgAdmin Setup Guide

## Starting the Services

To start all services including pgAdmin:

```bash
docker-compose up -d
```

## Accessing pgAdmin

1. Open your browser and go to: `http://localhost:8080`
2. Login with:
   - **Email**: `admin@admin.com`
   - **Password**: `admin`

## Connecting to PostgreSQL Database

Once logged into pgAdmin:

1. **Right-click** on "Servers" in the left panel
2. Select **"Create" > "Server..."**
3. Fill in the connection details:

### General Tab:
- **Name**: `Prompt Craft DB` (or any name you prefer)

### Connection Tab:
- **Host name/address**: `postgres`
- **Port**: `5432`
- **Maintenance database**: `prompt_craft`
- **Username**: `prompt_craft_user`
- **Password**: `prompt_craft_password`

4. Click **"Save"** to establish the connection

## Database Details

Your PostgreSQL database configuration:
- **Database**: `prompt_craft`
- **User**: `prompt_craft_user`
- **Password**: `prompt_craft_password`
- **Host**: `postgres` (within Docker network) or `localhost` (from host machine)
- **Port**: `5432`

## Useful Tips

- The database data is persisted in the `postgres_data` Docker volume
- pgAdmin settings are persisted in the `pgadmin_data` Docker volume
- Both services will start automatically when you run `docker-compose up`
- To stop all services: `docker-compose down`
- To view logs: `docker-compose logs pgadmin` or `docker-compose logs postgres`

## Security Note

For production use, make sure to:
- Change the default pgAdmin password
- Use environment variables for sensitive data
- Configure proper network security 