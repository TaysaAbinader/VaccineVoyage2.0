import json

from flask import Flask,  Response
from flask_cors import CORS
from classes.class_game import Game

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "http://localhost:63342"}})

@app.route('/game_start/<disease_name>')
def game_start(disease_name):
    try:
        game = Game(disease_name)
        #call the function to generate 7 random countries & the hints for each country
        game.ingredient_country()
        game_info = {
            "disease name": game.disease_name,
            "first infected": game.first_country,
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

@app.route('/get_hint/<game_info>/<level>', endpoint='get_hint')
def point_level(game_info,level):
    class_game = game_info[0]
    point_difference = class_game.points_per_level(level)
    return point_difference

def get_hint(game_info,level):
    try:
        this_level = game_info["countries"][level-1]
        hint_list = this_level["hints"]
        json_response = json.dumps(hint_list)
        http_response = Response(json_response, status = 200,mimetype='application/json')
        return http_response

    except ValueError:
        response = {
            "response": "Invalid input",
            "status": 400,
        }
        http_response = Response(response=json.dumps(response, indent=2), status=400, mimetype='application/json')
        return http_response

@app.route('/answer_is_correct/<game_info>/<level>/<guess>', endpoint='answer_is_correct')
def point_level(game_info,level):
    class_game = game_info[0]
    point_difference = class_game.points_per_level(level)
    return point_difference

def answer_is_correct(game_info,level,guess):
    try:
        class_game = game_info[0]
        if guess.upper() == game_info[level]["name"]:
            #class_game.points += point_level(game_info,level)
            class_game.current_level += 1
            response = {
                "response": "Correct",

            }
        else:
            #class_game.points += point_level(game_info, level)
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



@app.route('/multiple_choice/<game_info>/<level>', endpoint='multiple_choice')
def point_level(game_info,level):
    class_game = game_info[0]
    point_difference = class_game.points_per_level(level)
    return point_difference

def multiple_choice(game_info,level):
    try:
        game_class = game_info[0]
        #game_class.points += point_level(game_info, level)
        response = [game_class["points"]]
        for choice in game_class.multiple_choice(game_info[level]["name"]):
            response.append(choice)
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

@app.route('/cal_points/<game_info>/<operation>/<points_dif>')
def point_operation(game_info,operation,points_dif):
    try:
        game_class = game_info[0]
        if operation == "add":
            game_class.points += points_dif
        elif operation == "minus":
            game_class.points -= points_dif
        response = {
            "points": game_class.points,
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
