# DRAW&GUESS
A web game to play with friends

##### Video Demo
[https://youtu.be/ZKGPeSmEnzQ](https://youtu.be/ZKGPeSmEnzQ)

##### Description
DnG is a web game in which friends can play together, making drawings of words and then guessing the meaning of the drawings. It can be played both on mobile and desktop, by an odd number of people. The backend is implemented with Django and the frontend with React.js.
Made as final project for 'Web Programming with Python and JavaScript' course, held by HarvardX.

##### Year
2022

$~~~~~~~~~~~$\
$~~~~~~~~~~~$

# Table of contents
0. [How to run](#how-to-run)
1. [Distinctiveness and Complexity](#distinctiveness-and-complexity)
2. [Frontend](#front-end)
3. [Backend](#backend)
4. [Credits](#credits)

$~~~~~~~~~~~$\
$~~~~~~~~~~~$

# How to run
If you have Python and pip installed already:

1. In the terminal run ```pip install -r requirements.txt``` to install all the requirements.
2. Run ```python manage.py migrate``` to make sure the migrations are applied.
3. Run ```python manage.py runserver``` to start the server.

To see the project live, go to the address it gives at the start of the server. **You can try the game** just by opening multiple tabs in the same browser.

$~~~~~~~~~~~$\
$~~~~~~~~~~~$

# **Distinctiveness and Complexity**
Being a game, this project is completely different from every other assignment. It uses Django for the back-end, as requested by the assignment, with several models for storing the data. The front-end instead is implemented with React js: it is in fact a single page application, which was the most convenient way to deal with the game dynamics.
This project was inspired by similar games that already exist online, but has a unique trait in **the drag-and-drop functionality** for creating pictures instead of the usual drawing interface. By having a narrow range of shapes to choose from, the drag-and-drop interface makes the creative challenge more engaging and the results more visually interesting.
The complexity of the project lies first of all in it being a **multi-player game**, where different users has to share the same data in real-time. The game is divided in various phases: at the end of some of them, the user has to wait for the other players in the same session to end that phase in order to proceed to the next one. During this waiting stage, the application makes repeated asynchronous calls to the server, which receives the data from every player and evaluates whether all the players are done with the phase. If they are, the server responds with the appropriate data so that the application on the client side will know how to proceed to the next phase.

The other challenge I faced was to **save the pictures resulted from the drag-and-drop and then display them to other users**, taking into account that users can play on different devices with different screen sizes. I chose the simplest way possible, which was to save the picture as pure json data: when the player completes a picture and send it, Javascript figures out the total height and width of the picture by looping through all the shapes the user has added. For every shape it then saves the type (circle, triangle etc), the color and the top and left position in percentage relative to the overall width and height of the picture. So for example, the shape which has the smallest top position and smallest left position will have ```‘top’: 0```, and ```‘left’: 0```, even if relative to the document they are not zero.
All these data are then encoded in a json object and sent to the server.
When the picture needs to be displayed again, the json data are used to re-render the picture. A container is created with the original size of the picture + a padding (just for visual reasons), if the resulting width is smaller than the current window width. If it’s bigger, for example if the picture was created on a desktop device and now is being rendered on a mobile device, the picture is resized using css property ```transform: scale()``` to fit in the screen. This scaling process is re-evaluated when the window resizes.

Another important feature that this application required was a way to delete all the inactive sessions once the users stop playing. The best way would have been to detect when the browser tab is closed and notify it to the server, so that it would know when a user abandoned a session. But it wouldn’t be a good idea to rely only on this event to deactivate the sessions, because especially on mobile devices it may be hard to detect.
For these reasons I chose to implement a background task that runs every hour when the server is running, deactivating and deleting old sessions. To achieve this result I used the Django package Apscheduler.

$~~~~~~~~~~~$\
$~~~~~~~~~~~$

## **Languages used**
- Python v. 3.10
- Django v. 4.1.1
- Javascript
- React
- CSS / Tailwind

$~~~~~~~~~~~$\
$~~~~~~~~~~~$


# Frontend
```/dng-frontend```

The front-end is build as a single-page application, using React. The static files that get served when the application runs are stored in the ```build``` folder, which is only the result of React build process and not the files I actually wrote to implement the application. For this reason, I committed also the other files which are not necessary to run the application, just for the purpose of showing how it was implemented.

### The components
```/dng-frontend/src```

$~~~~~~~~~~~$

#### App.js
the main file where the session state is initialized. It works as a switch between the main phases of the game: intro, preparation, choosing a word, playing the game and game end.

$~~~~~~~~~~~$

```/dng-frontend/src/pages```
Each file corresponds to a phase in the game.

#### Intro
There is only a call to action to start the game. In the future here could be added the instructions on how the game works and other generic contents.

#### Preparation
There are two forms: one for creating a new session, that requires a number of players and the name of the first player, and the other for joining a session that already exist via the session code. All forms are sent asynchronously with fetch.

#### Word
After all players have joined the session, each player chooses a word and send it. When all the players submitted a word, the server returns the list of all the words to each player in the appropriate order and the game can start.

#### Game
The actual game, which is composed of n turns: ```n = (n_of_players -1)/2```. This is the reason why the players must be an odd number: if not, there would be a mismatch between the number of turns required and the number of words inputed. In this component, a turn state is initialized that stores the words that will be drawn and guessed, along with the number of the current turn and the current phase the player is in. The component then renders the appropriate game phase according to the data stored in the turn state.

#### Game end
*EndGameView.js*
when the game ends, the winner’s name is displayed (if there is one) along with the list of all the drawings made in the session. It’s also possible to play again.

$~~~~~~~~~~~$

```/dng-frontend/components/game```
As stated, the game takes 1 or more turns to complete. Each turn has two distinct phases:


#### 1. DrawingView
The user is presented a word and has to make a drawing of that word, in one minute. Once the timer expires, the drawing is automatically sent. To make the picture the player can add some shapes, choosing them from the overlay menu. They can drag the shapes around and change the color by clicking on them. The shapes can also be deleted, by dragging them near the delete button in the bottom-left corner.
When the drawing is done, a function runs collecting the data of the drawing in an object and send it as json to the server. The drag-and-drop movement is implementing using the [Draggable component](https://github.com/haikelfazzani/drag-react?ref=reactjsexample.com), who belongs to its owner.

#### 2. GuessingView
The user is presented with a drawing and has to guess what that could represent. This drawing is retrieved by making a get request with the word that has to be guessed. When the user submits their guess, Javascript checks whether the player’s guess matches with the original word. If it does, their score is augmented by 1.
When all the players are done guessing, the game moves on to the next turn or to game end.

$~~~~~~~~~~~$\
$~~~~~~~~~~~$

# Backend
The backend is a simple Django project called ```dng```, with a single application called ```game```.

```/game```

#### urls.py
In this file are declared all the routes that the application will use to save, update and retrieve data from the server.
$~~~~~~~~~~~$

#### models.py
Here are declared all the Django models that will be used for saving the data related to the game:

- **Session**
each session corresponds to a group of people playing together. It is defined by the session code, which is a unique string of numbers generated starting from the time in which each session is initialized, and the number of people which are playing in it.
$~~~~~~~~~~~$

- **Player**
This model represents a person who is playing in a specific session. It is not a user in the Django sense, because the game does not imply any registration and when the user closes the browser, everything from that player is forgotten. In the model are stored the player’s name, the word they set at the beginning of the game, their score and a progressive number which is unique in the session (it helps to make sure that every player receive the words for the game in the correct order).
$~~~~~~~~~~~$

- **Drawing**
It stores a picture made by a player in each turn: it contains the word which the picture represents and the json data where the picture is actually stored, along with a foreign key relation with the player who made it.
$~~~~~~~~~~~$

- **Turn**
This model stores the data for a single turn played by a specific user in a session. In it are stored the turn number, the relations to the drawing that was made during that turn and the drawing that was guessed, the word that was guessed and whether the guess was right.
$~~~~~~~~~~~$

#### views.py
Here are defined the functions for all the routes in the server-side.

- **index** (GET)
it just returns the ```index.html``` file, which will start all the React application on the client browser.
$~~~~~~~~~~~$
- **create_session** (POST)
When a user submits the form for creating a new session, this route creates a new session instance in the database with a unique session code and a new player instance with a provided name. It then returns to the client the session code and the player id of the newly created elements.
$~~~~~~~~~~~$
- **join_session** (POST)
When a user submits the form for joining a session, if the provided session code is valid and in the session there is still room for players, a new player instance is created and added to the session. Then the player id and the other data are returned to the client.
$~~~~~~~~~~~$
- **active_players_stream** (GET)
This route is repeatedly called by the clients when they are waiting for all the players to join. It checks whether the number of players expected by the session matches with the number of players saved in the database for that session, and if it does, it activates the session.
$~~~~~~~~~~~$
- **save_word** (POST)
When the player submits the word form at the beginning of the game, it saves the word in the player’s object in the database.
$~~~~~~~~~~~$
- **query_words** (GET)
This route is repeatedly called by clients to check if all the players submitted a word. So it checked whether they did, and if they did it returns an array of words in the appropriate order for the user to draw and guess.
$~~~~~~~~~~~$
- **save_drawing** (POST)
Saves in the database the picture that the player just made with drag-and-drop. Since this is the first phase in each turn, it also creates a new turn instance in the database with the provided turn number.
$~~~~~~~~~~~$
- **query_drawing** (GET)
This request is made by clients just before the guessing phase. The client asks for the drawing of a specific word that is included as parameter in the get request. It could be that no drawing was yet saved for that word, and in that case the client would keep repeating the query until some drawing is available. When it is, the function returns the drawing json data so that React can display it.
$~~~~~~~~~~~$
- **update_turn** (POST)
At the end of each turn, the application on the client side sends the data regarding the guessing phase, to complete the record in the database. If the guess was right, the score the player record is also updated.
$~~~~~~~~~~~$
- **end_player_game** (GET)
When the player finishes the last turn, this request is automatically sent to the server and the player is set is inactive. Then they have to wait for all the players to end, so that the final scores can be evaluated and the winner established. When all the players are inactive, this route simply signals to the client that is can proceed to the ‘end game’ view.
$~~~~~~~~~~~$
- **end_session** (GET)
When all the players have ended all the turns, the final scores are evaluated and the winner established. This route then returns the list of the winners names and the list of all drawings made during the session.
$~~~~~~~~~~~$
- **reset_session** (POST)
When the user clicks on ‘play again’, the player’s turns records are deleted and all data related to the previous game are reset. In this way, a new game with same players but different words can start.
$~~~~~~~~~~~$
- **quit_session** (GET)
this route is called by the client on the window ```unload``` event. It should guarantee that when a user closes the browser or the tab, the player record in the database is deleted.
$~~~~~~~~~~~$

#### scheduler.py
In this file is created and initialized the background task. It runs every hour from the start of the server. It deletes all the inactive sessions that were created one hour or more before the current time, and sets all the active sessions that were created one hour or more before the current time as inactive.
$~~~~~~~~~~~$

#### admin.py
Here the models are registered in the admin app, so they can be seen and edited from the Django admin. There, also the task in the background scheduler can be run when necessary.

$~~~~~~~~~~~$\
$~~~~~~~~~~~$

# Credits

$~~~~~~~~~~~$

Visual identity, copywriting, UX and UI Design: \
[Margherita Magatti](https://www.margheritamagatti.it)

$~~~~~~~~~~~$

Coded by: \
[Margherita Magatti](https://www.margheritamagatti.it)\
Using Django framework with SQLite database, React and Tailwind on the front-end. Includes [APScheduler](https://github.com/agronholm/apscheduler) for Django and [React Draggable Component](https://github.com/haikelfazzani/drag-react?ref=reactjsexample.com).

$~~~~~~~~~~~$