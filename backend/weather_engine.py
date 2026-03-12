import requests

def coordinates(city):
    url =f"https://geocoding-api.open-meteo.com/v1/search?name={city}"
    responce=requests.get(url)
    data = responce.json()

    if "results" not in data:
        return None
    
    latitude = data["results"][0]["latitude"]
    longitude = data["results"][0]["longitude"]
    
    return latitude, longitude

def weather(latitude, longitude):
    url=f"https://api.open-meteo.com/v1/forecast?latitude={latitude}&longitude={longitude}&current_weather=true"
    responce=requests.get(url)
    data=responce.json()
    temp= data["current_weather"]["temperature"]
    wind= data["current_weather"]["windspeed"]

    return temp,wind


def get_weather(city):

    coords = coordinates(city)

    if coords is None:
        return None

    latitude, longitude = coords

    temperature, wind = weather(latitude, longitude)

    return {
        "city": city,
        "temperature": temperature,
        "wind_speed": wind
    }


if __name__ == "__main__":

    city = input("Enter city: ")

    weather = get_weather(city)

    if weather is None:
        print("City not found")
    else:
        print("\n------ WEATHER REPORT ------")
        print("City:", weather["city"])
        print("Temperature:", weather["temperature"], "°C")
        print("Wind Speed:", weather["wind_speed"], "km/h")