$(document).ready(function () {
    var socket = io.connect("");
    var game_settings = undefined;
    var chosen_cards = []
    var submitted_cards = []
    var cards_needed = 0
    // =================================================================================================== \\
    // Game Setup start
    CAH = ['Absurd Box Expansion', 'Black Box Press Kit', 'CAH Base Set', 'CAH : Second Expansion', 'CAH : Third Expansion', 'CAH: 2000s Nostalgia Pack', 'CAH: A.I. Pack', 'CAH: Ass Pack', 'CAH: Blue Box Expansion', 'CAH: Box Expansion', 'CAH: Canadian Conversion Kit', 'CAH: College Pack', 'CAH: Fifth Expansion', 'CAH: First Expansion', 'CAH: Fourth Expansion', 'CAH: Green Box Expansion', 'CAH: Hidden Gems Bundle: A Few New Cards We Crammed Into This Bundle Pack (Amazon Exclusive)', 'CAH: Human Pack', 'CAH: Procedurally-Generated Cards', 'CAH: Red Box Expansion', 'CAH: Sixth Expansion', 'CAH: UK Conversion Kit', 'Cards Against Humanity Saves America Pack', 'Dad Pack', 'Desert Bus For Hope Pack', 'Fantasy Pack', 'Fascism Pack', 'Food Pack', 'Geek Pack', 'Gen Con 2018 Midterm Election Pack', 'Hanukkah LOL Pack', 'Hidden Compartment Pack', 'House of Cards Pack', 'Humanity Hates Trump: Expansion Pack 1', 'Jack White Show Pack', 'Jew Pack/Chosen People Pack', 'Mass Effect Pack', 'Period Pack', 'Pride Pack', 'Reject Pack', 'Reject Pack 2', 'Reject Pack 3', 'Retail Mini Pack', 'Retail Product Pack', 'Sci-Fi Pack', 'Science Pack', 'Seasons Greetings Pack', 'TableTop Pack', 'Theatre Pack', 'Theatre Pack - CATS Musical Pack', 'Trump Bug Out Bag/Post-Trump Pack', 'Vote For Hillary Pack', 'Vote For Trump Pack', 'Weed Pack', 'World Wide Web Pack', '2012 Holiday Pack', '2013 Holiday Pack', '2014 Holiday Pack', '90s Nostalgia Pack']

    TPC = ['Bad Hombres Against Fake News Pack 1', 'Blurbs Against Buffalo', 'Cakes Athirst Hilarity Volume 1', 'Cakes Athirst Hilarity Volume 2', 'Cakes Athirst Hilarity Volume 3', 'Cakes Athirst Hilarity Volume 4', 'Carbs of the Huge Manatee - Kink Expansion 1', 'Carbs of the Huge Manatee - Online Dating Expansion 1', 'Carbs of the Huge Manatee: Dance Expansion 1', 'Carbs of the Huge Manatee: General Expansion 1', 'Carbs of the Huge Manatee: General Expansion 2', 'Carbs of the Huge Manatee: General Expansion 3', 'Cards About Toronto', 'Cards With No Sexuality', 'Cards and Punishment Vol. One', 'Cards and Punishment Vol. Two', 'Carps & Angsty Manatee - Texas Edition', 'Carps & Angsty Manatee - Volume 1', 'Carps & Angsty Manatee - Volume 2', 'Cats Abiding Horribly Bonus Cards', 'Cats Abiding Horribly Bonus Cards 2', 'Cats Abiding Horribly: Episode I - The Dirty Goblin', 'Cats Abiding Horribly: Episode II - A New Low', 'Cats Abiding Horribly: Episode III - The SJWs Strike Back', 'Charlie Foxtrot', 'Clams Attempt Harmonica, Volume 1', 'Clones Attack Hilarity #1', 'Clones Attack Hilarity #2', 'Cocks Abreast Hostility - Cock Pack Two: Fowls Deep', 'Cocks Abreast Hostility: Cock Pack One: Just The Tip', 'Cols Against Kentucky 2', 'Cols Despite Kentucky', 'Cows Against Hamburgers - Patty Pack #1', 'Crabs Adjust Humidity: Volume 1', 'Crabs Adjust Humidity: Volume 2', 'Crabs Adjust Humidity: Volume 3', 'Crabs Adjust Humidity: Volume 4', 'Crabs Adjust Humidity: Volume 5', 'Crabs Adjust Humidity: Volume 6', 'Crabs Adjust Humidity: Volume 7', 'Crazy & Horrible Rabbit - Vol. 1', 'Crows Adopt Vulgarity, Vol. 1', 'Crows Adopt Vulgarity, Vol. 2', 'Crows Adopt Vulgarity, Vol. 3', 'Crows Adopt Vulgarity, Vol. 4', 'Guards Against Insanity, Edition 1', 'Guards Against Insanity, Edition 2', 'Guards Against Insanity, Edition 3', 'Guards Against Insanity, Edition 4', 'Guards Against Insanity, Edition 5', 'JadedAid: A Card Game to Save Humanitarians', 'JadedAid: Peace Corps Expansion Pack', 'KinderPerfect (Commercial Set)', 'KinderPerfect: A Timeout For Parents (Kickstarter Set)', 'KinderPerfect: More Expansion Pack', 'KinderPerfect: Naughty Expansion Pack', 'KinderPerfect: Tween Expansion Pack', 'Knitters Against Swatches First Edition', 'Knitters Against Swatches Second Edition', 'Pigs Against Profanity: Volume 1', 'Pigs Against Profanity: Volume 2', 'Pigs Against Profanity: Volume 3', 'The Worst Card Game: 2016 National Edition', 'The Worst Card Game: Colorado Edition', "Voter's Choice: The First Expansion", "Voter's Choice: The Fourth Expansion", "Voter's Choice: The Second Expansion", "Voter's Choice: The Third Expansion", 'Words Against Morality: Volume 1', 'Words Against Morality: Volume 2', 'Words Against Morality: Volume 3', 'Words Against Morality: Volume 4']

    standAlone = [' 2016 Election Game ', 'Babies vs. Parents', 'Bad Campaign, The Presidential Party Game!', 'Bards Dispense Profanity', 'Cads About Maternity - A game for bad mommies', 'Cads About Matrimony', 'Cads About Matrimony Poly Pack', 'Cads About Matrimony: Expansion 1', 'Cads Against Adulting', 'Cards Against Profanity', 'Cards Against/For South Africa', 'Cards for the Masses', 'Conspiracy Theory', 'Conspiracy Theory - Kickstarter Bonus Cards Pack', 'Cows Grilling Hamburgers - Patty Pack #1', 'Depravity', 'Dick', 'Dirty Nasty Filthy', 'Disgruntled Decks: Air Force Edition', 'Disgruntled Decks: Army Edition', 'Disgruntled Decks: Coast Guard/Coastie Edition', 'Disgruntled Decks: Marine Corps/Jarhead Edition', 'Disgruntled Decks: Navy Edition', 'Evil Apples', 'Fun in the Oven', 'Hilarious!', 'Humanity Hates The Holidays', 'Humanity Hates Trump: Base Set', 'Humanity Hates Trump: Expansion Pack 2 - Humanity Hates Hillary, Too', 'Humanity Hates Trump: Kickstarter Promo Cards', 'Humanity Hates the Holidays "Love" Edition', 'Kids Against Maturity', 'Kids Create Absurdity', 'Kiwis Against Morality', 'Kiwis Versus Morality', 'Not Parent Approved', 'Not Parent Approved Expansion Pack #1', 'Not Parent Approved Expansion Pack #2', 'Personally Incorrect', 'Personally Incorrect - Expansion 2 [Yellow Box]', 'Personally Incorrect - Expansion [Red Box]', 'Potheads Against Sanity', 'Rotten Apples: The Tasteless Adult Party Game', 'Skewered And Roasted', "That's What She Said Game", "That's What She Said Game - First Expansion", "That's What She Said Game - Second Expansion", 'The Catholic Card Game: Base Deck', 'The Catholic Card Game: Five Deck Expansion Pack', 'The Catholic Card Game: Generations Expansion Pack', 'The Catholic Card Game: Life Teen Expansion Pack', 'The Game Without Decency', 'Trumped UpCards: Alternative Facts Expansion Pack', 'Trumped UpCards: Astonishlingly Excellent Wealthcare! Expansion Pack', 'Trumped UpCards: Many Sides  Expansion Pack', "Trumped UpCards: The World's Biggest Deck*", 'WTF Did You Say?!?']

    PAX = ['PAX 2010 "Oops" Kit', 'PAX East 2013 Promo Pack B', 'PAX East 2013 Promo Pack C', 'PAX East 2014', 'PAX East 2014 - Panel Cards', 'PAX Prime 2013', 'PAX Prime 2014 - Panel Cards', 'PAX Prime 2014 Custom Printed Cards', 'PAX Prime 2015 Food Pack A (Mango)', 'PAX Prime 2015 Food Pack B (Coconut)', 'PAX Prime 2015 Food Pack C (Cherry)', 'Pax East 2013 Promo Pack A']

    cast_conv = {
        'CAH: First Expansion': 'HUM', 'CAH : Second Expansion': 'OHS', 'PAX East 2014 - Panel Cards': 'I4D', 'The Catholic Card Game: Generations Expansion Pack': 'OO9', ' 2016 Election Game ': '8WV', 'Carps & Angsty Manatee - Texas Edition': 'XVG', 'Pax East 2013 Promo Pack A': 'ZJ1', 'Knitters Against Swatches First Edition': 'Q5X', 'Geek Pack': '1FC', 'Carps & Angsty Manatee - Volume 2': '713', 'Guards Against Insanity, Edition 2': 'DNR', 'Cads About Matrimony': 'WPI', 'Babies vs. Parents': '6RX', 'CAH: Procedurally-Generated Cards': 'N1V', 'World Wide Web Pack': 'OC8', 'Reject Pack': 'SFK', "Voter's Choice: The Third Expansion": '77C', 'Crabs Adjust Humidity: Volume 6': 'HHA', 'Crabs Adjust Humidity: Volume 1': 'NUL', 'Clones Attack Hilarity #2': 'Z5H', 'Cocks Abreast Hostility - Cock Pack Two: Fowls Deep': '0LT', 'Kids Create Absurdity': '019', 'WTF Did You Say?!?': 'WM0', 'Humanity Hates the Holidays "Love" Edition': '068', 'Fascism Pack': 'XSH', 'Words Against Morality: Volume 2': 'BMT', 'Potheads Against Sanity': 'FQP', 'Hilarious!': 'L1Z', 'Not Parent Approved': 'LI2', 'Black Box Press Kit': '003', 'Carbs of the Huge Manatee - Kink Expansion 1': 'OXU', 'Trumped UpCards: Astonishlingly Excellent Wealthcare! Expansion Pack': 'VA5', 'PAX Prime 2014 - Panel Cards': 'ZWB', 'Personally Incorrect - Expansion 2 [Yellow Box]': 'HJD', 'Reject Pack 2': 'ADM', 'Words Against Morality: Volume 4': '3RA', 'Cows Grilling Hamburgers - Patty Pack #1': '0TF', 'Humanity Hates Trump: Expansion Pack 2 - Humanity Hates Hillary, Too': '2H0', 'Kiwis Against Morality': 'MCQ', 'Kiwis Versus Morality': 'NM5', 'Dick': 'ROF', 'Cards Against/For South Africa': '24J', 'Disgruntled Decks: Navy Edition': 'GER', 'The Game Without Decency': 'NLM', 'CAH: Box Expansion': '25V', 'Dad Pack': '50G', '2013 Holiday Pack': 'GYP', '2014 Holiday Pack': '9AZ', 'PAX Prime 2015 Food Pack A (Mango)': 'MG7', 'Retail Mini Pack': 'TVD', 'Skewered And Roasted': '4E7', 'Cats Abiding Horribly Bonus Cards': 'KDH', 'Conspiracy Theory - Kickstarter Bonus Cards Pack': 'BMG', 'Absurd Box Expansion': '70M', 'Cads About Maternity - A game for bad mommies': 'YQE', 'Vote For Trump Pack': 'G3V', 'Humanity Hates Trump: Base Set': 'KNZ', 'Cats Abiding Horribly: Episode I - The Dirty Goblin': 'C8B', 'PAX Prime 2014 Custom Printed Cards': '0PJ', 'Cards Against Profanity': 'EXA', 'KinderPerfect: Naughty Expansion Pack': 'EGM', '2012 Holiday Pack': 'VSJ', 'JadedAid: A Card Game to Save Humanitarians': 'KBA', 'Crabs Adjust Humidity: Volume 7': '7YC', 'CAH: Blue Box Expansion': 'QXP', 'Bad Hombres Against Fake News Pack 1': '3F6', 'Cats Abiding Horribly: Episode II - A New Low': 'YL1', 'The Catholic Card Game: Five Deck Expansion Pack': 'YDS', 'Carbs of the Huge Manatee: Dance Expansion 1': 'RKQ', 'Charlie Foxtrot': 'PAX', 'Crabs Adjust Humidity: Volume 3': '9SO', 'Retail Product Pack': 'PLN', 'Cards With No Sexuality': '7K6', 'The Catholic Card Game: Base Deck': '5IW', 'Crows Adopt Vulgarity, Vol. 3': 'MIU', 'Kids Against Maturity': '9R2', 'PAX East 2014': '7RE', 'Personally Incorrect - Expansion [Red Box]': 'XHG', 'PAX East 2013 Promo Pack B': 'QLG', 'Crazy & Horrible Rabbit - Vol. 1': '3EN', 'Cads Against Adulting': 'CNH', 'Clams Attempt Harmonica, Volume 1': 'DHX', "That's What She Said Game - Second Expansion": 'PRU', 'Disgruntled Decks: Army Edition': 'XNT', 'CAH : Third Expansion': 'F3G', 'Guards Against Insanity, Edition 1': 'D0S', 'Depravity': 'UPL', 'Humanity Hates Trump: Kickstarter Promo Cards': 'QPI', 'Cols Against Kentucky 2': 'IST', 'Clones Attack Hilarity #1': '7MK', 'Pigs Against Profanity: Volume 2': 'EBJ', 'Disgruntled Decks: Marine Corps/Jarhead Edition': 'U6F', 'PAX Prime 2015 Food Pack C (Cherry)': 'MEE', 'CAH: Human Pack': '8JQ', 'Cards for the Masses': '8TT', 'PAX Prime 2015 Food Pack B (Coconut)': 'BYB', 'Guards Against Insanity, Edition 4': 'P0P', 'Carps & Angsty Manatee - Volume 1': 'JLM', 'Not Parent Approved Expansion Pack #1': 'FXZ', 'TableTop Pack': 'NKN', 'Pigs Against Profanity: Volume 3': 'PWT', 'Fantasy Pack': '8RE', 'Period Pack': 'LID', 'Cows Against Hamburgers - Patty Pack #1': '4ZW',
        'Dirty Nasty Filthy': 'KNQ', 'Conspiracy Theory': 'L1Q', 'CAH Base Set': '8EJ', 'CAH: Fifth Expansion': 'PAJ', 'Crows Adopt Vulgarity, Vol. 2': 'KT2', 'Trumped UpCards: Alternative Facts Expansion Pack': '497', 'PAX 2010 "Oops" Kit': 'OSW', 'Cats Abiding Horribly: Episode III - The SJWs Strike Back': 'DRY', 'Reject Pack 3': 'VQW', 'Words Against Morality: Volume 1': 'FSS', 'Guards Against Insanity, Edition 5': 'XKB', 'CAH: Red Box Expansion': '0A8', "That's What She Said Game - First Expansion": '15H', 'Cakes Athirst Hilarity Volume 4': '959', 'CAH: Fourth Expansion': '77E', 'JadedAid: Peace Corps Expansion Pack': '12O', 'Cakes Athirst Hilarity Volume 3': '2OF', "Voter's Choice: The First Expansion": 'A1U', 'Weed Pack': '2YX', 'Desert Bus For Hope Pack': '9RN', 'Hanukkah LOL Pack': 'BCV', 'CAH: Green Box Expansion': 'G0W', 'Vote For Hillary Pack': 'JQU', 'CAH: Sixth Expansion': 'MR5', 'Crabs Adjust Humidity: Volume 5': 'UJZ', 'Sci-Fi Pack': '12X', 'CAH: Canadian Conversion Kit': 'PUQ', 'House of Cards Pack': '1J1', 'KinderPerfect: A Timeout For Parents (Kickstarter Set)': '298', '90s Nostalgia Pack': 'D4H', 'Food Pack': 'W5Q', 'CAH: Hidden Gems Bundle: A Few New Cards We Crammed Into This Bundle Pack (Amazon Exclusive)': 'IE9', 'Cards and Punishment Vol. Two': '8IC', 'Trump Bug Out Bag/Post-Trump Pack': 'YQU', 'PAX East 2013 Promo Pack C': 'WRX', 'PAX Prime 2013': 'PF8', 'CAH: A.I. Pack': '6NT', 'KinderPerfect: Tween Expansion Pack': 'PZZ', 'Jew Pack/Chosen People Pack': 'EMV', 'Personally Incorrect': 'YTV', 'Fun in the Oven': 'PHB', "That's What She Said Game": 'V3H', 'Rotten Apples: The Tasteless Adult Party Game': 'ROT', 'Knitters Against Swatches Second Edition': 'QFE', 'KinderPerfect: More Expansion Pack': 'DDY', 'Theatre Pack - CATS Musical Pack': '9AU', 'Cards About Toronto': 'ASA', 'Cads About Matrimony: Expansion 1': 'DU1', "Voter's Choice: The Fourth Expansion": 'GCX', 'The Worst Card Game: Colorado Edition': 'HQH', 'Hidden Compartment Pack': 'AW9', 'Theatre Pack': 'RXY', 'Crows Adopt Vulgarity, Vol. 4': '0RD', 'Evil Apples': 'P4Y', 'Pigs Against Profanity: Volume 1': 'G4K', 'Pride Pack': '6YJ', 'Crabs Adjust Humidity: Volume 2': 'XBP', 'Seasons Greetings Pack': 'WAU', 'Crows Adopt Vulgarity, Vol. 1': '9FF', 'Gen Con 2018 Midterm Election Pack': 'VI3', 'Science Pack': 'QT1', 'Bad Campaign, The Presidential Party Game!': 'YJU', 'Cards Against Humanity Saves America Pack': 'HF4', 'Carbs of the Huge Manatee: General Expansion 1': 'HXT', "Trumped UpCards: The World's Biggest Deck*": 'N17', 'Cocks Abreast Hostility: Cock Pack One: Just The Tip': 'V94', 'Humanity Hates The Holidays': 'LMD', 'KinderPerfect (Commercial Set)': 'VKB', 'The Worst Card Game: 2016 National Edition': '4Z9', 'Not Parent Approved Expansion Pack #2': '25L', 'CAH: College Pack': 'ABM', 'Carbs of the Huge Manatee: General Expansion 2': '08W', 'Guards Against Insanity, Edition 3': '78I', 'Cakes Athirst Hilarity Volume 1': '9AD', 'Cats Abiding Horribly Bonus Cards 2': 'F30', 'Carbs of the Huge Manatee: General Expansion 3': 'PRA', 'Humanity Hates Trump: Expansion Pack 1': 'T4G', 'CAH: 2000s Nostalgia Pack': 'UQS', 'Bards Dispense Profanity': 'ALS', 'Disgruntled Decks: Coast Guard/Coastie Edition': '8D2', 'Crabs Adjust Humidity: Volume 4': '4UK', 'Cols Despite Kentucky': '1PL', 'Blurbs Against Buffalo': 'B21', 'The Catholic Card Game: Life Teen Expansion Pack': '6R2', 'Cads About Matrimony Poly Pack': 'BHW', "Voter's Choice: The Second Expansion": 'P03', 'Mass Effect Pack': 'G6Q', 'Jack White Show Pack': 'NLX', 'Words Against Morality: Volume 3': 'S8X', 'Trumped UpCards: Many Sides  Expansion Pack': 'IOV', 'Cards and Punishment Vol. One': 'F4R', 'Cakes Athirst Hilarity Volume 2': 'PJY', 'CAH: Ass Pack': 'ICC', 'Carbs of the Huge Manatee - Online Dating Expansion 1': 'OHV', 'CAH: UK Conversion Kit': 'I30', 'Disgruntled Decks: Air Force Edition': 'O8P'
    }
    var new_choices = []
    var remove_choices = []
    var choices = []
    var timer = undefined
    var username = undefined
    var round_winner = null
    var turn_timer = 80 //seconds

    $("#selectable").selectable().children().first().addClass('ui-selected');
    for (var i = 0; i < CAH.length; i++) {
        var node = document.createElement("li")
        node.setAttribute("class", "ui-widget-content")
        node.innerHTML = CAH[i]
        document.getElementsByClassName('casts')[0].appendChild(node)
    }

    Array.prototype.unique = function () {
        var a = this.concat();
        for (var i = 0; i < a.length; ++i) {
            for (var j = i + 1; j < a.length; ++j) {
                if (a[i] === a[j])
                    a.splice(j--, 1);
            }
        }

        return a;
    };

    function removeChoice(choice) {
        for (var i = 0; i < choices.length; i++) {
            if (choices[i] == choice) {
                choices.splice(i, 1);
            }
        }

    }

    $(".casts").selectable({
        stop: function () {
            new_choices = []
            $(".ui-selected", this).each(function () {
                cast = this.innerHTML;
                new_choices.push(cast);
            });
        }
    });

    $(function () {
        $(".cast_groups").selectable({
            stop: function () {
                document.getElementsByClassName('casts')[0].innerHTML = ""
                $(".ui-selected", this).each(function () {

                    group = this.innerHTML;
                    var lookup = { "Official": CAH, "Third Party": TPC, "Stand Alone": standAlone, "PAX": PAX }
                    for (var i = 0; i < lookup[group].length; i++) {
                        var node = document.createElement("li")
                        node.setAttribute("class", "ui-widget-content")
                        node.innerHTML = lookup[group][i]
                        document.getElementsByClassName('casts')[0].appendChild(node)
                    }
                });

            }
        });
    });

    $(".chosen").selectable({
        stop: function () {
            remove_choices = []
            $(".ui-selected", this).each(function () {
                cast = this.innerHTML;
                remove_choices.push(cast);
            });

        }
    });

    $('#choose').on('click', function () {
        choices = choices.concat(new_choices).unique();
        socket.emit('new_choices', { 'channel': window.location.pathname.substr(1), 'choices': choices });

    });

    $('#remove').on('click', function () {
        remove_choices.forEach(removeChoice)

        socket.emit('new_choices', { 'channel': window.location.pathname.substr(1), 'choices': choices });
    });

    $('#go').on('click', function () {
        game_casts = []

        choices.forEach(function (item) {
            game_casts.push(cast_conv[item])
        })
        if (game_casts.length > 0 && users.length > 2) {
            socket.emit('start_game_cah', { 'channel': window.location.pathname.substr(1), 'game_casts': game_casts, 'maxScore': $("#maxScore").val() ? parseInt($("#maxScore").val(), 10) : 4, 'blankPerc': $("#blankPerc").val() ? parseInt($("#blankPerc").val(), 10) : 0 });
            socket.emit('black_card', { 'channel': window.location.pathname.substr(1), 'casts': game_casts });
        } else {
            alert(users.length < 3 ? "Game requires at least 3 players" : "Please select at least one cast")
        }
    });

    $("#maxScore").change(function () {
        if ($("#maxScore").val() > 50) {
            $("#maxScore").val(50)
        } else if ($("#maxScore").val() < 1) {
            $("#maxScore").val(1)
        }
        socket.emit('new_settings', { 'channel': window.location.pathname.substr(1), 'maxScore': $("#maxScore").val(), 'blankPerc': "" });
    });
    $("#blankPerc").change(function () {
        if ($("#blankPerc").val() > 100) {
            $("#blankPerc").val(100)
        } else if ($("#blankPerc").val() < 0) {
            $("#blankPerc").val(0)
        }
        socket.emit('new_settings', { 'channel': window.location.pathname.substr(1), 'blankPerc': $("#blankPerc").val(), 'maxScore': "" });
    });


    socket.on('new_choices', function (data) {
        choices = data['choices'];
        document.getElementsByClassName('chosen')[0].innerHTML = ""
        for (var i = 0; i < choices.length; i++) {
            var node = document.createElement("li")
            node.setAttribute("class", "ui-widget-content")
            node.innerHTML = choices[i]
            document.getElementsByClassName('chosen')[0].appendChild(node)
        }
    });

    socket.on('new_settings', function (data) {
        if (data['maxScore']) {
            maxScore = data['maxScore']
            $("#maxScore").val(maxScore)
        }
        if (data['blankPerc']) {
            blankPerc = data['blankPerc']
            $("#blankPerc").val(blankPerc)
        }
    });

    socket.on('start_game_cah', function (data) {
        startScreen = false
        resetScoreboard()
        drawScore()
        nextCzar()
        $('#setup').css("display", "none")
        $('#game').css("display", "")
        $('#nextRound').css("display", "none")
        $('#confirm').css("display", "none")
        $('#submit').css('display', "")
        $('#wait').css('display', "none")
        $('#progressbar').css("display", "")
        updateProgress()
        if (checkCzar(username)) {
            $('#hand').css("display", "none")
            $('#submit').css('display', "none")

        } else {
            $('#hand').css("display", "")
        }
        $('#show').css("display", "none")
        game_settings = data
        console.log(game_settings)

        for (var i = 0; i < 10; i++) {
            socket.emit('white_card', { 'casts': game_settings['game_casts'] });
        }

    });



    socket.on('update_game_state', function (data) {
        if (game_settings == null) {
            game_settings = data['game_settings']
            for (var i = 0 ; i < users.length; i++){
                users[i].czar = false;
            }
            czar_index = data['czar_index']
            startScreen = false
            drawScore()
            $('#setup').css("display", "none")
            $('#game').css("display", "")
            $('#nextRound').css("display", "none")
            $('#confirm').css("display", "none")
            $('#submit').css('display', "none")
            $('#wait').css('display', "")
            if (checkCzar(username)) {
                $('#hand').css("display", "none")
                $('#submit').css('display', "none")

            } else {
                $('#hand').css("display", "")
            }
            $('#show').css("display", "none")
            for (var i = 0; i < 10; i++) {
                socket.emit('white_card', { 'casts': game_settings['game_casts'] });
            }
        }
        console.log(game_settings)
    });

    // Game Setup end
    // =================================================================================================== \\
    // Main Game start
    socket.on('connect', () => {
        socket.emit('join', { 'channel': window.location.pathname.substr(1) });
    });

    socket.on('black_card', function (data) {
        submitted_cards = []
        document.getElementById("black_card_place").innerHTML = ""
        document.getElementById("black_card_place").appendChild(black_card(data["text"], data["Set"], data['count']))
        cn_conv = { null: 1, "PICK 2": 2, "DRAW 2, PICK 3": 3, "PICK 1": 1 }
        cards_needed = cn_conv[data['count']]
        if (cards_needed == 3) {
            socket.emit('white_card', { 'casts': game_settings['game_casts'] });
            socket.emit('white_card', { 'casts': game_settings['game_casts'] });
        }
        timer = setTimeout(show_submitted, turn_timer*1000, 0)

    });

    socket.on('white_card', function (data) {
        var card = white_card(data['text'], data['Set'])
        card.innerHTML += "<input type='hidden' value='" + data['text'] + "'>";
        card.innerHTML += "<input type='hidden' value='" + data['Set'] + "'>";
        card.addEventListener("click", function () {
            var value = this.getElementsByTagName("input")[0].value;
            var cast = this.getElementsByTagName("input")[1].value;
            if (check_obj(chosen_cards, value)) {
                remove_card(chosen_cards, value);

            } else {
                chosen_cards.push({ "text": value, "username": username, "element": this, "Set": cast })
            }
            this.classList.toggle("selected");

        })
        document.getElementById("hand").appendChild(card)
    });
    var ix = 100
    socket.on("submitted_card", function (data) {
        alreadyVoted.push(data[0].username)
        drawScore()
        submitted_cards.push(data)
        if (submitted_cards.length == users.length - 1 - players_joined_midround) {
            clearTimeout(timer)
            show_submitted(0)
            $('#progressbar').css("display", "none")
            ix = 1
        }
    });

    var temp = 0
    socket.on("show_next_card", function (data) {
        temp += 1
        show_submitted(temp)
        if (temp >= submitted_cards.length - 1) {// if only one card submitted this would break, should be fixed now
            $('#show').css("display", "none")
            if (checkCzar(username)) {
                $('#confirm').css("display", "")
            }

        }
    });

    socket.on("start_new_round_cah", function (data) {
        nextCzar()
        temp = 0
        round_winner = null
        players_joined_midround = 0
        $('#player_cards').empty()
        $('#submit').css('display', "")
        $('#nextRound').css("display", "none")
        $('#confirm').css("display", "none")
        $('#wait').css('display', "none")

        givePoint(data)
        var winner = findWinner(game_settings['maxScore'])
        if (winner) {
            game_over(winner)
        } else {
            if (!checkCzar(username)) {
                $('#hand').css("display", "")

            } else {
                $('#hand').css("display", "none")
                $('#submit').css('display', "none")
            }
            $('#show').css("display", "none")
            numOfCards = $("#hand .card").length
            while (numOfCards <= 10) {
                draw_white()
                numOfCards += 1;
            }
        }
        $('#progressbar').css("display", "")
        updateProgress()
    });

    function white_card(text, cast, text2 = "", text3 = "") {
        var node = document.createElement("DIV")
        node.setAttribute("class", "white card shadow rounded hoverable")

        node.innerHTML = '<span>' + text + '<hr class="mt-3 mb-3"/></span>' + (text2 ? '<span>' + text2 + '<hr class="mt-3 mb-3"/></span>' : "") + (text3 ? '<span>' + text3 + '<hr class="mt-3 mb-3"/></span>' : "") + '<div class="bottom"><span style="float: left;">' + cast + '</span></div></span></div>'
        return node
    }

    function blank_card() {
        html = '<input type="text" class="form-control" aria-label="blank" aria-describedby="basic-addon1">'
        return html
    }



    function black_card(text, cast, count) {
        if (count == null) {
            count = ""
        }
        var node = document.createElement("DIV")
        node.setAttribute("class", "black card shadow rounded")

        node.innerHTML = '<span id="card_text">' + text + '</span><div class="bottom"><span style="float: left;">' + cast + ' </span><span style="float: right;">' + count + '</span></div></div>'
        return node
    }

    function draw_blank() {
        var card = white_card(blank_card(), "")
        card.innerHTML += "<input type='hidden' value=''>";

        card.addEventListener("click", function () {
            var value = this.getElementsByTagName("input")[0].value;
            if (value) {
                if (check_obj(chosen_cards, value)) {
                    remove_card(chosen_cards, value);

                } else {
                    chosen_cards.push({ "text": value, "username": username, "element": this, "Set": "" })
                }
                this.classList.toggle("selected");
            }

        });
        document.getElementById("hand").appendChild(card)
    }

    function check_obj(obj, text) {
        for (var i = 0; i < obj.length; i++)
            if (obj[i].text == text) {
                return true
            }
        return false
    }

    function findWinner(maxScore) {
        for (var i = 0; i < users.length; i++) {
            if (users[i].score == maxScore) {
                return users[i].username;
            }
        }
        return "";
    }

    function remove_card(obj, text) {
        for (var i = 0; i < obj.length; i++) {
            if (obj[i].text == text) {
                obj.splice(i, 1);
            }
        }
    }
    function remove_card_from_hand() {
        for (var j = 0; j < chosen_cards.length; j++) {
            child = chosen_cards[j].element
            child.parentNode.removeChild(child);
        }
    }

    function draw_white() {
        if (Math.random() >= game_settings["blankPerc"] / 100) {
            socket.emit('white_card', { 'casts': game_settings['game_casts'] });
        } else {
            draw_blank()
        }
    }


    $('#submit').on('click', function () {
        if (chosen_cards.length == cards_needed) {
            socket.emit('submit_card', { 'channel': window.location.pathname.substr(1), 'cards': chosen_cards });
            remove_card_from_hand()
            chosen_cards = []
            $('#submit').css('display', "none")
        } else {
            alert("Incorrect number of cards selected")
        }
    });


    $('#show').on('click', function () {
        socket.emit('show_next_card', { 'channel': window.location.pathname.substr(1) });
    });

    $('#nextRound').on('click', function () {
        socket.emit('start_new_round_cah', { 'channel': window.location.pathname.substr(1), 'round_winner': "" });
        socket.emit('black_card', { 'channel': window.location.pathname.substr(1), 'casts': game_settings['game_casts'] });
    });

    $('#confirm').on('click', function () {
        if (round_winner) {
            socket.emit('start_new_round_cah', { 'channel': window.location.pathname.substr(1), 'round_winner': round_winner });
            socket.emit('black_card', { 'channel': window.location.pathname.substr(1), 'casts': game_settings['game_casts'] });
        }
        else {
            alert("Please pick a winner!")
        }
    });


    function show_submitted(card_index) {
        alreadyVoted = []
        drawScore()
        $('#submit').css("display", "none")
        if (submitted_cards.length > 0) {
            $('#hand').css("display", "none")

            var card = white_card(submitted_cards[card_index][0]['text'], submitted_cards[card_index].length == 1 ? submitted_cards[card_index][0]['Set'] : "", submitted_cards[card_index].length > 1 ? submitted_cards[card_index][1]['text'] : "", submitted_cards[card_index].length > 2 ? submitted_cards[card_index][2]['text'] : "")
            card.innerHTML += "<input type='hidden' value='" + submitted_cards[card_index][0]['username'] + "'>";
            if (checkCzar(username)) {
                submitted_cards.length > 1 ? $('#show').css("display", ""): $('#confirm').css("display", "")
                card.addEventListener("click", function () {
                    var value = this.getElementsByTagName("input")[0].value;
                    $.each($('#player_cards .card'), function (index, value) {
                        value.classList.remove("selected")
                    });
                    round_winner = value
                    this.classList.add("selected");

                })
            }

            document.getElementById("player_cards").appendChild(card)
        }
        else {
            if (checkCzar(username)) {
                $('#nextRound').css("display", "")
            }
        }
    }

    function checkCzar(_username) {
        for (var i = 0; i < users.length; i++) {
            if (users[i].czar && (users[i].username == _username)) {
                return true
            }
        }
        return false

    }

    function game_over(winner) {
        $('#player_cards').empty()
        $('#hand').empty()
        $('#black_card_place').empty()
        $('#setup').css("display", "")
        $('#game').css("display", "none")
        console.log("Winner is " + winner)
        startScreen = true
        drawScore()
        //Display game over message
        // Bring back game set up
        // Cancel new blackcard
        // reset variables
        // reset scoreboard

    }
    // Main game end
    // =================================================================================================== \\
    // Scoreboard start
    czar_index = 0;
    var alreadyVoted = []
    var startScreen = true
    var players_joined_midround = 0
    var users = []


    function drawScore() {
        $("#scoreboard").empty()
        users_display = users.slice();
        users_display.sort((a, b) => (a.score <= b.score) ? 1 : -1)
        for (var i = 0; i < users_display.length; i++) {
            if (!alreadyVoted.includes(users_display[i].username)) {
                czar_display = users_display[i].czar ? "czar" : "";
                $("#scoreboard").append(
                    "<div class='card " + czar_display + "'>" + users_display[i].username + "<br>" + '<div class="numberCircle">' + users_display[i].score + "</div></div>"
                );
            }
        }
        if (startScreen && username) {
            $("#scoreboard").append(
                "<div class='card' id='usernameChange'><br>Leave</div>"
            );
            $('#usernameChange').on('click', function () {
                $('#setUsername').css("display", "")
                socket.emit('remove_user', { 'username': username, 'channel': window.location.pathname.substr(1) });
            });
            // $("#scoreboard").append(
            //     "<div class='card' id='addAI'>Add<br>AI</div>"
            // );
            // $('#usernameChange').on('click', function () {
            //     $('#setUsername').css("display", "")
            //     socket.emit('remove_user', { 'username': username, 'channel': window.location.pathname.substr(1) });
            // });
        }
    }
    function givePoint(username) {
        for (var i = 0; i < users.length; i++) {
            if (users[i].username == username) {
                users[i].score += 1;
            }
        }
        drawScore()
    }
    function nextCzar() {
        users[czar_index].czar = false;
        czar_index = (czar_index + 1) % users.length
        users[czar_index].czar = true;
        drawScore()
    }

    function resetScoreboard() {
        for (var i = 0; i < users.length; i++) {
            users[i].score = 0;
            users[i].czar = false
        }
    }


    drawScore()


    // Scoreboard end
    //=================================================================================================//
    //Username System start

    $('#usernameButton').on('click', function () {
        if (!check_username(users, $('#usernameInput').val())) {
            obj = {
                'username': $('#usernameInput').val(),
                'id': socket.id,
                'score': 0,
                'czar': false
            }
            localStorage.setItem('cah_username', $('#usernameInput').val());
            username = $('#usernameInput').val()
            $('#usernameInput').val('');
            users.push(obj);
            drawScore()
            $('#setUsername').css("display", "none")
        } else {
            alert("Username already taken")
        }
        socket.emit('update_users', { 'channel': window.location.pathname.substr(1), 'user_list': users })
    });

    socket.on('user_leave', function (sid) {
        for (var i = 0; i < users.length; i++) {
            if (users[i].id == sid) {
                users.splice(i, 1);
            }
        }
        drawScore()
    });

    socket.on('new_user_list', function (data) {
        if (users.length < data.length) {
            users = data
            if (localStorage.getItem('cah_username')) {
                $('#setUsername').css("display", "none")
                if (!check_username(users, localStorage.getItem('cah_username'))) {
                    obj = {
                        'username': localStorage.getItem('cah_username'),
                        'id': socket.id,
                        'score': 0,
                        'czar': false
                    }
                    username = localStorage.getItem('cah_username')
                    users.push(obj);

                }
                socket.emit('update_users', { 'channel': window.location.pathname.substr(1), 'user_list': users })
            }
        }
        drawScore()
    });

    socket.on('remove_user', function (_username) {
        for (var i = 0; i < users.length; i++) {
            if (users[i].username == _username) {
                users.splice(i, 1);
            }
        }
        drawScore()
    });

    socket.on('update_new_user', function (data) {
        socket.emit('update_users', { 'channel': window.location.pathname.substr(1), 'user_list': users })
        if (!startScreen) {
            // if someone joins mid game then do this
            socket.emit('update_game_state', { 'channel': window.location.pathname.substr(1), 'game_settings': game_settings, 'czar_index': czar_index })
            players_joined_midround += 1
        }
    });

    function check_username(obj, name) {
        for (var i = 0; i < obj.length; i++)
            if (obj[i].username == name) {
                return true
            }
        return false
    }

    //Username System end

    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
    var updateLock = true;

    async function updateProgress() {
        if (updateLock) {
            updateLock = false;

            for (ix = 100; ix >= 0; ix--) {
                document.getElementById("innerBar").style.width = ix + "%";
                await sleep(turn_timer*10)
            }
            updateLock = true;
        }

    }

});
