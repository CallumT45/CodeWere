import sqlalchemy as db
from sqlalchemy import func



inv_cast_dict = {'HUM': 'CAH: First Expansion', 'OHS': 'CAH : Second Expansion', 'I4D': 'PAX East 2014 - Panel Cards', 'OO9': 'The Catholic Card Game: Generations Expansion Pack', '8WV': ' 2016 Election Game ', 'XVG': 'Carps & Angsty Manatee - Texas Edition', 'ZJ1': 'Pax East 2013 Promo Pack A', 'Q5X': 'Knitters Against Swatches First Edition', '1FC': 'Geek Pack', '713': 'Carps & Angsty Manatee - Volume 2', 'DNR': 'Guards Against Insanity, Edition 2', 'WPI': 'Cads About Matrimony', '6RX': 'Babies vs. Parents', 'N1V': 'CAH: Procedurally-Generated Cards', 'OC8': 'World Wide Web Pack', 'SFK': 'Reject Pack', '77C': "Voter's Choice: The Third Expansion", 'HHA': 'Crabs Adjust Humidity: Volume 6', 'NUL': 'Crabs Adjust Humidity: Volume 1', 'Z5H': 'Clones Attack Hilarity #2', '0LT': 'Cocks Abreast Hostility - Cock Pack Two: Fowls Deep', '019': 'Kids Create Absurdity', 'WM0': 'WTF Did You Say?!?', '068': 'Humanity Hates the Holidays "Love" Edition', 'XSH': 'Fascism Pack', 'BMT': 'Words Against Morality: Volume 2', 'FQP': 'Potheads Against Sanity', 'L1Z': 'Hilarious!', 'LI2': 'Not Parent Approved', '003': 'Black Box Press Kit', 'OXU': 'Carbs of the Huge Manatee - Kink Expansion 1', 'VA5': 'Trumped UpCards: Astonishlingly Excellent Wealthcare! Expansion Pack', 'ZWB': 'PAX Prime 2014 - Panel Cards', 'HJD': 'Personally Incorrect - Expansion 2 [Yellow Box]', 'ADM': 'Reject Pack 2', '3RA': 'Words Against Morality: Volume 4', '0TF': 'Cows Grilling Hamburgers - Patty Pack #1', '2H0': 'Humanity Hates Trump: Expansion Pack 2 - Humanity Hates Hillary, Too', 'MCQ': 'Kiwis Against Morality', 'NM5': 'Kiwis Versus Morality', 'ROF': 'Dick', '24J': 'Cards Against/For South Africa', 'GER': 'Disgruntled Decks: Navy Edition', 'NLM': 'The Game Without Decency', '25V': 
'CAH: Box Expansion', '50G': 'Dad Pack', 'GYP': '2013 Holiday Pack', '9AZ': '2014 Holiday Pack', 'MG7': 'PAX Prime 2015 Food Pack A (Mango)', 'TVD': 'Retail Mini Pack', '4E7': 'Skewered And Roasted', 'KDH': 'Cats Abiding Horribly Bonus Cards', 'BMG': 'Conspiracy Theory - Kickstarter Bonus Cards Pack', '70M': 'Absurd Box Expansion', 'YQE': 'Cads About Maternity - A game for bad mommies', 'G3V': 'Vote For Trump Pack', 'KNZ': 'Humanity Hates Trump: Base Set', 'C8B': 'Cats Abiding Horribly: Episode I - The Dirty Goblin', '0PJ': 'PAX Prime 2014 Custom Printed Cards', 'EXA': 'Cards Against Profanity', 'EGM': 'KinderPerfect: Naughty Expansion Pack', 'VSJ': '2012 Holiday Pack', 'KBA': 'JadedAid: A Card Game to Save Humanitarians', '7YC': 'Crabs Adjust Humidity: Volume 7', 'QXP': 'CAH: Blue Box Expansion', '3F6': 'Bad Hombres Against Fake News Pack 1', 'YL1': 'Cats Abiding Horribly: Episode II - A New Low', 
'YDS': 'The Catholic Card Game: Five Deck Expansion Pack', 'RKQ': 'Carbs of the Huge Manatee: Dance Expansion 1', 'PAX': 'Charlie Foxtrot', '9SO': 'Crabs Adjust Humidity: Volume 3', 'PLN': 'Retail Product Pack', '7K6': 'Cards With No Sexuality', '5IW': 'The Catholic Card Game: Base Deck', 'MIU': 'Crows Adopt Vulgarity, Vol. 3', '9R2': 'Kids Against Maturity', '7RE': 'PAX East 2014', 'XHG': 'Personally Incorrect - Expansion [Red Box]', 'QLG': 'PAX East 2013 Promo Pack B', '3EN': 'Crazy & Horrible Rabbit - Vol. 1', 'CNH': 'Cads Against Adulting', 'DHX': 'Clams Attempt Harmonica, Volume 1', 'PRU': "That's What She Said Game - Second Expansion", 'XNT': 'Disgruntled Decks: Army Edition', 'F3G': 'CAH : Third Expansion', 'D0S': 'Guards Against Insanity, Edition 1', 'UPL': 'Depravity', 'QPI': 'Humanity Hates Trump: Kickstarter Promo Cards', 'IST': 'Cols Against Kentucky 2', '7MK': 'Clones Attack Hilarity #1', 'EBJ': 'Pigs Against Profanity: Volume 2', 
'U6F': 'Disgruntled Decks: Marine Corps/Jarhead Edition', 'MEE': 'PAX Prime 2015 Food Pack C (Cherry)', '8JQ': 'CAH: Human Pack', '8TT': 'Cards for the Masses', 'BYB': 'PAX Prime 2015 Food Pack B (Coconut)', 'P0P': 'Guards Against Insanity, Edition 4', 'JLM': 'Carps & Angsty Manatee - Volume 1', 'FXZ': 'Not Parent Approved Expansion Pack #1', 'NKN': 'TableTop Pack', 'PWT': 'Pigs Against Profanity: Volume 3', '8RE': 'Fantasy Pack', 'LID': 'Period Pack', '4ZW': 'Cows Against Hamburgers - Patty Pack #1', 'KNQ': 'Dirty Nasty Filthy', 'L1Q': 'Conspiracy Theory', '8EJ': 'CAH Base Set', 'PAJ': 'CAH: Fifth Expansion', 'KT2': 'Crows Adopt Vulgarity, Vol. 2', '497': 'Trumped UpCards: Alternative Facts Expansion Pack', 'OSW': 'PAX 2010 "Oops" Kit', 'DRY': 'Cats Abiding Horribly: Episode III - The SJWs Strike Back', 'VQW': 'Reject Pack 3', 'FSS': 'Words Against Morality: Volume 1', 'XKB': 'Guards Against Insanity, Edition 5', '0A8': 'CAH: Red Box Expansion', '15H': "That's What She Said Game - First Expansion", '959': 'Cakes Athirst Hilarity Volume 4', '77E': 'CAH: Fourth Expansion', '12O': 'JadedAid: Peace Corps Expansion Pack', '2OF': 'Cakes Athirst Hilarity Volume 3', 'A1U': "Voter's Choice: The First Expansion", '2YX': 'Weed Pack', '9RN': 'Desert Bus For Hope Pack', 'BCV': 'Hanukkah LOL Pack', 'G0W': 'CAH: Green Box Expansion', 'JQU': 'Vote For Hillary Pack', 'MR5': 'CAH: Sixth Expansion', 'UJZ': 'Crabs Adjust Humidity: Volume 5', '12X': 'Sci-Fi Pack', 'PUQ': 'CAH: Canadian Conversion Kit', 
'1J1': 'House of Cards Pack', '298': 'KinderPerfect: A Timeout For Parents (Kickstarter Set)', 'D4H': '90s Nostalgia Pack', 'W5Q': 'Food Pack', 'IE9': 'CAH: Hidden Gems Bundle: A Few New Cards We Crammed Into This Bundle Pack (Amazon Exclusive)', '8IC': 'Cards and Punishment Vol. Two', 'YQU': 'Trump Bug Out Bag/Post-Trump Pack', 'WRX': 'PAX East 2013 Promo Pack C', 'PF8': 'PAX Prime 2013', '6NT': 'CAH: A.I. Pack', 'PZZ': 'KinderPerfect: Tween Expansion Pack', 'EMV': 'Jew Pack/Chosen People Pack', 'YTV': 'Personally Incorrect', 'PHB': 'Fun in the Oven', 'V3H': "That's What She Said Game", 'ROT': 'Rotten Apples: The Tasteless Adult Party Game', 'QFE': 'Knitters Against Swatches Second Edition', 'DDY': 'KinderPerfect: More Expansion Pack', '9AU': 'Theatre Pack - CATS Musical Pack', 'ASA': 'Cards About Toronto', 'DU1': 'Cads About Matrimony: Expansion 1', 'GCX': "Voter's Choice: The Fourth Expansion", 'HQH': 'The Worst Card Game: Colorado Edition', 'AW9': 'Hidden Compartment Pack', 'RXY': 'Theatre Pack', '0RD': 'Crows Adopt Vulgarity, Vol. 4', 'P4Y': 'Evil Apples', 'G4K': 'Pigs Against Profanity: Volume 1', '6YJ': 'Pride Pack', 'XBP': 'Crabs Adjust Humidity: Volume 2', 'WAU': 'Seasons Greetings Pack', '9FF': 'Crows Adopt Vulgarity, Vol. 1', 'VI3': 'Gen Con 2018 Midterm Election Pack', 'QT1': 'Science Pack', 'YJU': 'Bad Campaign, The Presidential Party Game!', 'HF4': 'Cards Against Humanity Saves America Pack', 'HXT': 'Carbs of the Huge Manatee: General Expansion 1', 'N17': "Trumped UpCards: The World's Biggest Deck*", 'V94': 'Cocks Abreast Hostility: Cock Pack One: Just The Tip', 'LMD': 'Humanity Hates The Holidays', 'VKB': 'KinderPerfect (Commercial Set)', '4Z9': 'The Worst Card Game: 2016 National Edition', '25L': 'Not Parent Approved Expansion Pack #2', 'ABM': 'CAH: College Pack', '08W': 'Carbs of the Huge Manatee: General Expansion 2', '78I': 'Guards Against Insanity, Edition 3', '9AD': 'Cakes Athirst Hilarity Volume 1', 'F30': 'Cats Abiding Horribly Bonus Cards 2', 'PRA': 'Carbs of the Huge Manatee: General Expansion 3', 'T4G': 'Humanity Hates Trump: Expansion Pack 1', 'UQS': 'CAH: 2000s Nostalgia Pack', 'ALS': 'Bards Dispense Profanity', '8D2': 'Disgruntled Decks: Coast Guard/Coastie Edition', '4UK': 'Crabs Adjust Humidity: Volume 4', '1PL': 'Cols Despite Kentucky', 'B21': 
'Blurbs Against Buffalo', '6R2': 'The Catholic Card Game: Life Teen Expansion Pack', 'BHW': 'Cads About Matrimony Poly Pack', 'P03': "Voter's Choice: The Second Expansion", 'G6Q': 'Mass Effect Pack', 'NLX': 'Jack White Show Pack', 'S8X': 'Words Against Morality: Volume 3', 'IOV': 'Trumped UpCards: Many Sides  Expansion Pack', 'F4R': 'Cards and Punishment Vol. One', 'PJY': 'Cakes Athirst Hilarity Volume 2', 'ICC': 'CAH: Ass Pack', 'OHV': 'Carbs of the Huge Manatee - Online Dating Expansion 1', 'I30': 'CAH: UK Conversion Kit', 'O8P': 'Disgruntled Decks: Air Force Edition'}



