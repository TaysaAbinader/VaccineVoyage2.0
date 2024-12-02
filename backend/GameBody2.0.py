import random
from classes.class_game import Game

#Introduction
list_first_countries = ["Finland", "Cambodia", "Canada", "Peru", "Croatia", "South Africa", "Dubai"]
first_country = random.choice(list_first_countries)


game_rules = ("On Vaccine Voyage you are a researcher trying to find ingredients for a vaccine "
              "before the whole world is infected. You will do that by travelling around the world "
              "to find those ingredients. First name the disease you want to treat, then use the "
              "trivia tips to rightly guess the country where the ingredients are. You will start "
              "with 300 points, every mistake and new hint you ask will be debited from points. "
              "Good luck! We'll start now! Let's save the world together!\n")

print(game_rules)

print(f"The first infected country is {first_country}.\n")

disease_name = input("What disease are you going to treat? \n")

print(f"Now we start our journey to fight {disease_name}...\n")

#Game start

#Generate countries & collect hints
game = Game(disease_name) #save a new instance of Game
game.ingredient_country() #generate 7 random countries from database and create 7 instances in Country
#print(game.country_list)
#for name in game.country_list:
    #print(name.name)
    #print(name.level)
   # print(name.hint_list)
#save hints list, for each instance in Country


for level in game.country_list: #for each level of the game
    game.level_over = "No"
    for hint in level.hint_list: #each level the game will have 6 hints available
        print(level.hint_list[0])
        print(level.name)
        current_hint_no = 2
        while level.name not in game.correct_guess: #while the correct guess is not added
            while current_hint_no <= 6 and game.points >= 0:
                decision = input('New hint, guess or quit?').upper()
                #if chosen new hint, a hint is retrieved and shown
                #if guess is chosen, guess is saved and check if it's correct
                game.decision(decision, level.hint_list,current_hint_no)
                if decision == "NEW HINT":
                    current_hint_no += 1
                if game.level_over == "Yes" or game.game_over == "Yes":
                    break
                if current_hint_no == 6:
                    print(f'Last hint: {level.hint_list[5]}')
                    current_hint_no += 1
                    if game.points >= 0:
                        decision = input('New hint, guess or quit?').upper()
                    else:
                        game.game_over = "Yes"
            while game.level_over == "No" and game.game_over == "No":
                if decision == "NEW HINT":
                    game.multiple_choice()
                    decision = input('Guess or quit?').upper()
                game.decision(decision, level.hint_list, 6)
            if game.level_over == "Yes" or game.game_over == "Yes":
                current_hint_no = 2
                break
        if game.level_over == "Yes" or game.game_over == "Yes":
            break
    if game.game_over == "Yes":
        break









