import databutton as db
import asyncpg
import os
from app.env import mode, Mode

async def get_db_connection():
    # Check if DB_LOCAL environment variable is set to True
    db_local = os.environ.get("DB_LOCAL", "").lower() == "true"
    
    if db_local:
        # Use local PostgreSQL database
        db_url = "postgresql://prompt_craft_user:prompt_craft_password@postgres:5432/prompt_craft"
        print(f"Using local database: {db_url}")
    elif mode == Mode.PROD:
        db_url = db.secrets.get("DATABASE_URL_ADMIN_PROD")
        print("Using production database")
    else:
        db_url = db.secrets.get("DATABASE_URL_ADMIN_DEV")
        print("Using development database")
    
    conn = await asyncpg.connect(db_url)
    return conn
