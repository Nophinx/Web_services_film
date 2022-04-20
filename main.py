# -*- coding: utf-8 -*-
from flask import Flask
from flask_cors import CORS, cross_origin

app = Flask(__name__)
cors = CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'
import json
import requests

API_KEY = ""
ID_USER = 1

@app.route("/discover")
def api():
    result = {}
    url = f"https://api.themoviedb.org/3/discover/movie?sort_by=popularity.desc&api_key={API_KEY}"

    result = requests.request("GET", url).json()
    result["likes"] = [35265, 65155, 65458]


    return json.dumps(result)
    
if __name__ == "__main__":
    app.run(debug=True)