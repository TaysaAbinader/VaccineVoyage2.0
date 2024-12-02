import random
from backend.databaseconnection import connection


#transferred to class
def retrieve_hints(selected_country, current_level):
    #SQL query to retrieve 6 hints correlating to the selected country, randomly ordered
    sql_hint= (f"select hints.description from hints inner join countries on countries.country_id = hints.country_id where countries.name = '{selected_country}' and  hints.level = '{current_level}' order by rand();")
    #create a cursor_hint to collect countries
    cursor_hint= connection.cursor()
    cursor_hint.execute(sql_hint)
    result_hint = cursor_hint.fetchall()
    #Assign the 6 random hints into 6 variables
    hint_list = []
    if cursor_hint.rowcount > 0:
        for hint_row in result_hint:
            hint_list.append(hint_row[0])
    return hint_list



def insert_data_disease_table(names, country, cursor):
    sql1 = f"insert into vaccine_voyage.disease (disease_name, visited_country) values ('{names}', '{country}')"
    return cursor.execute(sql1)

#transferred to class
def ingredient_country():
    sql = f"Select name from countries where name != 'No country' order by rand() limit 7 "
    cursor = connection.cursor()
    cursor.execute(sql)
    result = cursor.fetchall()
    list_country =[]
    if cursor.rowcount >0 :
        for row in result:
            list_country.append(row[0])
    return list_country

#transferred to class
def point_per_level(current_level):
    sql_point = f"select hints.points from hints where hints.level = '{current_level}' limit 1;"
    # create a cursor_hint to calculate point countries
    cursor_point = connection.cursor()
    cursor_point.execute(sql_point)
    result_point = cursor_point.fetchall()
    point_level = 0
    if cursor_point.rowcount >0 :
        for point_row in result_point:
            point_level = point_row[0]
    return point_level
#transferred to class
def randomize_countries(countries):
    new_list = countries
    if len(new_list) > 4:
        random.shuffle(new_list)
        result = new_list[:3]
    if len(new_list) <= 4:
        random.shuffle(new_list)
        result = new_list
    return result


#transferred to class
def multiple_choice (right_country):
    sql = f"select name from countries where name != '{right_country}';"
    listed_countries = []
    multiple_options = [right_country]
    cursor_count = connection.cursor()
    cursor_count.execute(sql)
    result = cursor_count.fetchall()
    if cursor_count.rowcount > 0:
        for row in result:
            listed_countries.append(row[0])
        listed_countries1 = randomize_countries(listed_countries)
        for i in listed_countries1:
            multiple_options.append(i)
    return randomize_countries(multiple_options)
    #print('The ingredient may be in one of these countries: ',randomize_countries(multiple_options))

def insert_session(disease_name,visited_countries, current_level):
    sql_session = f"insert into disease(disease_name, visited_countries,level) values ('{disease_name}',(select country_id from countries where name = '{visited_countries}'), '{current_level}');"
    cursor_session = connection.cursor()
    cursor_session.execute(sql_session)
    return





"""
    country1 = ["Peru", "Germany", "Nepal", "New Zealand", "Gana", "Algeria", "Cyprus"]
    country2 = ["Chile", "Armenia", "Bangladesh", "Denmark", "Guatemala", "Jamaica", "Malaysia"]
    country3 = ["Mauritius", "Namibia", "Netherlands", "Norway", "Philippines", "Romania", "Uruguay"]
    country4 = final_country_list[game_level]
    print1 = (f"This ingredient is in: - {random.choice(country1)}, - {random.choice(country2)}, - {random.choice(country3)},"
           f" - {country4}")
    print2 = (f"This ingredient is in: - {random.choice(country2)}, - {country4}, - {random.choice(country1)},"
           f" - {random.choice(country3)}")
    print3 = (f"This ingredient is in: - {random.choice(country3)}, - {random.choice(country1)}, - {country4},"
           f" - {random.choice(country2)}")
    print4 = (f"This ingredient is in: - {country4}, - {random.choice(country3)}, - {random.choice(country2)},"
           f" - {random.choice(country1)}")
    print_list = [print1, print2, print3, print4]
    options = random.choice(print_list)
    answers = input("Where is it?")
    for answer in answers:
        if answer == country4:
            answer == True
            right_answers.append(answers)
        else:
            answer == False
            wrong_answers.append(answers)

"""

