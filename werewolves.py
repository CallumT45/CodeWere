import random

class Player():
    def __init__(self, name, idn):
        self.name = name
        self.id = idn

class Werewolf():
    def __init__(self, users):
        self.users = users#[Player("Callum", 307625115963621377),Player("Ben", 307625115963621377),Player("Eoin", 307625115963621377),Player("Jack", 307625115963621377),Player("Jill", 307625115963621377),Player("Claire", 307625115963621377),Player("Jeane", 307625115963621377)]
        self.set_roles()

    def set_roles(self):
        self.num_wolves = 2
        self.num_villagers_with_roles = 3
        num = len(self.users)
        if num > 9:
            self.num_wolves = 3
            self.num_villagers_with_roles = 4
        if num > 13:
            self.num_wolves = 5

        self.werewolves = random.sample(self.users, self.num_wolves)
        self.role_dict = { i : "Werewolf" for i in self.werewolves}
        self.villagers = list(set(self.users)-set(self.werewolves))

        self.villagers_with_roles = random.sample(self.villagers, self.num_villagers_with_roles)
        self.villagers_without_roles = list(set(self.villagers)-set(self.villagers_with_roles))

        self.doc = self.villagers_with_roles[0]
        self.role_dict[self.villagers_with_roles[0]] = "Doctor"

        self.seer = self.villagers_with_roles[1]
        self.role_dict[self.villagers_with_roles[1]] = "Seer"

        self.cupid = self.villagers_with_roles[2]
        self.role_dict[self.villagers_with_roles[2]] = "Cupid"

        if num > 9:
            self.hunter = self.villagers_with_roles[3]
            self.role_dict[self.villagers_with_roles[3]] = "Hunter"

        for villager in self.villagers_without_roles:
            self.role_dict[villager] = "Villager"


if __name__=="__main__":

    users = ["Glen", "Patrick", "Callum", "Peter", "Dan", "Alex", "Sean"]

    ww = Werewolf(users)

    print(ww.role_dict)
    
