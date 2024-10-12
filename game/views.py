import json
from django.http import JsonResponse
from datetime import datetime
from django.views.decorators.csrf import csrf_exempt
from django.shortcuts import render
from django.db.models import Max

from .models import Player, Session, Turn, Drawing


# RENDER INDEX
def index(request):
    return render(request, 'build/index.html')


# CREATE SESSION
def create_session(request):

    if request.method != "POST":
        return JsonResponse({"error": "POST request required."}, status=400)

    data = json.loads(request.body)
    name = data.get("name")
    number_of_players = int(data.get("number_of_players"))

    if number_of_players < 3 or number_of_players > 13 or number_of_players % 2 == 0:
        return JsonResponse({
            "error": "Invalid number of players."
        }, status=400)
    
    if len(name) < 2 or len(name) > 20:
        return JsonResponse({
            "error": "Invalid name."
        }, status=400)
    
    session_code = create_session_code()
    
    session = Session(number_of_players=number_of_players, session_code=session_code)
    session.save()

    # create new player
    player = Player(name=name, session=session, is_active=True)
    player.save()

    return JsonResponse({
        'session_code': session_code, 
        'number_of_players': number_of_players, 
        'player_id': player.id,
        'player_name': name
        }, status=201)


# JOIN SESSION
def join_session(request):

    if request.method != "POST":
        return JsonResponse({"error": "POST request required."}, status=400)

    data = json.loads(request.body)
    name = data.get("name")
    session_code = data.get("session_code")

    if len(name) < 2 or len(name) > 20:
        return JsonResponse({
            "error": "Invalid name."
        }, status=400)
    
    if not session_code or (len(session_code) > 7 and len(session_code) < 5):
        return JsonResponse({
            "error": "Invalid session code."
        }, status=400)

    if not Session.objects.filter(session_code=session_code).exists:
        return JsonResponse({
            "error": "Invalid session code."
        }, status=400)
    
    session = Session.objects.get(session_code=session_code)
    
    # check if there's a player with same name in the session
    if len(Player.objects.filter(name=name, session=session)) > 0:
        return JsonResponse({
            "error": "There's another player with this name. Choose another name"
        }, status=400)
    
    # check if there's still place in the session
    if len(Player.objects.filter(session=session)) >= session.number_of_players:
        return JsonResponse({
            "error": "This game session is full."
        }, status=200)

    # if not, create new player in that session
    player = Player(name=name, session=session, is_active=True)
    player.save()

    return JsonResponse({
        'session_code': session_code, 
        'number_of_players': session.number_of_players, 
        'player_id': player.id,
        'player_name': name
        }, status=201)


# CHECK ACTIVE PLAYERS
def active_players_stream(request, session_code):

    # check that the session exists
    session = Session.objects.filter(session_code=session_code)[0]
    if not session:
        return JsonResponse({'error': 'invalid session.'}, status=400)
    
    # check if all the players connected
    is_active = False
    players = Player.objects.filter(session=session)

    # if all the players are active, set the session to active
    if len(players) == session.number_of_players:

        # if it's the first activation save it in the db
        if not session.is_active:
            session.is_active = True
            session.save()

            # set the correct number to each player
            for i in range(0, len(players)):
                players[i].number = i
                players[i].save()
        
        is_active = True
    
    return JsonResponse({'is_active': is_active, 'active_players': len(players)}, status=200)


# SAVE A WORD
def save_word(request, player_id):

    if request.method != "POST":
        return JsonResponse({"error": "POST request required."}, status=400)

    data = json.loads(request.body)
    word = data.get("word")

    # check that the word is valid
    if not word:
        return JsonResponse({
            "error": "Insert a word"
        }, status=400)
    
    if not word.replace(' ','').replace('-','').isalpha():
        return JsonResponse({
            "error": "Use only letters or space"
        }, status=400)
    
    player = Player.objects.filter(pk=player_id)[0]
    if not player:
        return JsonResponse({'error': 'Player doesn\'t exist.'}, status=404)
    
    # check that the word wasn't set before
    if player.word:
        return JsonResponse({'error': 'Word already set.'}, status=400)    

    # check that is wasn't used by other players
    if Player.objects.filter(session=player.session, word=word):
        return JsonResponse({'error': 'Word already in use. Try another'}, status=200)    

    # save the word
    player.word = word
    player.save()

    return JsonResponse({'can_start': False}, status=200)


