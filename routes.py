from flask import Flask, render_template, request
from flask_socketio import SocketIO, send, join_room, emit
from werewolves import Werewolf
app = Flask(__name__)
app.config['SECRET_KEY'] = 'mysecret'
socketio = SocketIO(app)

clients = {}

role_dict = {'a': "Werewolf",
'c': "Werewolf",
'e': "Doctor",
'f': "Seer",
'd': "Cupid",
'b': "Hunter",}

werewolves = ['a', 'c']


@socketio.on("game_start")
def message(data):
    room = data['channel']
    users = data['users'] 
    ww = Werewolf([index['username'] for index in users])
    emit('set_roles',{'role_dict':role_dict, 'werewolves': werewolves}, room=room)

@socketio.on("turn")
def cupid(data):
    room = data['channel']
    turn = data['turn']
    ref = {"cupid":"cupids_turn","seer":"seers_turn", "doctor": "doctors_turn", "werewolf":"werewolves_turn","outcome":"outcome_turn","day":"day_cycle","show_werewolves":"show_werewolves"}
    emit(ref[turn], room=room)
         
    

@socketio.on("start_new_round")
def new_round(data):
    room = data['channel']
    emit('start_new_round',data['username'], room=room)

@socketio.on("vote")
def vote(data):
    room = data['channel']
    state = data["state"]
    ref = {"group":"group_vote","cupid":"cupid_vote","doctor":"doctor_choice","hunter":"hunter_choice"}
    if state == "werewolf":
        emit('were_choice',data, room=room)
    else:
        emit(ref[state],data['vote'], room=room)


@socketio.on("vote_now")
def vote_now(data):
    room = data['channel']
    emit('vote_now', room=room)


@socketio.on("remove_player")
def remove_player(data):
    room = data['channel']
    emit('remove_player',data['username'], room=room)

@socketio.on('join')
def on_join(data):
    room = data['channel']
    join_room(room)

    clients[request.sid] = room
    emit('new_user', data, room=room)

@socketio.on('update_users')
def update_users(data):
    room = data['channel']
    users = data['user_list']
    emit('new_user_list', users, room=room)

@socketio.on('new_username')
def new_username(data):
    room = data['channel']
    emit('new_username_2', data, room=room)

@socketio.on('disconnect')
def disconnect():
    sid = request.sid
    room = clients[sid]
    emit('user_leave', sid, room=room)
    del clients[sid]

@app.route('/')
def index():
    return render_template('index.html')


@app.route('/werewolf')
def chat():
    return render_template('game.html')

if __name__ == '__main__':
	socketio.run(app, debug=True)