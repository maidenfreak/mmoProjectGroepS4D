var maxHealth = 1;
var currentHealth = maxHealth;

var maxAmmo = 1;
var currentAmmo = maxAmmo;

var iDiv = document.getElementById('ammo');

socket.on('playerteam', function(player){
    maxHealth = player.hp;
    maxAmmo = player.ammo;
    playerclass.innerHTML = player.classname;

    for(i=0; i<maxAmmo; i++){
        var innerDiv = document.createElement('div');
        innerDiv.id = 'bullet';
        innerDiv.className = 'test';
        iDiv.appendChild(innerDiv);
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
    currentAmmo = ammoPlayer;
    console.log(currentAmmo);
});