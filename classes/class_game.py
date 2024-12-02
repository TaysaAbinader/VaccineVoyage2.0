from classes.class_country import Country
from classes.class_game_movement import GameMovement
from backend.databaseconnection import connection
import random

#inherit functions
class Game(GameMovement):
    list_first_countries = ["Finland", "Cambodia", "Canada", "Peru", "Croatia", "South Africa", "Dubai"]

    def __init__(self,disease_name,points = 300):
        self.disease_name = disease_name
        self.points = points
        self.country_list = []
        self.current_level = 1
        self.correct_guess = []
        self.level_over = "No"
        self.game_over = "No"
        self.first_country = random.choice(Game.list_first_countries)
        super().__init__(self.current_level)

    #generate 7 countries for the game + create a class for it through Country()
    def ingredient_country(self):
        sql = f"select name from countries where name != 'No country' order by rand() limit 7 "
        cursor = connection.cursor()
        cursor.execute(sql)
        result = cursor.fetchall()
        if cursor.rowcount > 0:
            level = 1
            for row in result:
                country = Country(row[0],level)
                country.retrieve_hints(row[0],level)
                self.country_list.append(country)
                level += 1
        return self.country_list

    def calculate_points(self):
        self.points += 100
        return self.points

    def answer_is_correct(self,guess_input):
        if guess_input == self.country_list[self.current_level - 1].name:
            self.current_level += 1
            self.correct_guess.append(guess_input)
            self.points += self.point_per_level()
            print(f'Points: {self.points}')
            print(f'Correct guess: {self.correct_guess}')
            print("Your guess is correct - Congratulations, let's go!")
            self.level_over = "Yes"
            return self.points
        else:
            if self.points >= 0:
                print("Your guess is incorrect, try again!")
                self.points -= self.point_per_level()
                print(f'Points: {self.points}')
            else:
                self.game_over = "Yes"
            return self.points, self.game_over

    def randomize_countries(self,list_of_choices):
        new_list = list_of_choices
        if len(new_list) > 4:
            random.shuffle(new_list)
            result = new_list[:3]
        if len(new_list) <= 4:
            random.shuffle(new_list)
            result = new_list
        return result

    def multiple_choice(self):
        if self.points >= 0:
            self.points -= self.point_per_level()*1.5
            print('Points: ', self.points)
            sql = f"select name from countries where name != '{self.country_list[self.current_level - 1]}';"
            listed_countries = []
            multiple_options = [self.country_list[self.current_level - 1].name]
            cursor_count = connection.cursor()
            cursor_count.execute(sql)
            result = cursor_count.fetchall()
            if cursor_count.rowcount > 0:
                for row in result:
                    listed_countries.append(row[0])
            listed_countries1 = self.randomize_countries(listed_countries)
            for i in listed_countries1:
                multiple_options.append(i)
            return self.randomize_countries(multiple_options)
            #print('The ingredient may be in one of these countries: ', self.randomize_countries(multiple_options))
        else:
            self.game_over = "Yes"
            return self.game_over

    def point_per_level(self):
        sql_point = f"select hints.points from hints where hints.level = '{self.current_level}' limit 1;"
        # create a cursor_hint to calculate point countries
        cursor_point = connection.cursor()
        cursor_point.execute(sql_point)
        result_point = cursor_point.fetchall()
        point_level = 0
        if cursor_point.rowcount > 0:
            for point_row in result_point:
                point_level = point_row[0]
        return point_level

    def is_lost(self):
        if self.points >= 0:
            self.game_over = "No"
            return self.game_over
        else:
            self.game_over = "Yes"
            return self.game_over

    def insert_session(self):
        sql_session = f"insert into disease(disease_name, visited_countries,level) values '{self.disease_name}','{self.correct_guess}', '{self.current_level}');"
        cursor_session = connection.cursor()
        cursor_session.execute(sql_session)
        return

    def new_hint(self, hint_list,current_hint_no):
        if self.points >=0:
            super().new_hint(hint_list, current_hint_no)

            self.points -= self.point_per_level()
            print(f'Points: {self.points}')
        else:
            self.points -= self.point_per_level()
            self.game_over = "Yes"
        return self.points, self.game_over


    def guess (self):
        super().guess()

    def quit (self):
        super().quit()


    def decision (self,action, hint_list,current_hint_no):
        if action == "NEW HINT":
            self.new_hint(hint_list,current_hint_no)
        elif action == "GUESS":
            guess_input = super().guess()
            self.answer_is_correct(guess_input)
        elif action == "QUIT":
            self.quit()


