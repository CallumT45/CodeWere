from flask import Flask, render_template, request
from flask_socketio import SocketIO, send, join_room, emit
from werewolves import Werewolf
app = Flask(__name__)
app.config['SECRET_KEY'] = 'mysecret'
socketio = SocketIO(app)

clients = {}

role_dict = {'a': "Werewolf",
'f': "Werewolf",
'e': "Doctor",
'b': "Seer",
'Prick': "Villager",
'c': "Cupid",
'Benji': "Villager",
'Cal': "Villager"}


@socketio.on("game_start")
def message(data):
    room = data['channel']
    users = data['users'] 
    ww = Werewolf([index['username'] for index in users])
    emit('set_roles',role_dict , room=room)
    emit('show_werewolves',ww.werewolves, room=room)

@socketio.on("turn")
def cupid(data):
    room = data['channel']
    turn = data['turn']
    if turn == "cupid":
        emit('cupids_turn', room=room)
    elif turn == "seer":
        emit('seers_turn', room=room)
    elif turn == "doctor":
        emit('doctors_turn', room=room)
    elif turn == "werewolf":
        emit('werewolves_turn', room=room)
    elif turn == "outcome":
        emit('outcome_turn', room=room)
    elif turn == "day":
        emit('day_cycle', room=room)
        
    

@socketio.on("start_new_round")
def new_round(data):
    room = data['channel']
    emit('start_new_round',data['username'], room=room)

@socketio.on("vote")
def vote(data):
    room = data['channel']
    state = data["state"]
    if state == "group":
        emit('group_vote',data['vote'], room=room)
    elif state == "cupid":
        emit('cupid_vote',data['vote'], room=room)
    elif state == "doctor":
        emit('doctor_choice',data['vote'], room=room)
    elif state == "werewolf":
        emit('were_choice',data, room=room)



# @socketio.on("player_remove")
# def remove_player(data):
#     room = data['channel']
#     emit('player_remove',data['player_id'], room=room)

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


@app.route('/chat')
def chat():
    return render_template('game.html')

if __name__ == '__main__':
	socketio.run(app, debug=True)