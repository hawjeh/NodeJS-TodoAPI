$('#todoList').on("click", "button.updateTodoBtn", function(e) {
  var id = this.value;
  updateTodoApi(id, true);
});

$('#todoList').on("click", "button.deleteTodoBtn", function(e) {
  var id = this.value;
  deleteTodoApi(id);
});

$('#todoCompletedList').on("click", "button.updateTodoBtn", function(e) {
  var id = this.value;
  updateTodoApi(id, false);
});

$('#todoCompletedList').on("click", "button.deleteTodoBtn", function(e) {
  var id = this.value;
  deleteTodoApi(id);
});

$('button[name=AddTodo]').click(function(e) {
  var subject = $('input[name=Subject]').val();
  var body = $('input[name=Body]').val();
  postTodoApi(subject, body);
});

$('button[name=AddNew]').click(function(e) {
  $('div.AddTodoTable').toggleClass('HideAddTodoTable');
});

$('button[name=Logout]').click(function(e) {
  logoutApi();
});

var getAllTodoApi = function() {
  $.ajax({
    "url": "/todos",
    "method": "GET",
    "headers": {
      "content-type": "application/json",
      "x-auth": getToken()
    }
  }).done(function(response, status, request) {
    response.todos.forEach(function(todo) {
      var btn1 = '<button class="btn btn-todoList btn-success updateTodoBtn" type="submit" name="Complete" value="' + todo._id + '">Complete</button>';
      var btn2 = '<button class="btn btn-todoList btn-warning deleteTodoBtn" type="submit" name="Delete" value="' + todo._id + '">Delete</button>';

      if (!todo.completed) {
        var activeBody = '<div class="col-xs-6 col-sm-3"><div class="panel">' +
          '<div class="panel-heading">' + '<b>' + todo.subject + '</b>' + '</div>' +
          '<div class="panel-body">' + todo.body + ' </div>' +
          '<div class="panel-footer">' + btn1 + btn2 + '</div>' +
          '</div></div>';
        $('#todoList').append(activeBody);
      } else {
        var btn1 = '<button class="btn btn-todoList btn-success updateTodoBtn" type="submit" name="InComplete" value="' + todo._id + '">InComplete</button>';
        var inActiveBody = '<div class="col-xs-6 col-sm-3"><div class="panel">' +
          '<div class="panel-heading">' + '<b>' + todo.subject + '</b>' + '</div>' +
          '<div class="panel-body">' + todo.body + ' </div>' +
          '<div class="panel-footer">' + btn1 + btn2 + '</div>' +
          '</div></div>';
        $('#todoCompletedList').append(inActiveBody);
      }
    });
  }).fail(function(err) {
    alert("Some error happen while geting Todo notes!");
  });
}

var updateTodoApi = function(id, completed) {
  $.ajax({
    "url": "/todo/" + id,
    "method": "PATCH",
    "headers": {
      "content-type": "application/json",
      "x-auth": getToken()
    },
    "data": JSON.stringify({
      "completed": completed
    })
  }).done(function(response, status, request) {
    return window.location.href = "/room";
  }).fail(function(err) {
    alert("Some error happen while updating Todo notes!");
  });
}

var postTodoApi = function(subject, body) {
  $.ajax({
    "url": "/todo",
    "method": "POST",
    "headers": {
      "content-type": "application/json",
      "x-auth": getToken()
    },
    "data": JSON.stringify({
      "subject": subject,
      "body": body
    })
  }).done(function(response, status, request) {
    return window.location.href = "/room";
  }).fail(function(err) {
    alert("Some error happen while creating new Todo note!");
  });
}

var deleteTodoApi = function(id) {
  $.ajax({
    "url": "/todo/" + id,
    "method": "DELETE",
    "headers": {
      "content-type": "application/json",
      "x-auth": getToken()
    }
  }).done(function(response, status, request) {
    return window.location.href = "/room";
  }).fail(function(err) {
    alert("Some error happen while deleting new Todo note!");
  });
}
