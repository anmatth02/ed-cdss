from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .database import Base, engine
from .routers import cases

app = FastAPI()

origins = [
    "http://localhost:5173",
    "https://ed-cdss.vercel.app",
    "https://ed-cdss-3iikypohd-anmatth02s-projects.vercel.app",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

Base.metadata.create_all(bind=engine)

app.include_router(
    cases.router,
    prefix="/cases",
    tags=["Cases"]
)