# QUERY SESSION WORDS
def query_words(request, player_id):

    player = Player.objects.filter(pk=player_id)[0]
    if not player:
        return JsonResponse({'error': 'Player doesn\'t exist.'}, status=404)
    
    # find out if all the players submitted a word already
    words = []
    players = Player.objects.filter(session=player.session).order_by('number')
    for person in players:  
        if person.word:
            words.append(person.word)

    if len(words) == player.session.number_of_players:

        ordered_words = []
        if player.number == 0:
            for i in range(1, len(words)):
                ordered_words.append(words[i])

        elif player.number == len(words) - 1:
            for i in range(0, len(words) - 1):
                ordered_words.append(words[i])

        else:
            for i in range(player.number + 1, len(words)):
                ordered_words.append(words[i])
            for i in range(0, player.number):
                ordered_words.append(words[i])


        # return JsonResponse({'words': words, 'first_word': first_word, 'can_start': True }, status=200)
        return JsonResponse({'words': ordered_words, 'can_start': True }, status=200)

    return JsonResponse({'can_start': False }, status=200)



# SAVE DRAWING
def save_drawing(request, player_id):

    if request.method != "POST":
        return JsonResponse({"error": "POST request required."}, status=400)

    data = json.loads(request.body)
    drawing_data = data.get("drawing-data")
    word = data.get("word")

    # check that the drawing exists
    if not drawing_data:
        return JsonResponse({
            "error": "Complete the drawing"
        }, status=400)
    
    player = Player.objects.filter(pk=player_id)[0]
    if not player:
        return JsonResponse({'error': 'Player doesn\'t exist.'}, status=404)
    
    if not word:
        return JsonResponse({'error': 'Missing word.'}, status=400)

    if not data.get("turn"):
        return JsonResponse({'error': 'Missing turn.'}, status=400)
    
    # save the drawing
    drawing = Drawing(
        player=player, 
        word=word, 
        picture=drawing_data
    )
    drawing.save()

    # create a new turn for the player
    turn = Turn(
        index=data.get('turn'), 
        session=player.session, 
        player=player,
        drawing_made = drawing
    )
    turn.save()
     
    return JsonResponse({'message': 'Drawing sent correctly', 'turn_id': turn.id}, status=200)


# QUERY DRAWING
def query_drawing(request):

    player_id = request.GET.get('player_id', '')
    word = request.GET.get('word', '')

    player = Player.objects.filter(pk=player_id)[0]
    if not player:
        return JsonResponse({'error': 'Player doesn\'t exist.'}, status=404)
    
    turn = Turn.objects.exclude(player=player).filter(session=player.session, drawing_made__word__iexact=word)
    if not turn:
        return JsonResponse({'message': 'No drawings yet.'}, status=200)
    
    drawing_to_guess = turn[0].drawing_made
    return JsonResponse({'drawing_data': drawing_to_guess.picture, 'word': drawing_to_guess.word, 'drawing_id': drawing_to_guess.pk}, status=200)