class CAH():
    def draw_card(self, casts):
        """
        Randomly chooses a cast to draw from then randomly chooses a cards from that cast
        """
        engine = db.create_engine('sqlite:///static/card.db')
        connection = engine.connect()
        metadata = db.MetaData()
        response = db.Table('response', metadata, autoload=True, autoload_with=engine)
        casts = list(map(lambda x: inv_cast_dict[x], casts))
        query = db.select([response]).order_by(func.RANDOM()).where(response.columns['Set.1'].in_(casts)).limit(1)
        ResultProxy = connection.execute(query)
        ResultSet = ResultProxy.fetchall()
        return ResultSet[0]

    def black_card(self, casts):
        """
        Randomly chooses a cast to draw from then randomly chooses a cards from that cast
        """
        engine = db.create_engine('sqlite:///static/card.db')
        connection = engine.connect()
        metadata = db.MetaData()
        prompts = db.Table('prompts', metadata, autoload=True, autoload_with=engine)
        casts = list(map(lambda x: inv_cast_dict[x], casts))
        query = db.select([prompts]).order_by(func.RANDOM()).where(prompts.columns.Set.in_(casts)).limit(1)
        ResultProxy = connection.execute(query)
        ResultSet = ResultProxy.fetchall()
        return ResultSet[0]


        
if __name__=="__main__":
    cc = CAH()
    print(cc.draw_card(["70M", "003", "8EJ", "OHS", "F3G"]))
    print(cc.black_card(["70M", "003", "8EJ", "OHS", "F3G"]))
