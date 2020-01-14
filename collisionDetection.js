exports.checkCollisionRight = function (player, playerArray, objectArray, radius){
  for(i=0; i<objectArray.length; i++){
    if(objectArray[i].position == "vertical"){
      if(player.x + radius >= objectArray[i].x && player.x + radius <= objectArray[i].x + objectArray[i].width){
        if(player.y - radius <= objectArray[i].y && player.y + radius >= objectArray[i].y + objectArray[i].height || player.y - radius >= objectArray[i].y && player.y + radius <= objectArray[i].y + objectArray[i].height){ 
          return true;
        }
        else if(player.y - radius >= objectArray[i].y && player.y - radius <= objectArray[i].y + objectArray[i].height || player.y + radius >= objectArray[i].y && player.y + radius <= objectArray[i].y + objectArray[i].height){
          return true;
        }
      }
    }
  }
  for(var id in playerArray){
    var otherPlayer = playerArray[id];
    if(otherPlayer.name == player.name){
    }
    else if(player.x + radius >= otherPlayer.x - radius && player.x + radius <= otherPlayer.x + radius){
      if(player.y - radius <= otherPlayer.y + radius && player.y - radius >= otherPlayer.y - radius || player.y + radius >= otherPlayer.y - radius && player.y + radius <= otherPlayer.y + radius){
        return true;
      }
    }
  }
  return false;
}
exports.checkCollisionPackageRight = function (player, objectArray, radius){
  for(i=0; i<objectArray.length; i++){
    if(player.x + radius >= objectArray[i][0] && player.x + radius <= objectArray[i][0] + objectArray[i][2]){
      if(player.y - radius <= objectArray[i][1] && player.y + radius >= objectArray[i][1] + objectArray[i][3] || player.y - radius >= objectArray[i][1] && player.y + radius <= objectArray[i][1] + objectArray[i][3]){ 
        return [true, objectArray[i]];
      }
      else if(player.y - radius >= objectArray[i][1] && player.y - radius <= objectArray[i][1] + objectArray[i][3] || player.y + radius >= objectArray[i][1] && player.y + radius <= objectArray[i][1] + objectArray[i][3]){
        return [true, objectArray[i]];
      }
    }
  }
  return [false, null];
}
exports.checkCollisionDown = function (player, playerArray, objectArray, radius){
  for(i=0; i<objectArray.length; i++){
    if(objectArray[i].position == "horizontal"){
      if(player.y + radius >= objectArray[i].y && player.y + radius <= objectArray[i].y + objectArray[i].height){
        if(player.x - radius <= objectArray[i].x && player.x + radius >= objectArray[i].x + objectArray[i].width || player.x - radius >= objectArray[i].x && player.x + radius <= objectArray[i].x + objectArray[i].width){
          return true;
        }
        else if(player.x - radius >= objectArray[i].x && player.x - radius <= objectArray[i].x + objectArray[i].width || player.x + radius >= objectArray[i].x && player.x + radius <= objectArray[i].x + objectArray[i].width){
          return true;
        }
      }
    }
  }
  for(var id in playerArray){
    var otherPlayer = playerArray[id];
    if(otherPlayer.name == player.name){
    }
    else if(player.y + radius >= otherPlayer.y - radius && player.y + radius <= otherPlayer.y + radius){
      if(player.x - radius <= otherPlayer.x + radius && player.x - radius >= otherPlayer.x - radius || player.x + radius >= otherPlayer.x - radius && player.x + radius <= otherPlayer.x + radius){
        return true;
      }
    }
  }
  return false;
}
exports.checkCollisionPackageDown = function (player, objectArray, radius){
  for(i=0; i<objectArray.length; i++){
    if(player.y + radius >= objectArray[i][1] && player.y + radius <= objectArray[i][1] + objectArray[i][3]){
      if(player.x - radius <= objectArray[i][0] && player.x + radius >= objectArray[i][0] + objectArray[i][2] || player.x - radius >= objectArray[i][0] && player.x + radius <= objectArray[i][0] + objectArray[i][2]){
        return [true, objectArray[i]];
      }
      else if(player.x - radius >= objectArray[i][0] && player.x - radius <= objectArray[i][0] + objectArray[i][2] || player.x + radius >= objectArray[i][0] && player.x + radius <= objectArray[i][0] + objectArray[i][2]){
        return [true, objectArray[i]];
      }
    }
  }
  return [false, null];
}
exports.checkCollisionLeft = function (player, playerArray, objectArray, radius){
  for(i=0; i<objectArray.length; i++){
    if(objectArray[i].position == "vertical"){
      if(player.x - radius >= objectArray[i].x && player.x - radius <= objectArray[i].x + objectArray[i].width){
        if(player.y - radius >= objectArray[i].y && player.y + radius <= objectArray[i].y + objectArray[i].height || player.y - radius <= objectArray[i].y && player.y + radius >= objectArray[i].y + objectArray[i].height){
          return true;
        }
        else if(player.y - radius >= objectArray[i].y && player.y - radius <= objectArray[i].y + objectArray[i].height || player.y + radius >= objectArray[i].y && player.y + radius <= objectArray[i].y + objectArray[i].height){
          return true;
        }
      }
    }
  }
  for(var id in playerArray){
    var otherPlayer = playerArray[id];
    if(otherPlayer.name == player.name){
    }
    else if(player.x - radius <= otherPlayer.x + radius && player.x - radius >= otherPlayer.x - radius){
      if(player.y - radius <= otherPlayer.y + radius && player.y - radius >= otherPlayer.y - radius || player.y + radius >= otherPlayer.y - radius && player.y + radius <= otherPlayer.y + radius){
        return true;
      }
    }
  }
  return false;
}
exports.checkCollisionPackageLeft = function (player, objectArray, radius){
  for(i=0; i<objectArray.length; i++){
    if(player.x - radius >= objectArray[i][0] && player.x - radius <= objectArray[i][0] + objectArray[i][2]){
      if(player.y - radius >= objectArray[i][1] && player.y + radius <= objectArray[i][1] + objectArray[i][3] || player.y - radius <= objectArray[i][1] && player.y + radius >= objectArray[i][1] + objectArray[i][3]){
        return [true, objectArray[i]];
      }
      else if(player.y - radius >= objectArray[i][1] && player.y - radius <= objectArray[i][1] + objectArray[i][3] || player.y + radius >= objectArray[i][1] && player.y + radius <= objectArray[i][1] + objectArray[i][3]){
        return [true, objectArray[i]];
      }
    }
  }
  return [false, null];
}
exports.checkCollisionUp = function (player, playerArray, objectArray, radius){
  for(i=0; i<objectArray.length; i++){
    if(objectArray[i].position == "horizontal"){   
      if(player.y - radius >= objectArray[i].y && player.y - radius <= objectArray[i].y + objectArray[i].height){
        if(player.x - radius <= objectArray[i].x && player.x + radius >= objectArray[i].x + objectArray[i].width || player.x - radius >= objectArray[i].x && player.x + radius <= objectArray[i].x + objectArray[i].width){
          return true;
        }
        else if(player.x - radius >= objectArray[i].x && player.x - radius <= objectArray[i].x + objectArray[i].width || player.x + radius >= objectArray[i].x && player.x + radius <= objectArray[i].x + objectArray[i].width){
          return true;
        }
      }
    }
  }
  for(var id in playerArray){
    var otherPlayer = playerArray[id];
    if(otherPlayer.name == player.name){
    }
    else if(player.y - radius <= otherPlayer.y + radius && player.y - radius >= otherPlayer.y - radius){
      if(player.x - radius <= otherPlayer.x + radius && player.x - radius >= otherPlayer.x - radius || player.x + radius >= otherPlayer.x - radius && player.x + radius <= otherPlayer.x + radius){
        return true;
      }
    }
  }
  return false;
}
exports.checkCollisionPackageUp = function (player, objectArray, radius){
  for(i=0; i<objectArray.length; i++){
    if(player.y - radius >= objectArray[i][1] && player.y - radius <= objectArray[i][1] + objectArray[i][3]){
      if(player.x - radius <= objectArray[i][0] && player.x + radius >= objectArray[i][0] + objectArray[i][2] || player.x - radius >= objectArray[i][0] && player.x + radius <= objectArray[i][0] + objectArray[i][2]){
        return [true, objectArray[i]];
      }
      else if(player.x - radius >= objectArray[i][0] && player.x - radius <= objectArray[i][0] + objectArray[i][2] || player.x + radius >= objectArray[i][0] && player.x + radius <= objectArray[i][0] + objectArray[i][2]){
        return [true, objectArray[i]];
      }
    }
  }
  return [false, null];
}