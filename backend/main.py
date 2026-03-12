from fastapi import FastAPI
from weather_engine import get_weather 
from fastapi.middleware.cors import CORSMiddleware

app=FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/weather")
def weather(city: str):

    data = get_weather(city)

    if data is None:
        return {"error": "City not found"}

    return data