# UPDATE TURN
def update_turn(request, player_id):

    if request.method != "POST":
        return JsonResponse({"error": "POST request required."}, status=400)
    
    player = Player.objects.filter(pk=player_id)[0]
    if not player:
        return JsonResponse({'error': 'Player doesn\'t exist.'}, status=404)

    data = json.loads(request.body)
    turn_number = data.get("turn")
    drawing_guessed_id = data.get("drawing_guessed")
    word_guessed = data.get("word_guessed")
    guessed_right = data.get("guessed_right")
    
    turn = Turn.objects.filter(session=player.session, index=turn_number, player=player)[0]
    if not turn:
        return JsonResponse({'message': 'Invalid turn data.'}, status=400)
    
    # check that the drawing exists
    drawing_guessed = Drawing.objects.filter(pk=drawing_guessed_id)[0]
    if not drawing_guessed:
        return JsonResponse({'message': 'Invalid drawing id.'}, status=400)

    turn.drawing_guessed = drawing_guessed
    turn.word_guessed = word_guessed
    turn.guessed_right = guessed_right
    turn.save()

    if guessed_right:
        player.score = player.score + 1
        player.save()
    
    return JsonResponse({'message': 'Turn updated.'}, status=200)


# END OF PLAYER GAME
def end_player_game(request, player_id):

    player = Player.objects.filter(pk=player_id)[0]
    if not player:
        return JsonResponse({'error': 'Player doesn\'t exist.'}, status=400)
    
    # set the player as inactive
    player.is_active = False
    player.save()

    # check if all the players are inactive
    done_players = Player.objects.filter(session=player.session, is_active=False).exclude(pk=player_id)

    if len(done_players) == player.session.number_of_players - 1:
        return JsonResponse({'can_start': True}, status=200)
    
    return JsonResponse({'can_start': False}, status=200)


# END OF SESSION
@csrf_exempt
def end_session(request, player_id):

    player = Player.objects.filter(pk=player_id)[0]
    if not player:
        return JsonResponse({'error': 'Player doesn\'t exist.'}, status=400)
    
    # deactivate the session
    session = player.session
    session.is_active = False
    session.save()

    #find out if there is a winner
    score = Player.objects.filter(session=session).aggregate(Max('score'))

    winners = Player.objects.filter(session=session, score=score['score__max']) #.values('name')
    winners_names = []
    if score['score__max'] > 0:
        for winner in winners:
            winners_names.append(winner.name)

    # return all the drawings that were made.
    players = Player.objects.filter(session=session)
    drawing_objects = Drawing.objects.filter(player__in=players)

    drawings = []
    for object in drawing_objects:
        drawings.append({
            'player': object.player.name,
            'word': object.word,
            'picture': object.picture
        })

    return JsonResponse({'drawings': drawings, 'winners': winners_names}, status=200)


# RESET SESSION
# when the users want to play again
def reset_session(request, player_id):

    if request.method != "POST":
        return JsonResponse({"error": "POST request required."}, status=400)

    player = Player.objects.filter(pk=player_id)[0]
    if not player:
        return JsonResponse({'error': 'Player doesn\'t exist.'}, status=400)

    # delete the turns
    turns = Turn.objects.filter(player=player)
    if not turns:
        return JsonResponse({'error': 'The game didn\'t start yet.'}, status=400)
    
    turns.delete()

    # reset the user's data
    player.score = 0
    player.word = ''
    player.is_active = True
    player.save()

    # reset the words for all players
    Player.objects.filter(session=player.session, is_active=False).exclude(pk=player_id).update(word='')

    # reset session data
    session = player.session
    session.turn = 0
    session.save()

    return JsonResponse({'message': 'Session reset correctly'}, status=200)


# @csrf_exempt
def quit_session(request, player_id):

    player = Player.objects.filter(pk=player_id)[0]
    if not player:
        return JsonResponse({'error': 'Player doesn\'t exist.'}, status=400)

    session = player.session

    # check if that was the last player in the session.
    active_players = Player.objects.filter(session=session)
    if len(active_players) == 1:
        session.delete()
    
    player.delete()

    return JsonResponse({'message': 'player deleted.'}, status=200)


# helpers

def create_session_code():
    rightnow = datetime.now()
    terminal = str(rightnow.microsecond)
    return str(rightnow.day) + str(rightnow.hour) + str(rightnow.second) + terminal[0]



