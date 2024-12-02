#based on the choice of the player to behave

class GameMovement():
    def __init__(self, level):
        self.level = level
        self.hint_list = []
        self.hint_used = []
        self.game_over = "No"

    def new_hint(self,hint_list,current_hint_no):
        print(hint_list[current_hint_no - 1])


    def guess(self):
        guess_input = input("What is your guess?").upper()
        return guess_input

    def quit(self):
        self.game_over = "Yes"
        return self.game_over




