from django.urls import path
from . import views


urlpatterns = [
    path("", views.index, name="index"),
    path("create-session", views.create_session, name="create_session" ),
    path("join-session", views.join_session, name="join_session" ),
    path("active-players/<str:session_code>", views.active_players_stream, name="active-players"),
    path("save-word/<str:player_id>", views.save_word, name="save-word"),
    path("query-words/<str:player_id>", views.query_words, name="query-words"),
    path("save-drawing/<str:player_id>", views.save_drawing, name="save-drawing"),
    path("query-drawing/", views.query_drawing, name="query-drawing"),
    path("update-turn/<str:player_id>", views.update_turn, name="update-turn"),
    path("end-player-game/<str:player_id>", views.end_player_game, name="end-player-game"),
    path("end-session/<str:player_id>", views.end_session, name="end-session"),
    path("reset-session/<str:player_id>", views.reset_session, name="reset-session"),
    path("quit-session/<str:player_id>", views.quit_session, name="quit-session"),
]