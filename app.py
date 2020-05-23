from flask import Flask, render_template, request
from flask_socketio import SocketIO, send, join_room, emit
from werewolves import Werewolf
from Codenames import Codenames
import urllib.request, string, random
app = Flask(__name__)
app.config['SECRET_KEY'] = 'mysecret'
socketio = SocketIO(app)

clients = {}



word_url = "http://svnweb.freebsd.org/csrg/share/dict/words?view=co&content-type=text/plain"
response = urllib.request.urlopen(word_url)
long_txt = response.read().decode()
words = long_txt.splitlines()

clean_words = [word for word in words if (3 <= len(word) <= 6) and (not "\'" in word)]


@socketio.on("game_start")
def were_start(data):
    room = data['channel']
    users = data['users'] 
    ww = Werewolf([index['username'] for index in users])
    emit('set_roles',{'role_dict':ww.role_dict, 'werewolves': ww.werewolves}, room=room)

@socketio.on("turn")
def cupid(data):
    room = data['channel']
    turn = data['turn']
    ref = {"cupid":"cupids_turn","seer":"seers_turn", "doctor": "doctors_turn", "werewolf":"werewolves_turn","outcome":"outcome_turn","day":"day_cycle","show_werewolves":"show_werewolves","were_starve":"were_starve"}
    emit(ref[turn], room=room)
         

@socketio.on("start_new_round")
def new_round(data):
    room = data['channel']
    emit('start_new_round',data['username'], room=room)

@socketio.on("seer_done")
def seer_done(data):
    room = data['channel']
    emit("seer_done", room=room)

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
    emit('stop_progress_bar', room=room)


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


@socketio.on("message")
def message(data):
    room = data['channel']
    send(data['message'], room=room)

@socketio.on("new_game")
def new_game(data):
    room = data['channel']
    cc = Codenames()
    emit('new_data',cc.build_json(), room=room)

@socketio.on("end_turn")
def end_turn(data):
    room = data['channel']
    emit("end_turn", room=room)


@app.route('/werewolf')
def were_index():
    route = '-'.join(random.sample(clean_words,2))
    return render_template('werewolf_index.html', route=route)

@app.route('/')
def index():
    return render_template('index.html')


@app.route('/codenames')
def code_index():
    two_words = random.sample(clean_words,2)
    route = '-'.join(two_words)
    return render_template('codenames_index.html', route = route)   

@app.route('/codenames/<game>')
def codenames(game):
    cc = Codenames()
    content = cc.build_json()
    return render_template('code_game.html', **content)   


@app.route('/werewolf/<game>')
def chat(game):
    return render_template('were_game.html')

if __name__ == '__main__':
	socketio.run(app, debug=True)