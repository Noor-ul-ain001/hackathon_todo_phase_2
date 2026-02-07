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

# CORS configuration for frontend-backend communication
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://localhost:3001",
        "http://127.0.0.1:3001",
        "http://localhost:3002",
        "http://127.0.0.1:3002",
        "https://frontend-ten-theta-kem1gh6di0.vercel.app",
        os.getenv("FRONTEND_URL", ""),
    ],
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
