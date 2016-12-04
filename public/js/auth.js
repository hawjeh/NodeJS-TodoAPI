var setToken = function(token, room) {
  localStorage.setItem('x-auth', token);
  localStorage.setItem('room', room);
}

var getToken = function() {
  return localStorage.getItem('x-auth');
}

var getRoom = function() {
  return localStorage.getItem('room');
}

var removeToken = function() {
  localStorage.removeItem('x-auth');
  localStorage.removeItem('room');
}

var loginApi = function(room, room_secret) {
  $.ajax({
    "url": "/room/login",
    "method": "POST",
    "headers": {
      "content-type": "application/json"
    },
    "data": JSON.stringify({
      "room": room,
      "room_secret": room_secret
    })
  }).done(function(response, status, request) {
    setToken(request.getResponseHeader('x-auth'), room);
    return window.location.href = "/room";
  }).fail(function(err) {
    alert("Room / password incorrect. Consider to create a new room instead :)");
  });
}

var registerApi = function(room, room_secret) {
  $.ajax({
    "url": "/room",
    "method": "POST",
    "headers": {
      "content-type": "application/json"
    },
    "data": JSON.stringify({
      "room": room,
      "room_secret": room_secret
    })
  }).done(function(response, status, request) {
    setToken(request.getResponseHeader('x-auth'));
    return window.location.href = "/room";
  }).fail(function(err) {
    alert("Room is taken. Consider another room instead :)");
  });
}

var logoutApi = function() {
  if (getToken()) {
    $.ajax({
      "url": "/room/me",
      "method": "DELETE",
      "headers": {
        "content-type": "application/json",
        "x-auth": getToken()
      }
    }).done(function(response, status, request) {
      removeToken();
      return window.location.href = "/";
    }).fail(function(err) {
      alert("Logout Error");
    });
  } else {
    return window.location.href = "/";
  }
}

var checkMeApi = function() {
  if (getToken()) {
    $.ajax({
      "url": "/room/me",
      "method": "GET",
      "headers": {
        "content-type": "application/json",
        "x-auth": getToken()
      }
    }).done(function(response, status, request) {
      return window.location.href = "/room";
    }).fail(function(err) {
      removeToken();
      $('.loginBody').show();
    });
  } else {
    $('.loginBody').show();
  }
}
