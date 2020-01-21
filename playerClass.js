class character {
    constructor(id, name, score, angle){
        this.id = id;
        this.name = name;
        this.score = 0;
        this.angle = 0;
    }
}
//rebels subclass welke erft van character class.
class rebels extends character {
    constructor(id, name, teamscore ,score, color, teamname, win, angle){
        super(id, name, score, angle)
        this.teamscore = 0;
        this.color = "red";
        this.teamname = "Rebels";
        this.win = 0;
    }
}

//swat subclass welke erft van character class.
class swat extends character {
    constructor(id, name, teamscore, score, color, teamname, win, angle){
        super(id, name, score, angle)
        this.teamscore = 0;
        this.color = "blue";
        this.teamname = "Swat";
        this.win = 0;
       
    }  
}
    //rebels 1
    class militant extends rebels {
        constructor(id,name, hp, maxHP, score, x, y, weapondamage, teamscore, color, teamname, isDead, maxAmmo, currentAmmo, classname, win, angle){
            super(id, name, teamscore, score, color, teamname, win, angle)
                this.hp = 150;
                this.maxHP = 150;
                this.x = 100;
                this.y = 100;
                this.weapondamage = 40;
                this.isDead = false;
                this.score = 0;
                this.maxAmmo = 20;
                this.currentAmmo = 20;
                this.classname = "Militant";
                this.fireRate = 200;
        }
    }
    //rebels 2
    class guerrilla extends rebels {
        constructor(id,name, hp, maxHP, score, x, y, weapondamage, teamscore, color, teamname, isDead, maxAmmo, currentAmmo, classname, win, angle){
            super(id, name, teamscore, score, color, teamname, win, angle)
                this.hp = 100;
                this.maxHP = 100;
                this.x = 130;
                this.y = 100;
                this.weapondamage = 80;
                this.isDead = false;
                this.score = 0;
                this.maxAmmo = 10;
                this.currentAmmo = 10;
                this.classname = "Guerrilla";
                this.fireRate = 1000;
        }        
    }
    //rebels 3
    class vigilante extends rebels {
        constructor(id,name, hp, maxHP, score, x, y, weapondamage, teamscore, color, teamname, isDead, maxAmmo, currentAmmo, classname, win, angle){
            super(id, name, teamscore, score, color, teamname, win, angle)
                this.hp = 200;
                this.maxHP = 200;
                this.x = 100;
                this.y = 130;
                this.weapondamage = 30;
                this.isDead = false;
                this.score = 0;
                this.maxAmmo = 25;
                this.currentAmmo = 25;
                this.classname = "Vigilante";
                this.fireRate = 100;
        }       
    }
    //rebels 4
    class separatist extends rebels {
        constructor(id,name, hp, maxHP, score, x, y, weapondamage, teamscore, color, teamname, isDead, maxAmmo, currentAmmo, classname, win, angle){
            super(id, name, teamscore, score, color, teamname, win, angle)
                this.hp = 240;
                this.maxHP = 240;
                this.x = 130;
                this.y = 130;
                this.weapondamage = 20;
                this.isDead = false;
                this.score = 0;
                this.maxAmmo = 30;
                this.currentAmmo = 30;
                this.classname = "Separatist"; 
                this.fireRate = 0;
        }        
    }

    //swat 1
    class grenadier extends swat {
        constructor(id,name, hp, maxHP, score, x, y, weapondamage, teamscore, color, teamname, isDead, maxAmmo, currentAmmo, classname, win, angle){
            super(id, name, teamscore, score, color, teamname, win, angle)
                this.hp = 150;
                this.maxHP = 150;
                this.x = 500;
                this.y = 500;
                this.weapondamage = 40;
                this.isDead = false;
                this.score = 0;
                this.maxAmmo = 20;
                this.currentAmmo = 20;
                this.classname = "Grenadier";
                this.fireRate = 200;
        }
    }
    //swat 2
    class breacher extends swat {
        constructor(id,name, hp, maxHP, score, x, y, weapondamage, teamscore, color, teamname, isDead, maxAmmo, currentAmmo, classname, win, angle){
            super(id, name, teamscore, score, color, teamname, win, angle)
                this.hp = 200;
                this.maxHP = 200;
                this.x = 530;
                this.y = 500;
                this.weapondamage = 20;
                this.isDead = false;
                this.score = 0;
                this.maxAmmo = 20;
                this.currentAmmo = 20;
               this.classname = "Breacher";
               this.fireRate = 0;
        }
    }
    //swat 3
    class observer extends swat {
        constructor(id,name, hp, maxHP, score, x, y, weapondamage, teamscore, color, teamname, isDead, maxAmmo, currentAmmo, classname, win, angle){
            super(id, name, teamscore, score, color, teamname, win, angle)
                this.hp = 100;
                this.maxHP = 100;
                this.x = 500;
                this.y = 530;
                this.weapondamage = 80;
                this.isDead = false;
                this.score = 0;
                this.maxAmmo = 10;
                this.currentAmmo = 10;
                this.classname = "Observer";
                this.fireRate = 1000;
        }        
    }
    //swat 4
    class charger extends swat {
        constructor(id,name, hp, maxHP, score, x, y, weapondamage, teamscore, color, teamname, isDead, maxAmmo, currentAmmo, classname, win, angle){
            super(id, name, teamscore, score, color, teamname, win, angle)
                this.hp = 240;
                this.maxHP = 240;
                this.x = 530;
                this.y = 530;
                this.weapondamage = 20;
                this.isDead = false;
                this.score = 0;
                this.maxAmmo = 20;
                this.currentAmmo = 20;
                this.classname = "Charger";
                this.fireRate = 300;  
        } 
    }
        
module.exports = {charger, observer, breacher, grenadier, separatist, vigilante, guerrilla, militant};