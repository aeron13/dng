from django.db import models


class Session(models.Model):
    number_of_players = models.IntegerField(default=3)
    session_code = models.CharField(max_length=20, unique=True)
    turn = models.IntegerField(default=0)
    is_active = models.BooleanField(default=False)
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
	    return f" n. {self.session_code} with {self.number_of_players} players"


class Player(models.Model):
    name = models.CharField(max_length=20)
    number = models.IntegerField(default=0)
    session = models.ForeignKey(Session, related_name="session", on_delete=models.CASCADE)
    word = models.CharField(max_length=20, blank=True)
    score = models.IntegerField(default=0)  
    is_active = models.BooleanField(default=False)

    def __str__(self):
	    return f"{self.name}"


class Drawing(models.Model):
    player = models.ForeignKey(Player, related_name="author", on_delete=models.CASCADE)
    word = models.CharField(max_length=20)
    picture = models.JSONField()

    def __str__(self):
	    return f"{self.word} by {self.player}"


class Turn(models.Model):
    index = models.IntegerField(default=0)
    session = models.ForeignKey(Session, related_name="turn_session", on_delete=models.CASCADE)
    player = models.ForeignKey(Player, related_name="player", on_delete=models.CASCADE)
    drawing_made = models.ForeignKey(Drawing, related_name="drawing_made", on_delete=models.SET_NULL, null=True)
    drawing_guessed = models.ForeignKey(Drawing, related_name="drawing_guessed", on_delete=models.SET_NULL, null=True)
    word_guessed = models.CharField(max_length=20, null=True)
    guessed_right = models.BooleanField(default=False)

    def __str__(self):
	    return f"{self.player} plays turn n. {self.index} in session {self.session}"
