import json

from databaseconnection import connection
from flask import Flask,  Response, request
from flask_cors import CORS
from classes.class_game import Game
import random

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "http://localhost:63342"}})


def randomize_countries(countries):
    new_list = countries
    if len(new_list) > 4:
        random.shuffle(new_list)
        result = new_list[:3]
    if len(new_list) <= 4:
        random.shuffle(new_list)
        result = new_list
    return result

@app.route('/game_start/<disease_name>')
def game_start(disease_name):
    try:
        game = Game(disease_name)
        #call the function to generate 7 random countries & the hints for each country
        game.ingredient_country()
        game_info = {
            "disease name": game.disease_name,
            "points": game.points,
            "countries": [],
            "current level": game.current_level,
            "correct guess": game.correct_guess,

        }
        response = [game_info]
        for country in game.country_list:
            info_country = {
                "name": country.name,
                "level": country.level,
                "hints": country.hint_list,
            }
            game_info["countries"].append(info_country)
        json_response = json.dumps(response)
        http_response = Response(json_response, status = 200,mimetype='application/json')
        return http_response
    except ValueError:
        response = {
            "response": "Invalid input",
            "status": 400,
        }
        http_response = Response(response=json.dumps(response, indent=2), status=400, mimetype='application/json')
        return http_response



@app.route('/answer_is_correct/<country>/<guess>', endpoint='answer_is_correct')
def answer_is_correct(country,guess):
    try:
        if guess.upper() == country:
            response = {
                "response": "Correct",
            }
        else:
            response = {
                "response": "Incorrect",
            }
        json_response = json.dumps(response)
        http_response = Response(json_response, status = 200,mimetype='application/json')
        return http_response

    except ValueError:
        response = {
            "response": "Invalid input",
            "status": 400,
        }
        http_response = Response(response=json.dumps(response, indent=2), status=400, mimetype='application/json')
        return http_response



@app.route('/multiple_choice/<country>', endpoint='multiple_choice')
def multiple_choice(country):
    try:
        multi_sql = f"select name from countries where name != '{country}';"
        listed_countries = []
        multiple_options = [country]
        cursor_count = connection.cursor()
        cursor_count.execute(multi_sql)
        result = cursor_count.fetchall()
        if cursor_count.rowcount > 0:
            for row in result:
                listed_countries.append(row[0])
            listed_countries1 = randomize_countries(listed_countries)
            for i in listed_countries1:
                multiple_options.append(i)
        response = randomize_countries(multiple_options)
        json_response = json.dumps(response)
        http_response = Response(json_response, status = 200,mimetype='application/json')
        return http_response
    except ValueError:
        response = {
            "response": "Invalid input",
            "status": 400,
        }
        http_response = Response(response=json.dumps(response, indent=2), status=400, mimetype='application/json')
        return http_response

@app.route('/fetchcoordinates/<country>')
def fetchcoordinates (country):
    mysql = f'select latitude, longitude from countries where name ="{country.upper()}"'
    cursor = connection.cursor()
    cursor.execute(mysql)
    result = cursor.fetchall()
    if cursor.rowcount > 0:
        for row in result:
            response = {
                "name": country,
                "latitude": row[0],
                "longitude": row[1]
            }
        json_response = json.dumps(response)
        http_response = Response(json_response, status= 200, mimetype="application/json")
        return http_response

@app.route('/save_game', methods = ['POST'])
def insert_session():
    data = request.get_json()
    disease_name = data.get('disease_name')
    visited_countries = data.get('visited_countries')
    current_level = data.get('current_level')

    try:

        sql_session = "INSERT INTO disease(disease_name, visited_countries, level) VALUES (%s, (select country_id from countries where name = %s), %s);"
        cursor_session = connection.cursor()
        cursor_session.execute(sql_session, (disease_name, visited_countries, current_level))
        response = {
            "message" : "Successfully saved",
            "status": 200
        }
        json_response = json.dumps(response)
        http_response = Response(json_response, status = 200, mimetype='application/json')
        return http_response
    except ValueError:
        response = {
            "response": "Invalid input",
            "status": 400,
        }
        http_response = Response(response=json.dumps(response, indent=2), status=400, mimetype='application/json')
        return http_response


@app.errorhandler(404)
def not_found(error):
    response = {
        "response": "Not Found",
        "status": 404,
    }
    json_response = json.dumps(response)
    http_response = Response(json_response, status = 404, mimetype='application/json')
    return http_response

if __name__ == '__main__':
    app.run(host='127.0.0.1', port=8000, debug=True)

