from flask import Flask, render_template, request
from flask_socketio import SocketIO, send, join_room, emit
from werewolves import Werewolf
from Codenames import Codenames
from cah import CAH
import urllib.request, string, random
app = Flask(__name__)
app.config['SECRET_KEY'] = 'mysecret'
socketio = SocketIO(app)

clients = {}


cah_game = CAH()
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

@socketio.on("remove_user")
def remove_user(data):
    room = data['channel']
    emit('remove_user',data['username'], room=room)


@socketio.on('join')
def on_join(data):
    room = data['channel']
    join_room(room)

    clients[request.sid] = room
    emit('update_new_user', room=room)

@socketio.on('update_users')
def update_users(data):
    room = data['channel']
    users = data['user_list']
    emit('new_user_list', users, room=room)


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

# =====================================================================================================
@socketio.on("black_card")
def black_card(data):
    room = data['channel']
    casts = data['casts']
    temp, text, count, Set = cah_game.black_card(casts)
    emit('black_card',{"text":text,"count":count,"Set":Set}, room=room)

@socketio.on("white_card")
def white_card(data):
    casts = data['casts']
    temp, text, Set = cah_game.draw_card(casts)
    emit('white_card',{"text":text,"Set":Set})

@socketio.on("submit_card")
def submit_card(data):
    room = data['channel']
    cards = data['cards']
    emit('submitted_card',cards, room=room)

@socketio.on("new_choices")
def new_choices(data):
    room = data['channel']
    emit('new_choices',{'choices':data['choices']}, room=room)


@socketio.on("new_settings")
def new_settings(data):
    room = data['channel']
    emit('new_settings',{'blankPerc': data['blankPerc'], 'maxScore': data['maxScore']}, room=room)

@socketio.on("start_game_cah")
def start_game_cah(data):
    room = data['channel']
    emit('start_game_cah',{'game_casts':data['game_casts'],'blankPerc': data['blankPerc'], 'maxScore': data['maxScore']}, room=room)

@socketio.on("start_new_round_cah")
def start_new_round_cah(data):
    room = data['channel']
    emit('start_new_round_cah',data["round_winner"], room=room)

@socketio.on("show_next_card")
def show_next_card(data):
    room = data['channel']
    emit('show_next_card', room=room)

@socketio.on("update_game_state")
def update_game_state(data):
    room = data['channel']
    emit('update_game_state', data, room=room)
    

# =====================================================================================================



@app.route('/')
def index():
    return render_template('index.html')

@app.route('/werewolf')
def were_index():
    route = '-'.join(random.sample(clean_words,2))
    return render_template('werewolf_index.html', route=route)


@app.route('/werewolf/<game>')
def chat(game):
    return render_template('were_game.html')


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

@app.route('/cah')
def cah_index():
    two_words = random.sample(clean_words,2)
    route = '-'.join(two_words)
    return render_template('cah_index.html', route = route)     

@app.route('/cah/<game>')
def cahGame(game):
    return render_template("cah_game.html")




if __name__ == '__main__':
	socketio.run(app, debug=True)