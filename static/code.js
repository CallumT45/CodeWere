var socket = io.connect(location.protocol + '//' + document.domain + ':' + location.port);

socket.on('connect', () => {
    socket.emit('join', { 'channel': window.location.pathname.substr(1) });
});
socket.on('message', function (msg) {
    elements[msg].removeEventListener("click", cell_click);
    if (blue_words.includes(game_words[msg])) {
        elements[msg].style.backgroundColor = "#3399ff";
        change_turn_2("Reds Turn", "Blues Turn", "#3399FF")
        blue_words_guessed += 1;
    }
    else if (red_words.includes(game_words[msg])) {
        elements[msg].style.backgroundColor = "#e62e00";
        change_turn_2("Blues Turn", "Reds Turn", "#e62e00")
        red_words_guessed += 1;
    }
    else if (black_word.includes(game_words[msg])) {
        elements[msg].style.backgroundColor = "#0d0d0d";
        elements[msg].style.color = "#ffffff";
        document.getElementById('turn').innerHTML = "Game Over"
        document.getElementById('turn').style.color = "#0d0d0d"
    } else {
        elements[msg].style.backgroundColor = "gray";
        change_turn()
    }
    if (spymaster_elements.length > 0) {//shows spymaster what has been clicked
        spymaster_elements[msg].style.opacity = 0.3;
    }
    update_turns()
});

socket.on('new_data', function (msg) {
    document.getElementById('game_table').innerHTML = "";
    game_words = msg.game_words
    blue_words = msg.blue_words
    red_words = msg.red_words
    black_word = msg.black_word
    blue_words_guessed = 0;
    red_words_guessed = 0;
    elements = []
    spymaster_elements = []
    draw_table()
    goes_first()
});
socket.on('end_turn', function (msg) {
    change_turn()
});


var blue_words_guessed = 0;
var red_words_guessed = 0;
var elements = []
var spymaster_elements = []
draw_table()
goes_first()

document.getElementById('game_url').innerHTML = location.protocol + '//' + document.domain + ':' + location.port + window.location.pathname;



$(document).ready(function () {
    $('#end_turn_button').click(function () {
        socket.emit('end_turn', { 'channel': window.location.pathname.substr(1) });
    });

    $('#darkmode').change(function () {
        var element = document.body;
        element.classList.toggle("dark-mode");
    });

    $('#new_game_button').click(function () {

        var retVal = confirm("Do you really want to start a new game?");
        if (retVal == true) {
            socket.emit('new_game', { 'channel': window.location.pathname.substr(1) });
        }
    });
    $('#spymaster_button').click(function () {
        document.getElementById('game_table').innerHTML = "";
        for (var j = 0; j < game_words.length; j++) {

            if (j % 5 == 0) {
                row = document.createElement("tr");
                row.setAttribute('id', 'row' + (j / 5).toString())
                document.getElementById('game_table').appendChild(row);
            }
            b = document.createElement("td");
            b.setAttribute("class", "align-middle")
            b.innerHTML = game_words[j];
            if (blue_words.includes(game_words[j])) {
                b.style.backgroundColor = "#3399ff";
            }
            else if (red_words.includes(game_words[j])) {
                b.style.backgroundColor = "#e62e00";
            }
            else if (black_word.includes(game_words[j])) {
                b.style.backgroundColor = "#0d0d0d";
                b.style.color = "#ffffff";
            } else {
                b.style.backgroundColor = "gray";
            }
            b.style.border = "thick solid #D3D3D3";
            spymaster_elements.push(b)
            document.getElementById('row' + Math.floor(j / 5).toString()).appendChild(b);
        };
    });
});

function change_turn() {
    //if was reds turn, now it is blues and visa versa
    if (document.getElementById('turn').innerHTML == 'Blues Turn') {
        document.getElementById('turn').innerHTML = "Reds Turn"
        document.getElementById('turn').style.color = '#e62e00'
    }
    else if (document.getElementById('turn').innerHTML == "Reds Turn") {
        document.getElementById('turn').innerHTML = "Blues Turn"
        document.getElementById('turn').style.color = '#3399ff'
    };
}

function change_turn_2(initial_turn, new_turn, colour) {
    if (document.getElementById('turn').innerHTML == initial_turn) {
        document.getElementById('turn').innerHTML = new_turn
        document.getElementById('turn').style.color = colour
    };
}

function goes_first() {
    // The server decides which team goes first, this function interprets that
    if (blue_words.length > red_words.length) {
        document.getElementById('turn').innerHTML = "Blues Turn"
        document.getElementById('turn').style.color = '#3399ff'
    }
    else {
        document.getElementById('turn').innerHTML = "Reds Turn"
        document.getElementById('turn').style.color = '#e62e00'
    }
}

function update_turns() {

    document.getElementById("blues_turns").innerHTML = blue_words.length - blue_words_guessed
    document.getElementById("reds_turns").innerHTML = red_words.length - red_words_guessed
}

function draw_table() {
    update_turns()
    for (var j = 0; j < game_words.length; j++) {

        if (j % 5 == 0) {
            row = document.createElement("tr");
            row.setAttribute('id', 'row' + (j / 5).toString())
            document.getElementById('game_table').appendChild(row);
        }
        b = document.createElement("td");
        b.setAttribute("class", "guess")
        b.innerHTML = '<br>' + game_words[j];
        b.innerHTML += "<input type='hidden' value='" + j + "'>";
        b.addEventListener("click", cell_click)
        elements.push(b)

        document.getElementById('row' + Math.floor(j / 5).toString()).appendChild(b);

    }
}

function cell_click(){
    value = this.getElementsByTagName("input")[0].value;
    socket.send({ 'message': value, 'channel': window.location.pathname.substr(1) });
}