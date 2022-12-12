let usernameDropdown = document.getElementById("usernameDropdown");
let categories = document.getElementById("categories");
let priorities = document.getElementById("priorities");

if (window.location.href.includes("?")) {
  let slashCount = window.location.href.split("?").length;
  let userid = window.location.href.split("?")[slashCount - 2];
  let username = window.location.href.split("?")[slashCount - 1];
  getUserTodos(userid, username);
}

fetch("http://localhost:8083/api/users") // send a request to API/Service
  .then((response) => response.json()) //API Service returns a response
  .then((data) => {
    for (let i = 0; i < data.length; i++) {
      let option = document.createElement("option");
      option.textContent = data[i].username;
      option.value = data[i].id;
      usernameDropdown.appendChild(option);
    }
  });

fetch("http://localhost:8083/api/categories")
  .then((response) => response.json())
  .then((responses) => {
    for (let i = 0; i < responses.length; i++) {
      let categoryOption = document.createElement("option");
      categoryOption.textContent = responses[i].name;

      categories.appendChild(categoryOption);
    }
  });

function login() {
  let username = usernameDropdown.options[usernameDropdown.selectedIndex].text;
  let password = document.getElementById("password").value;

  fetch("http://localhost:8083/api/login/" + username + "/" + password)
    .then((loginResponse) => loginResponse.json())
    .then((loginResult) => {
      if (loginResult.IsLoginSuccess) {
        getUserTodos(loginResult.UserId, loginResult.Name);
      } else alert("Login is unsuccessfull!");
    });
}

function getUserTodos(userId, name) {
  let tableBody = document.getElementById("todoTable");
  let bodyString = "";

  fetch("http://localhost:8083/api/todos/byuser/" + userId)
    .then((response) => response.json())
    .then((data) => {
      for (let i = 0; i < data.length; i++) {
        let isCompleted = data[i].completed;
        let content =
          "<tr>" +
          '<td id="Ct" >' +
          data[i].category +
          "</td>" +
          '<td id="Ds" >' +
          data[i].description +
          "</td>" +
          '<td id="Dl" >' +
          data[i].deadline +
          "</td>" +
          '<td id="Pr">' +
          data[i].priority +
          "</td>" +
          '<td id="Com">' +
          "<input ";
        if (isCompleted) {
          content += "checked";
        }
        content += " type='checkbox'>" + "</td></tr>";

        bodyString += content;
      }

      tableBody.innerHTML = bodyString;
      document.getElementById("password").value = "";
      document.getElementById("dailyTaskTitle").innerText =
        "Daily Tasks (" + name + ")";
    });
}

function createTask() {
  let _userId = usernameDropdown.options[usernameDropdown.selectedIndex].value;
  let _category = categories.options[categories.selectedIndex].text;
  let _priority = priorities.options[priorities.selectedIndex].text;
  let _description = document.getElementById("description").value;
  let _deadline = document.getElementById("deadline").value;

  if (_userId == undefined || _userId == "" || _userId == null) {
    alert("Please choose an user!");
  }

  fetch("http://localhost:8083/api/todos", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      userid: Number(_userId),
      category: _category,
      description: _description,
      deadline: _deadline,
      priority: _priority,
    }),
  })
    .then((res) => res.json())
    .then((data) => {
      window.location =
        "/frontend/html/toDo.html?" +
        _userId +
        "?" +
        usernameDropdown.options[usernameDropdown.selectedIndex].text;
    });
}
