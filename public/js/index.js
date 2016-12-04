$('button[name=Login]').click(function(e) {
  var room = $('input[name=Room]').val();
  var secret = $('input[name=Secret]').val();
  if (room && secret) {
    loginApi(room, secret);
  }
});

$('button[name=Create]').click(function(e) {
  var room = $('input[name=Room]').val();
  var secret = $('input[name=Secret]').val();
  if (room && secret) {
    registerApi(room, secret);
  }
});
