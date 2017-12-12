function displayMessage(elementid, type, message){
  var msg = document.getElementById(elementid);
  msg.style.color = (type == "error") ? "red" : "blue";
  msg.innerHTML = message;
  document.getElementById(elementid).style.opacity="1";
  if(type == "confirm"){
    setTimeout(function(){
      document.getElementById(elementid).style.opacity="0";
    }, 4000);
  }
}