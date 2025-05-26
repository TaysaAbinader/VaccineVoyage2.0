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

## How to run
### Prerequisites
- **Database**: To run the backend, you will need
  - MariaDB or MySQL Server: Ensure you have a running instance of either MariaDB or MySQL on your local machine.
  - Database Client: Access to a command-line client (like mysql or mariadb) or a GUI tool (like DBeaver, MySQL Workbench, phpMyAdmin, etc.) to interact with your database server.
- **Python**: Make sure that you have Python installed, if not, you can install it from here [Python.org](https://www.python.org/downloads/)
- **Web browser**: Any modern browser, e.g Chrome, Firefox, Microsoft Edge, etc.
### Get started
#### Clone repository
1.Navigate to the folder into which you would like to save the repository
```bash
cd <your-path>
```
2. Clone the repository:
```bash
git clone https://github.com/TaysaAbinader/VaccineVoyage2.0.git
```
#### Prepare for database
1. Log in to your database server
Open your terminal and enter the following command to log in to your database server
```bash
mysql -u root -p
#You will be asked to enter password
```
**Note:** If you use MariaDB, use the command ```mariadb -u root -p``` instead

2. Create database
```bash
CREATE DATABASE vaccine_voyage;
```
3. Select the database
```bash
USE vaccine_voyage
```
4. Create user
```bash
#Please keep 'newuser', 'password' as it is, no need to change. As this is a school project, security matter was not considered as top priority.
CREATE USER 'newuser'@'localhost' IDENTIFIED BY 'password'
GRANT ALL PRIVILEGES ON vaccine_voyage.* TO 'newuser'@'localhost';
FLUSH PRIVILEGES;
```
5. Clone the content of the game's database into the newly created vaccine_voyage
```bash
SOURCE <saved-repository-path>/VaccineVoyage2.0/database-dumps/vaccines_dump.sql
```
**Note:** Sometimes the path may not work. If this happens, simply copy the vaccines_dumps.sql to the Download folder of your computer, then replace the command above with the new path. 
6. Exit from the database console
```bash
exit
```
#### Run the backend
1. Move to the backend folder
```bash
cd <saved-repository-path>/VaccineVoyage2.0/backend
```
2. Install required libraries
```bash
pip install Flask Flask-Cors mysql-connector-python
```
3. Run backend
```bash
python flask-conenction.py
```

#### Run the front end
1. Navigate to the html folder
```bash
cd <saved-repository-path>//VaccineVoyage2.0/frontend/html
```
2. Right click ```home.html``` , choose **Open with**, choose the broswer to open (Chrome, Firefox, Edge, etc)

## Troubleshoot 
In case of error, it may be that the port is busy. In that case, do the following:
- Change the port on line 170 of [flask-connection.py](https://github.com/TaysaAbinader/VaccineVoyage2.0/blob/main/backend/flask-connection.py)
- Change the port on line 8 of [body.js](https://github.com/TaysaAbinader/VaccineVoyage2.0/blob/main/frontend/js/body.js)
- Change the port on line 2 of [home.js](https://github.com/TaysaAbinader/VaccineVoyage2.0/blob/main/frontend/js/home.js)
- Change the port on line 2 of [tutorial.js](https://github.com/TaysaAbinader/VaccineVoyage2.0/blob/main/frontend/js/tutorial.js)
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

