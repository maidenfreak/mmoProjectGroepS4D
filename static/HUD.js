var maxHealth = 1;
var currentHealth = maxHealth;

var maxAmmo = 1;
var currentAmmo = maxAmmo;
var eenmaalUitvoeren = false;

var iDiv = document.getElementById('ammo');

socket.on('playerteam', function(player){
    maxHealth = player.hp;
    maxAmmo = player.maxAmmo;
    playerclass.innerHTML = player.classname;

    if(eenmaalUitvoeren == false){
        for(i=0; i<maxAmmo; i++){
            var innerDiv = document.createElement('div');
            innerDiv.id = 'bullet';
            innerDiv.className = 'test';
            iDiv.appendChild(innerDiv);
        }
        eenmaalUitvoeren = true;
    }
});

socket.on('updatedHP', function(healthPlayer){
    currentHealth = healthPlayer;
    var pixelsForHealth = 560/maxHealth;
    var x = (maxHealth - currentHealth)*pixelsForHealth;
    if (x > 560){
      x = 560;
    }
    document.getElementById("health-bar").style.height = x + "px";
});

socket.on('updatedAmmo', function(ammoPlayer){
    var bulletElement = document.getElementById("bullet");
    iDiv.removeChild(bulletElement);
});

socket.on('addAmmo', function(oldAmmo, ammoPlayer){
    var currentAmmo = ammoPlayer;
    for(i=0; i<oldAmmo; i++){
        var bulletElement = document.getElementById("bullet");
        iDiv.removeChild(bulletElement);
    }
    if(currentAmmo >= maxAmmo){
        currentAmmo = maxAmmo;
    }
    for(i=0; i<currentAmmo; i++){
        var innerDiv = document.createElement('div');
        innerDiv.id = 'bullet';
        innerDiv.className = 'test';
        iDiv.appendChild(innerDiv);
    }
});