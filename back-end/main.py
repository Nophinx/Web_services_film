# -*- coding: utf-8 -*-
from flask import Flask
from flask_cors import CORS, cross_origin
import mysql.connector
app = Flask(__name__)
cors = CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'
import json
import requests

mydb = mysql.connector.connect(
  host="localhost",
  user="mathis",
  password="mathis",
  database="film_api"
)

#test
f = open("api.key", "r")
API_KEY = f.read()


mycursor = mydb.cursor()

def get_likes(id):
    result = []
    mycursor.execute("SELECT id_film FROM likes where id_client = 1")
    myresult = mycursor.fetchall()

    for x in myresult:
        result.append(x[0])

    print("get favorites of id "+str(id))

    return result

@app.route("/discover/<id>")
def discover(id):
    result = {}
    url = f"https://api.themoviedb.org/3/discover/movie?sort_by=popularity.desc&api_key={API_KEY}"
    result = requests.request("GET", url).json()
    result["likes"] = get_likes(id)

    return json.dumps(result)
@app.route("/movie/<query>")
def movie(query):
    result = {} 
    url = f"https://api.themoviedb.org/3/search/movie?api_key={API_KEY}&query={query}"
    result = requests.request("GET", url).json()
    return json.dumps(result)
    
@app.route("/category/<name>")
def category(name):
    result = {} 
    #https://api.themoviedb.org/3/discover/movie?sort_by=popularity.desc&with_genres={name}&api_key={API_KEY}
    url = f"https://api.themoviedb.org/3/discover/movie?sort_by=popularity.desc&with_genres={name}&api_key={API_KEY}"
    result = requests.request("GET", url).json()
    return json.dumps(result)
    

    
if __name__ == "__main__":
    app.run(debug=True)