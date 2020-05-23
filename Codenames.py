import random
class Codenames():
    
    def __init__(self):
        self.words = []
        with open('static/words.txt','r') as wordfile:
                for row in wordfile:
                        self.words.append(row[:-1])

        self.card_sizes = [8,9]
        self.blue_cards,self.red_cards = random.sample(self.card_sizes,2)
        self.game_words = random.sample(self.words, 25)
        self.blue_words = random.sample(self.game_words, self.blue_cards)
        self.red_words = random.sample(list(set(self.game_words) - set(self.blue_words)), self.red_cards)
        self.black_word = random.sample(list(set(self.game_words) - set(self.blue_words) - set(self.red_words)), 1)
        self.neutral_words = list(set(self.game_words) - set(self.blue_words) - set(self.red_words) - set(self.black_word))

    def build_json(self):
        self.game_data = {}
        self.game_data['game_words'] = self.game_words
        self.game_data['blue_words'] = self.blue_words
        self.game_data['red_words'] = self.red_words
        self.game_data['black_word'] = self.black_word
        return self.game_data


if __name__=='__main__':
    cc = Codenames()
    print(cc.game_data)