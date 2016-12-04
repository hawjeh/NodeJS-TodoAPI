var indexInitHelper = function() {
  $('.loginBody').hide();
  checkMeApi();
}

var roomInitHelper = function() {
  $('.roomBody').hide();
  if (!getToken() || !getRoom()) {
    logoutApi();
    return window.location.href = "/";
  } else {
    $('.roomBody').show();
    $('#room_title').text(getRoom());
    $('.AddTodoTable').addClass('HideAddTodoTable');
    getAllTodoApi();
  }
}

$(document).ready(function() {
  $('button').click(function(e) {
    e.preventDefault();
  });
});
