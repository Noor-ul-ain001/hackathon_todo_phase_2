import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from src.api.routes import tasks, auth
from src.database.connection import create_db_and_tables

app = FastAPI(
    title="Agentic Todo API",
    description="REST API for multi-user task management",
    version="1.0.0"
)

# CORS configuration - allow Vercel frontend and localhost
allowed_origins = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
]

# Add Vercel frontend URL from environment if set
vercel_url = os.getenv("FRONTEND_URL", "")
if vercel_url:
    allowed_origins.append(vercel_url)

# Also allow all vercel.app subdomains for preview deployments
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["*"],
)

# Include routers
app.include_router(auth.router)
app.include_router(tasks.router)

@app.on_event("startup")
def on_startup():
    create_db_and_tables()

@app.get("/")
def read_root():
    return {"message": "Agentic Todo API - Phase 2"}

@app.get("/health")
def health_check():
    return {"status": "healthy"}
