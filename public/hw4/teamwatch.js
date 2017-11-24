//Mocked login function with hardcoded passwords
function authenticate(form) {
  if(form.username.value == "user" && form.password.value == "pass"){
    window.location='team.html';
  }
  else{
    var login_error = document.getElementById('login_error');
    login_error.style.display = 'block';
  }
}