# Introduction: Vaccine Voyage 2.0
This is the continued development of the text-based game [Vaccine Voyage 1.0](https://github.com/anh-tq-huynh/Vaccine_Voyage1.0-Text-based-game-/tree/main_game_update2.0) to develop the previous text-based game into a web-based version, with user interface and web functionalities. This requires the combined use of Python for backend, JavaScript, HTML, CSS for frontend.

The gameplay is generally the same as version 1.0, however, in version 2.0, the player can choose to play minigame whenever they feel like to get bonus points, extending gameplay time. In other words, the game is made easier with the purpose of education rather than winning or losing. The more you stay, the more you learn about different countries and general knowledge.

## Game's mechanism
In short, the game requires the player to guess the countries based on given hints. The player can decide whether to receive more hints or to guess immediately after reading the first hint.
For more details, [see Vaccine Voyage 1.0 gameplay](https://github.com/anh-tq-huynh/Vaccine_Voyage1.0-Text-based-game-/tree/main_game_update2.0)

## Key changes and addition
- **Web interface** - The game is now available to play on web browser, making the experience more fun and engaging.
- **Interactive map** - The player can follow the game's progress. As they answer correctly, they will "travel" to that country to collect vaccine's ingredient. 
- **Informative dashboard** - The player can see which level they are at,current points, number of available hints, and number of used hints.
- **Minigames** - The player can play for as long as they would like without worrying about losing all points. simply by clicking a button at anytime, they can play hangman or trivia-question game as a pop-up to gain bonus points.


## See it in action
[See the demo video here](https://youtu.be/gR3mfJVxawc)
[![Demo video thumbnail](https://github.com/user-attachments/assets/31284be9-a03f-4c72-b644-73d1561b3f5b)](https://youtu.be/gR3mfJVxawc)

## Acknowledgement
The project utilizes the following resources:
- [Trivia question API](https://the-trivia-api.com/) - for the trivia question minigame
- [mapbox](https://www.mapbox.com/) - for displaying the map and moving the player's current position

Teammates in building this project: 
- [Tamseela Mahmood](https://github.com/tamseelaa)
- [Taysa Abinader](https://github.com/TaysaAbinader)
- [Lan-Anh Tran](https://github.com/anhlt13)
- [Anh Huynh](https://github.com/anh-tq-huynh)
  
## Appendix
### Database structure
In comparison to version 1.0, the database has been expanded and modified to fit better the needs of a web-based game and support user experience. For example, by adding longitude and latitude, it is possible to "drive" the player's position on the map to the next country.
![image](https://github.com/user-attachments/assets/ec3013f0-ece8-4bfb-a4e2-77056ae23178)

_Vaccine Voyage 1.0 database_

![image](https://github.com/user-attachments/assets/5198dd66-63cc-49bc-b5eb-534e3593a66e)

_Vaccine Voyage 2.0 database_

### User interface
![image](https://github.com/user-attachments/assets/d21bef8e-959d-4b5d-8f21-55d41706e5e9)

_User interface_

### Code structure
![image](https://github.com/user-attachments/assets/3cc317de-db16-4aea-9184-edefa8ed13f2)

_Code structure_

