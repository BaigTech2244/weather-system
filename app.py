from flask import Flask, render_template, request, jsonify
import requests

app = Flask(__name__)

# 🔑 Your Weather API Key from OpenWeatherMap
API_KEY = "7fb487098d6bab1b3dfabe191ef3a70a"

# 🌐 Weather API URL
API_URL = "https://api.openweathermap.org/data/2.5/weather"


@app.route("/")
def home():
    return render_template("index.html")


@app.route("/weather")
def get_weather():

    # city coming from frontend
    city = request.args.get("city")

    # 🔗 Full API request
    url = f"{API_URL}?q={city}&appid={API_KEY}&units=metric"

    # request to weather API
    response = requests.get(url)

    # convert API response to JSON
    data = response.json()

    if response.status_code != 200:
        return jsonify({"error": data.get("message", "City not found")}), response.status_code

    # extract useful information
    result = {
        "city": data["name"],
        "country": data["sys"]["country"],
        "temperature": data["main"]["temp"],
        "feelsLike": data["main"]["feels_like"],
        "humidity": data["main"]["humidity"],
        "windSpeed": round(data["wind"]["speed"] * 3.6, 1), # Convert m/s to km/h
        "description": data["weather"][0]["description"],
        "icon": data["weather"][0]["icon"]
    }

    # send data to frontend
    return jsonify(result)


if __name__ == "__main__":
    app.run(debug=True)