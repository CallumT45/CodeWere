$(document).ready(function () {
    var username = localStorage.getItem('username');
    if (username == null) {
        window.location = "/";
    }

    var socket = io.connect();

// global variables
    var users = [];
    var votes = [];
    var roles = [];
    var game_users = [];
    var cupid_votes = [];
    var doctor_choice = null;
    var were_choice = [];
    var elements = [];
    var werewolf_overall_choice = null;
    var seer_done = false;
    var werewolves = [];
    var day = false;
    var removed_roles = [];

    const nums = document.querySelectorAll('.nums span');
    const counter = document.querySelector('.counter');
    document.getElementById("game_div").style.display = "none";

    socket.on('connect', () => {
        socket.emit('join', { 'channel': window.location.pathname.substr(1), 'username': username, 'id': socket.id });
    });

    socket.on('new_user', function (data) {
        if (!check_username(users, data['username'])) {
            obj = {
                'username': data['username'],
                'id': data['id']
            }
            users.push(obj);
        } else {
            var new_username = data['username'] + " the first!";
            socket.emit('new_username', { 'channel': window.location.pathname.substr(1), 'old_username': data['username'], 'new_username': new_username, 'id': data['id'] })
        }
        socket.emit('update_users', { 'channel': window.location.pathname.substr(1), 'user_list': users })
    });

    socket.on('user_leave', function (sid) {
        for (var i = 0; i < users.length; i++) {
            if (users[i].id == sid) {
                users.splice(i, 1);
            }
        }
        $("#online").empty();
        for (var i = 0; i < users.length; i++) {
            $("#online").append('<li class="list-group-item">' + users[i].username + '</li>');
        }
    });

    socket.on('new_user_list', function (data) {
        if (users.length < data.length) {
            users = data
        }
        $("#online").empty();
        for (var i = 0; i < users.length; i++) {
            $("#online").append('<li class="list-group-item">' + users[i].username + '</li>');
        }
    });

    socket.on('new_username_2', function (data) {
        if (data['old_username'] == username && socket.id == data['id']) {
            localStorage.setItem('username', data['new_username']);
            username = data['new_username']
            socket.emit('join', { 'channel': window.location.pathname.substr(1), 'username': username, 'id': socket.id });
        }
    });

    socket.on('start_new_round', function (data) {
        if (data == username) {
            night()
        }
    });

    socket.on('group_vote', async function (vote) {
        // last event of game loop, if conditions are met after this function, re start the game loop
        votes.push(vote)
        if (votes.length == game_users.length) {
            var to_be_lynched = most_voted(votes)
            var counts = {};

            for (var i = 0; i < votes.length; i++) {
                var num = votes[i];
                counts[num] = counts[num] ? counts[num] + 1 : 1;
            }
            var k = "<table class='table'>"
            for (var key in counts) {
                k += '<tr><td>' + key + '</td><td>' + counts[key] + '</td></tr>'

            }
            k += '</table>'

            document.getElementById("game_div_body").innerHTML = k;


            if (to_be_lynched.length > 1) {
                // deals with no majority, force another vote
                await sleep(5000)
                document.getElementById("game_div_body").innerHTML = "";
                votes = []
                if (check_username(game_users, username)) {
                    draw_table("day")
                }
            } else {
                var timeToSleep = roles[to_be_lynched] == "Hunter" ? 12000 : 5000;
                socket.emit('remove_player', { 'username': to_be_lynched, 'channel': window.location.pathname.substr(1) });
                await sleep(timeToSleep)
                document.getElementById("game_div_body").innerHTML = "";


                if (werewolves.length > 0 && (2 * werewolves.length < game_users.length)) {// should be 0 not 1
                    document.getElementById("vote_table").innerHTML = "" //removes table from hunter if they didn't vote
                    document.getElementById("game_div_body").innerHTML += '<div class="card" style="width: 18rem;"><img src="../static/images/Lynched.png" class="card-img-top" alt="grave"><div class="card-body"><h5 class="card-title">' + to_be_lynched + ' has been lynched!</h5></div></div>'

                    await sleep(3000)
                    sunset()
                    document.getElementById("game_div_title").innerHTML = "Night Falls"
                    document.getElementById("game_div_body").innerHTML = ""
                    day = false;
                    await sleep(4000)
                    reset()
                    socket.emit('start_new_round', { 'username': game_users[0].username, 'channel': window.location.pathname.substr(1) });

                } else {
                    console.log("Game over from a day win")
                    game_over()
                }
            }
        }
    });

    socket.on('remove_player', function (_username) {
        // first check if the removed player was a werewolf, if so, decrement number of werewolves
        // then check to see if the removed user was under cupids influence, if so remove both. If player removed is the hunter give them a chance to kill 
        // a perosn of their choosing.
        console.log(roles[_username])
        if (roles[_username] == "Werewolf") {
            remove_user(werewolves, _username)
        } else if (roles[_username] == "Hunter" && _username == username && day) {// if the killed person is a hunter and the client is the hunter
            draw_table("hunter")
        }
        if (cupid_votes.includes(_username)) {
            if (cupid_votes[0] == _username) {
                cupid_votes.splice(0, 1);
            } else {
                cupid_votes.splice(1, 1);
            }
            
            document.getElementById("game_div_body").innerHTML += '<div class="card" style="width: 18rem;"><img src="../static/images/Heart.png" class="card-img-top" alt="heart"><div class="card-body"><h5 class="card-title">' + 'Overcome with grief by the loss of ' + _username + ', ' + cupid_votes[0] + ' killed themself!</h5></div></div>'
            remove_user(game_users, _username)
            if (roles[cupid_votes[0]] == "Werewolf") {
                remove_user(werewolves, cupid_votes[0])
            }
            remove_user(game_users, cupid_votes[0])
        } else {
            remove_user(game_users, _username)
        }
    });

    socket.on('were_choice', function (data) {
        // First check if the username has already voted, if so remove their previous vote
        // Then create an object and push it to the werewolf array, if the user is a Werewolf redraw the table cell with the updated markers.
        // If all the werewoles agree, i.e. most_voted has len 1, then see the output value as that choice. This will let the next player have their turn.
        for (var i = 0; i < were_choice.length; i++) {
            if (were_choice[i].username == data['username']) {
                if (roles[username] == "Werewolf") {
                    elements[were_choice[i].choice].innerHTML = '<br>' + game_users[were_choice[i].choice].username + show_votes_f(-1, elements[were_choice[i].choice].innerHTML);
                    elements[were_choice[i].choice].innerHTML += "<input type='hidden' value='" + were_choice[i].choice + "'>";
                }
                were_choice.splice(i, 1);
            }
        }
        obj = {
            'username': data['username'],
            'choice': data['vote']
        }
        were_choice.push(obj)
        if (roles[username] == "Werewolf") {
            elements[obj.choice].innerHTML = '<br>' + game_users[obj.choice].username + show_votes_f(1, elements[obj.choice].innerHTML);
            elements[obj.choice].innerHTML += "<input type='hidden' value='" + obj.choice + "'>";

        }
        var were_agree = most_voted(were_choice.map(a => a.choice))

        if (were_choice.length == werewolves.length && were_agree.length == 1) {
            werewolf_overall_choice = were_agree
            document.getElementById('vote_table').innerHTML = "";
        }

    });


    socket.on('cupid_vote', function (vote) {
        cupid_votes.push(vote)
    });

    socket.on('doctor_choice', function (vote) {
        doctor_choice = vote
    });

    socket.on('set_roles', function (data) {
        // This is the first function called in a game so does more than just sets roles. Displays the countdown and resets all tracker values
        reset()
        cupid_votes = [];
        removed_roles = []; // only needs to be reset on new game not new round

        roles = data['role_dict']
        werewolves = data['werewolves']
        game_users = [...users]
        console.log(data)
        sunset()
        document.getElementById('vote_table').innerHTML = "";
        document.getElementById("online_div").style.display = "none";
        document.getElementById("game_div").style.display = "none";

        document.getElementById("username").innerHTML = '<span style="font-weight:bold;float:left;font-family: "Times New Roman", Times, serif;width:50%;">' + username + '</span><span style="font-weight:bold;float: right;font-family: "Times New Roman", Times, serif;">' + roles[username] + '</span>';
        runAnimation();



    
    });

    function resetDOM() {
        nums.forEach(num => {
            num.classList.value = '';
        });

        nums[0].classList.add('in');
    }

    function runAnimation() {
        // based on https://codepen.io/FlorinPop17/pen/LzYNWa
        document.getElementById("counter").style.display = "";
        nums.forEach((num, idx) => {
            const penultimate = nums.length - 1;
            num.addEventListener('animationend', (e) => {
                if (e.animationName === 'goIn' && idx !== penultimate) {
                    num.classList.remove('in');
                    num.classList.add('out');
                } else if (e.animationName === 'goOut' && num.nextElementSibling) {
                    num.nextElementSibling.classList.add('in');
                } else {
                    document.getElementById("counter").style.display = "none";
                    document.getElementById("game_div").style.display = "";
                    document.getElementById("game_div_title").innerHTML = "You are";
                    document.getElementById("game_div_body").innerHTML = '<div class="card" style="width: 18rem;"><img src="../static/images/' + roles[username] + '.png" class="card-img-top" alt="werewolf"><div class="card-body"><h5 class="card-title">' + roles[username] + '</h5></div></div>'
                    resetDOM()
                }
            });
        });
    }


    socket.on('show_werewolves', function () {
        // If the user is a werewolf show them all the werewolves, else show that the werewolves are looking
        document.getElementById("game_div_title").innerHTML = "Werewolves";
        // document.getElementById("game_div").style.display = "";
        if (roles[username] == "Werewolf") {
            var k = '<div class="row">'
            for (werewolf of werewolves) {
                k += '<div class="card" style="width: 18rem;"><img src="../static/images/Werewolf.png" class="card-img-top" alt="werewolf"><div class="card-body"><h5 class="card-title">' + werewolf + '</h5></div></div>'
            }
            k += '</div>'
            document.getElementById("game_div_body").innerHTML = k;

        } else {
            document.getElementById("game_div_body").innerHTML = "Werewolves open your eyes"
        }

    });


    socket.on('day_cycle', function () {
        // Tell the users to discuss and start a 5 minute timer with countdown bar. Also adds a button to allow them to vote before the 5 mins. If the button is clicked,
        // alert all users, cancel the 5 minute timer, if the user is still in the game allow them to vote.
        socket.on('vote_now', function () {
            clearTimeout(timer);
            document.getElementById("vote_table").innerHTML = ""
            document.getElementById("game_div_title").innerHTML = "Vote";
            document.getElementById("game_div_body").innerHTML = ""
            document.getElementById("progressbar").style.display = "none";
            if (check_username(game_users, username)) {
                draw_table("day")
            }
        });
        day = true;
        document.getElementById("vote_table").innerHTML = ""
        document.getElementById("game_div_title").innerHTML = "Discuss";
        document.getElementById("game_div_body").innerHTML = "<p>You have 5 mins to decide who to lynch</p><br>"
        b = document.createElement("button");
        b.setAttribute("id", "vote_now_button")
        b.setAttribute("class", "'btn btn-secondary'")
        b.onclick = function () {
            vote_now();
        }
        b.innerHTML = 'Vote Now';
        document.getElementById("game_div_body").appendChild(b)
        document.getElementById("progressbar").style.display = "";
        updateProgress()

        let timer = setTimeout(function () {
            document.getElementById("game_div_title").innerHTML = "Vote";
            document.getElementById("progressbar").style.display = "none";
            document.getElementById("game_div_body").innerHTML = "";
            if (check_username(game_users, username)) {
                draw_table("day")
            }
        }, 300000)



    });


    socket.on('hunter_choice', async function (vote) {
        console.log(game_users[vote])
        document.getElementById("game_div_body").innerHTML += "<br>Cornered the hunter fires off an arrow, it strikes " + game_users[vote].username + " killing them!<br>"
        socket.emit('remove_player', { 'username': game_users[vote].username, 'channel': window.location.pathname.substr(1) });
        await sleep(3000)
    });

    socket.on('cupids_turn', function () {
        turn("Cupid", "Cupids arrow is on its way")
    });

    socket.on('seers_turn', function () {
        turn("Seer", "Seer is peering")
    });


    socket.on('doctors_turn', function () {
        turn("Doctor", "Doctor may be performing a miracle")

    });


    socket.on('werewolves_turn', function () {
        turn("Werewolf", "Werewolves are choosing their next meal")

    });

    socket.on('seer_done', function () {
        seer_done = true;

    });

    socket.on('outcome_turn', function () {
        sunrise()
        outcome()
    });


    $('#start_button').on('click', start_game);

    async function start_game() {
        // The user that clicks start will run the first game interation off their client. Starts the game then waits 10 seconds to run animations and show user their role.
        if (users.length >= 6 && users.length <=20) {
            socket.emit('game_start', { 'users': users, 'channel': window.location.pathname.substr(1) });
            await sleep(10000)
            socket.emit('turn', { 'channel': window.location.pathname.substr(1), 'turn': 'show_werewolves' });
            await sleep(10000)
            console.log("Cupids values" + cupid_votes)
            socket.emit('turn', { 'channel': window.location.pathname.substr(1), 'turn': 'cupid' });
            await progress("cupid", 35)
            night()
        } else {
            alert("Game Requires 6 - 20 people!")
        }
    };

    function turn(role, body) {
        // If the user is the given role, show a vote table, otherwise show the given message.
        document.getElementById("game_div_title").innerHTML = role;
        document.getElementById("game_div").style.display = "";
        if (roles[username] == role && check_username(game_users, username)) {
            document.getElementById("game_div_body").innerHTML = ""
            draw_table(role.toLowerCase())

        } else {
            document.getElementById("game_div_body").innerHTML = body
            document.getElementById("vote_table").innerHTML = ""// removing voting table for all users not seer, this is to stop voting after being timed out
        }

    }

    function show_votes_f(upOrDown, inner_html) {
        // count how many empty circles, then work aout how many full circles. If depending on upOrDown change empty circles count, then return the string with the new 
        // amounts of emojis.
        var output = ""
        var empty = "\u26AA"
        var full = "&#128308"
        var count_empty = (inner_html.match(/\u26AA/g) || []).length - upOrDown;
        var count_full = werewolves.length - count_empty
        output += full.repeat(count_full) + empty.repeat(count_empty)
        return '<br>' + output

    }

    function vote_now() {
        socket.emit('vote_now', { 'channel': window.location.pathname.substr(1) });
    }

    function check_username(obj, name) {
        for (var i = 0; i < obj.length; i++)
            if (obj[i].username == name) {
                return true
            }
        return false
    }

    function most_voted(votes) {
        counts = {}
        for (var i = 0; i < votes.length; i++) {
            if (votes[i] in counts) {
                counts[votes[i]] += 1
            } else {
                counts[votes[i]] = 1
            }
        }
        var keys = Object.keys(counts);
        var largest = Math.max.apply(null, keys.map(x => counts[x]));
        var result = keys.reduce((result, key) => { if (counts[key] === largest) { result.push(key); } return result; }, []);
        return result
    }


    function draw_table(state) {
        // show votes will be added to all cells, if the state is werewolf then emojis will be added, otherwise the empty string will be added.
        // Loop through the game users and create a clickable table that is 2 wide, depending on the state clicking will have different behaviour.
        // There is a hidden input with each cell to determine which index was clicked.

        // Day will send the vote then hide the table, allowing only one vote.
        // cupids waits for two votes before hding the table and doesnt allow vote changing. 
        // Seer will show the seer the role of who they pick then wait 5 seconds before alerting all users that seer turn is done.
        // Doctor, werewolf work like day vote


        elements = []
        document.getElementById('vote_table').innerHTML = "";
        var show_votes = "";
        if (state == "werewolf") {
            show_votes += "<br>"
            for (var num of werewolves) {
                show_votes += "\u26AA"
            }
        }
        for (var j = 0; j < game_users.length; j++) {

            if (j % 2 == 0) {
                row = document.createElement("tr");
                row.setAttribute('id', 'row' + (j / 2).toString())
                document.getElementById('vote_table').appendChild(row);
            }
            b = document.createElement("td");
            b.setAttribute("class", "guess")
            b.innerHTML = '<br>' + game_users[j].username + show_votes;
            b.innerHTML += "<input type='hidden' value='" + j + "'>";
            b.addEventListener("click", async function (e) {
                // insert the value from the autocomplete text field:
                value = this.getElementsByTagName("input")[0].value;

                if (state == "day") {
                    socket.emit('vote', { 'vote': game_users[value].username, 'channel': window.location.pathname.substr(1), "state": "group" });
                    document.getElementById('vote_table').innerHTML = "";

                } else if (state == "cupid") {
                    socket.emit('vote', { 'vote': game_users[value].username, 'channel': window.location.pathname.substr(1), "state": state });
                    elements[value].style.backgroundColor = '#f542dd';
                    if (cupid_votes.length == 1) {// want to to close when length is 2, so close when this is 1, then the second vote is added
                        document.getElementById('vote_table').innerHTML = "";
                    }

                } else if (state == "seer") {
                    document.getElementById("game_div_title").innerHTML = game_users[value].username
                    document.getElementById("game_div_body").innerHTML = '<div class="card" style="width: 18rem;"><img src="../static/images/' + roles[game_users[value].username] + '.png" class="card-img-top" alt="werewolf"><div class="card-body"><h5 class="card-title">' + roles[game_users[value].username] + '</h5></div></div>'
                    document.getElementById('vote_table').innerHTML = "";
                    await sleep(5000)
                    socket.emit('seer_done', { 'channel': window.location.pathname.substr(1) });

                } else if (state == "doctor") {
                    socket.emit('vote', { 'vote': value, 'channel': window.location.pathname.substr(1), "state": state });
                    document.getElementById('vote_table').innerHTML = "";
                }
                else if (state == "hunter") {
                    if (roles[game_users[value]] != "Hunter") {
                        socket.emit('vote', { 'vote': value, 'channel': window.location.pathname.substr(1), "state": state });
                        document.getElementById('vote_table').innerHTML = "";
                    }

                } else if (state == "werewolf") {
                    socket.emit('vote', { 'vote': value, 'channel': window.location.pathname.substr(1), "state": state, 'username': username });
                }

            });
            elements.push(b)
            document.getElementById('row' + Math.floor(j / 2).toString()).appendChild(b);

        }
    }

    var lock = false;
    async function night() {
        // Locked so it may only be run once, runs through each role giving them time to vote then progresses to daytime. If the role is already dead, allots
        // a random amount of time to give the appearance of the role still being in the game.
        if (!lock) {
            lock = true;
            werewolf_overall_choice = null;
            document.getElementById('vote_table').innerHTML = "";
            socket.emit('turn', { 'channel': window.location.pathname.substr(1), 'turn': 'werewolf' });
            // if werewolves dont choose someone then game ends, other roles are able to abstain from voting
            await progress("werewolf", 100)
            if (werewolf_overall_choice) {
                document.getElementById('vote_table').innerHTML = "";
                socket.emit('turn', { 'channel': window.location.pathname.substr(1), 'turn': 'seer' });
                if (removed_roles.includes("Seer")) {
                    await sleep(Math.floor(Math.random() * 15000) + 5000)
                } else {
                    await progress("seer", 35)
                }

                document.getElementById('vote_table').innerHTML = "";
                socket.emit('turn', { 'channel': window.location.pathname.substr(1), 'turn': 'doctor' });
                if (removed_roles.includes("Doctor")) {
                    await sleep(Math.floor(Math.random() * 10000) + 5000)
                } else {
                    await progress("doctor", 35)
                }


                socket.emit('turn', { 'channel': window.location.pathname.substr(1), 'turn': 'outcome' });
            } else {
                console.log("Game over from werewolves not voting")
                game_over()

            }
            lock = false;

        }
    }

    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
    async function progress(state, time_out) {
        // given a total time, this function will sleep for a second then check if the condition had been met. The while loop while end if the condition is met, ie perosn voted
        // or is timed out
        var flag = null;
        var i = 0
        while (i < time_out && !flag) {
            if (state == 'werewolf') {
                flag = werewolf_overall_choice;
            } else if (state == "seer") {
                flag = seer_done;
            } else if (state == "doctor") {
                flag = doctor_choice;
            } else if (state == "cupid") {
                flag = (cupid_votes.length == 2)
            }

            await sleep(1000);
            i++;
        }
    }


    function reset() {
        werewolf_overall_choice = null;
        doctor_choice = null;
        seer_done = false;
        votes = [];
        were_choice = [];
    }
    async function outcome() {
        // Two outcomes from a night turn, either the werewolves killed someone or the doctor saved them. If the game conditions are still met after this turn this function will 
        // continue the game
        document.getElementById("game_div_title").innerHTML = "Day break!"
        if (werewolf_overall_choice != doctor_choice) {
            document.getElementById("game_div_body").innerHTML = '<div class="card" style="width: 18rem;"><img src="../static/images/Grave.png" class="card-img-top" alt="grave"><div class="card-body"><h5 class="card-title">' + game_users[werewolf_overall_choice].username + ' was brutally mauled to death last night</h5></div></div>'
            socket.emit('remove_player', { 'username': game_users[werewolf_overall_choice].username, 'channel': window.location.pathname.substr(1) });
        }
        else {
            document.getElementById("game_div_body").innerHTML = game_users[werewolf_overall_choice].username + " was attacked last night, but the doctor managed to save them"
        }

        await sleep(5000)
        if (werewolves.length > 0 && (2 * werewolves.length < game_users.length)) {
            socket.emit('turn', { 'channel': window.location.pathname.substr(1), 'turn': 'day' });
        } else {
            console.log("Game over from a night win")
            game_over()
        }


    }

    function remove_user(obj, _username) {
        removed_roles.push(roles[_username])
        for (var i = 0; i < obj.length; i++) {
            if (obj[i].username == _username) {
                obj.splice(i, 1);
            }
            if (obj[i] == _username) {
                obj.splice(i, 1);
            }
        }

    }


    function game_over() {
        document.getElementById("online_div").style.display = ""
        document.getElementById("game_div_title").innerHTML = "Game Over!"
        if (werewolves.length < 1) {
            document.getElementById("game_div_body").innerHTML = "Congrats, all werewolves eliminated<br>";
        } else {
            document.getElementById("game_div_body").innerHTML = "The werewolves have taken over<br>";
        }
    }

    var updateLock = true;
    async function updateProgress() {
        if (updateLock) {
            updateLock = false;

            socket.on('stop_progress_bar', function () {
                ix = 1
            });
            for (var ix = 100; ix >= 0; ix--) {
                document.getElementById("innerBar").style.width = ix + "%";
                await sleep(3000)
            }
            updateLock = true;
        }

    }

    document.getElementById('game_url').innerHTML = window.location.pathname.split("/")[2];
});



