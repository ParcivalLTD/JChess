function showError(message) {
  const errorBox = document.getElementById("errorBox");
  errorBox.textContent = message;
  errorBox.style.display = "block";
}

function showSuccess(message) {
  const errorBox = document.getElementById("errorBox");
  errorBox.textContent = message;
  errorBox.style.backgroundColor = "#d4edda";
  errorBox.style.borderColor = "#c3e6cb";
  errorBox.style.color = "#155724";
  errorBox.style.display = "block";
}

function clearError() {
  const errorBox = document.getElementById("errorBox");
  errorBox.textContent = "";
  errorBox.style.display = "none";
  errorBox.style.backgroundColor = "#f8d7da";
  errorBox.style.borderColor = "#f5c6cb";
  errorBox.style.color = "#721c24";
}

/* document.getElementById("hostButton").addEventListener("click", function () {
  let gameMode = localStorage.getItem("gameModeAbbr");
  if (gameMode.includes("bot")) {
    document.getElementById("prvMsg").style.display = "block";
    return;
  }
  const token = generateRandomToken();
  const link = createPrivateMatchLink(gameMode, token);
  window.location.assign(link);
});

document.getElementById("joinToken").addEventListener("input", function () {
  const joinButton = document.getElementById("joinButton");
  const token = this.value;
  checkTokenValidity(token);
});

document.getElementById("joinButton").addEventListener("click", function () {
  const token = document.getElementById("joinToken").value;
  const gameMode = "join";
  const link = createPrivateMatchLink(gameMode, token);
  window.location.assign(link);
});

checkTokenValidity(document.getElementById("joinToken").value); */

function checkTokenValidity(token) {
  const isValid = /^[A-Z0-9]{5}$/.test(token);
  joinButton.disabled = !isValid;
  joinButton.classList.toggle("btn-secondary", !isValid);
  joinButton.classList.toggle("btn-primary", isValid);
}

function createPrivateMatchLink(gameMode, token) {
  const baseUrl = "https://wavebeef.com/projects/jchess/online?=";
  return `${baseUrl}${gameMode}&${token}`;
}

function generateRandomToken() {
  const tokenLength = 5;
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  const gameModes = ["blz", "pwn", "qvk", "blt", "cl"];
  let result = "";
  let containsGameMode;

  do {
    result = "";
    for (let i = 0; i < tokenLength; i++) {
      result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    containsGameMode = gameModes.some((mode) => result.includes(mode));
  } while (containsGameMode);

  return result;
}

document.addEventListener("DOMContentLoaded", function () {
  var selectedTheme = localStorage.getItem("pieceTheme");
  if (selectedTheme) {
    selectedTheme = selectedTheme.replace("../img/chesspieces/", "");
    document.getElementById("pieceTheme").value = selectedTheme;
  }
});

document.getElementById("pieceTheme").addEventListener("change", function () {
  var pieceTheme = this.value;
  document.getElementById("piecePreview").src = "img/chesspieces/" + pieceTheme + "/wP.svg";
});

var pieceTheme = localStorage.getItem("pieceTheme");
if (!pieceTheme) {
  localStorage.setItem("pieceTheme", "../img/chesspieces/tatiana/");
  document.getElementById("piecePreview").src = "img/chesspieces/" + pieceTheme + "/wP.svg";
}

$("#settingsModal").on("show.bs.modal", function () {
  var lightSquareColor = localStorage.getItem("lightSquareColor");
  var darkSquareColor = localStorage.getItem("darkSquareColor");
  var pieceTheme = localStorage.getItem("pieceTheme");

  if (lightSquareColor) {
    document.getElementById("lightSquareColor").value = lightSquareColor;
  }
  if (darkSquareColor) {
    document.getElementById("darkSquareColor").value = darkSquareColor;
  }
  if (pieceTheme) {
    pieceTheme = pieceTheme.replace("../img/chesspieces/", "");
    document.getElementById("pieceTheme").value = pieceTheme;
  } else {
    localStorage.setItem("pieceTheme", "../img/chesspieces/tatiana/");
  }
});

document.getElementById("saveSettings").addEventListener("click", function () {
  var lightSquareColor = document.getElementById("lightSquareColor").value;
  var darkSquareColor = document.getElementById("darkSquareColor").value;
  localStorage.setItem("lightSquareColor", lightSquareColor);
  localStorage.setItem("darkSquareColor", darkSquareColor);
  $("#settingsModal").modal("hide");
});

document.getElementById("resetColors").addEventListener("click", function () {
  var defaultLightSquareColor = "#ebd1aa";
  var defaultDarkSquareColor = "#9a8873";

  document.getElementById("lightSquareColor").value = defaultLightSquareColor;
  document.getElementById("darkSquareColor").value = defaultDarkSquareColor;

  localStorage.setItem("lightSquareColor", defaultLightSquareColor);
  localStorage.setItem("darkSquareColor", defaultDarkSquareColor);
});

document.getElementById("pieceTheme").addEventListener("change", function () {
  localStorage.setItem("pieceTheme", "../img/chesspieces/" + this.value);
});

document.onload = function () {
  var pieceTheme = localStorage.getItem("pieceTheme");
  if (!pieceTheme) {
    localStorage.setItem("pieceTheme", "../img/chesspieces/tatiana");
  }
};

document.addEventListener("DOMContentLoaded", function () {
  var selectedTheme = localStorage.getItem("pieceTheme");
  if (selectedTheme) {
    selectedTheme = selectedTheme.replace("../img/chesspieces/", "");
    document.getElementById("pieceTheme").value = selectedTheme;
  }

  document.getElementById("piecePreview").src = "img/chesspieces/" + selectedTheme + "/wP.svg";
});

let timeout = null;
let profilePictureDiv = document.getElementById("profilePicture");
let pfpPrevDiv = document.getElementById("pfpPrevDiv");
pfpPrevDiv.style.display = "none";

document.getElementById("registerUsername").addEventListener("input", function (e) {
  clearTimeout(timeout);

  timeout = setTimeout(function () {
    let username = document.getElementById("registerUsername").value;
    if (username.length <= 3) {
      return;
    }
    const registerButton = document.getElementById("registerButton");

    if (username.length > 10) {
      showError("The username must not be longer than 10 characters.");
      registerButton.disabled = true;
      return;
    }

    clearError();

    registerButton.disabled = false;
    registerButton.style.backgroundColor = "#007bff";

    pfpPrevDiv.style.display = "block";
    profilePictureDiv.innerHTML = '<i class="fa-solid fa-spin fa-circle-notch" style="font-size: 0.7em;" aria-hidden="true"></i>';

    fetch("https://robohash.org/" + e.target.value)
      .then((response) => response.blob())
      .then((images) => {
        var outside = URL.createObjectURL(images);
        document.getElementById("usernamePrev").innerHTML = username;

        var imgElement = document.createElement("img");
        imgElement.src = outside;
        imgElement.classList.add("pfp");

        profilePictureDiv.innerHTML = "";
        profilePictureDiv.appendChild(imgElement);
      })
      .catch((error) => console.error(error));
  }, 500);
});

function login() {
  clearError();
  document.getElementById("loginSpinner").style.display = "inline-block";

  const username = document.getElementById("loginUsername").value;
  const password = document.getElementById("loginPassword").value;
  const stayLoggedIn = document.getElementById("stayLoggedIn").checked;

  if (username && password) {
    fetch("https://wavebeef.duckdns.org/projects/jchess/php/backend.php", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        loginUsername: username,
        loginPassword: password,
      }),
    })
      .then((response) => response.json())
      .then((result) => {
        if (result.success) {
          showSuccess(result.success);
          if (stayLoggedIn) {
            localStorage.setItem("username", username);
            localStorage.setItem("password", password);
          } else {
            sessionStorage.setItem("username", username);
            sessionStorage.setItem("password", password);
          }
          document.getElementById("loginSpinner").style.display = "none";
          closeLoginPopup();
        } else {
          showError(result.error);
          document.getElementById("loginSpinner").style.display = "none";
        }
      })
      .catch((error) => {
        showError("An error occurred during the login process.");
        document.getElementById("loginSpinner").style.display = "none";
      });
  } else {
    showError("Please enter both username and password.");
    document.getElementById("loginSpinner").style.display = "none";
  }
}

if (document.getElementById("loginButton")) {
  document.getElementById("loginPassword").addEventListener("keypress", function (event) {
    if (event.key === "Enter") {
      login();
    }
  });
}
if (document.getElementById("registerButton")) {
  document.getElementById("registerPassword").addEventListener("keypress", function (event) {
    if (event.key === "Enter") {
      register();
    }
  });
}

fetch("https://wavebeef.duckdns.org/projects/jchess/php/updateTrophies.php")
  .then((response) => response.json())
  .then((data) => {
    if (data.status === "success") {
      let table = '<table id="topUsersTable" class="table"><thead><tr><th scope="col"><i class="fas fa-user"></i></th><th scope="col"><i class="fa-solid fa-trophy"></i></th></tr></thead><tbody>';
      data.users.forEach((user) => {
        table += `<tr><td>${user.username}</td><td>${user.trophies}</td></tr>`;
      });
      table += "</tbody></table>";

      document.querySelectorAll("#topUsers").forEach((el) => (el.innerHTML = table));
    } else {
      console.error("Error:", data.message);
    }
  })
  .catch((error) => {
    console.error("Error:", error);
  });

function register() {
  clearError();

  document.getElementById("registerSpinner").style.display = "inline-block";

  const username = document.getElementById("registerUsername").value;
  const password = document.getElementById("registerPassword").value;

  if (username && password) {
    fetch("https://wavebeef.duckdns.org/projects/jchess/php/backend.php", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        registerUsername: username,
        registerPassword: password,
      }),
    })
      .then((response) => response.json())
      .then((result) => {
        if (result.success) {
          showSuccess(result.success);
          document.getElementById("registerSpinner").style.display = "none";
          showLoginForm();
        } else {
          showError(result.error);
          document.getElementById("registerSpinner").style.display = "none";
        }
      })
      .catch((error) => {
        document.getElementById("registerSpinner").style.display = "none";
        showError("An error occurred during the registration process.");
      });
  } else {
    showError("Please enter both username and password.");
    document.getElementById("registerSpinner").style.display = "none";
  }
}

const getElement = (id) => document.getElementById(id);

function toggleDisplay(id, state) {
  const element = getElement(id);
  if (element) {
    element.style.display = state;
  }
}

document.addEventListener("DOMContentLoaded", (event) => {
  document.getElementById("logoutButton").addEventListener("click", logout);
  document.getElementById("loginlink").addEventListener("click", showLoginForm);
  document.getElementById("registerlink").addEventListener("click", showRegisterForm);
});

function logout() {
  localStorage.clear();
  logoutButton.style.display = "none";
  showLoginPopup();
}

function closeLoginPopup() {
  var loginModal = document.getElementById("loginModal");
  var bootstrapModal = bootstrap.Modal.getInstance(loginModal);
  if (bootstrapModal) {
    bootstrapModal.hide();
  }
  document.getElementById("logoutButton").style.display = "block";
  updateUserInfo();
}

function showLoginForm() {
  toggleDisplay("loginFormRow", "block");
  toggleDisplay("registerFormRow", "none");
  setModalLabel("Login");
  clearError();
}

function showRegisterForm() {
  toggleDisplay("loginFormRow", "none");
  toggleDisplay("registerFormRow", "block");
  setModalLabel("Register");
  clearError();
}

function setModalLabel(labelText) {
  var modalLabel = document.getElementById("loginModalLabel");
  if (modalLabel) {
    modalLabel.textContent = labelText;
  } else {
    console.error("Modal-Label wurde nicht gefunden");
  }
}

document.addEventListener("DOMContentLoaded", function () {
  const username = localStorage.getItem("username") || sessionStorage.getItem("username");
  const password = localStorage.getItem("password") || sessionStorage.getItem("password");

  if (!username && !password) {
    showLoginPopup();
    toggleDisplay("logoutButton", "none");
  } else {
    toggleDisplay("logoutButton", "block");
  }
});

function showLoginPopup() {
  const loginModal = new bootstrap.Modal(getElement("loginModal"));
  if (loginModal) {
    loginModal.show();
  }
}

function updateGameMode(gameMode) {
  document.querySelectorAll("#mainHeader").forEach((header) => (header.innerHTML = gameMode));

  document.querySelectorAll("#playButton").forEach((playButton) => {
    playButton.onclick = function () {
      switch (true) {
        case gameMode.includes("Classic"):
          window.location.href = "online/?=" + "cl";
          break;
        case gameMode.includes("Bot"):
          window.location.href = "bot/index.html";
          break;
        case gameMode.includes("Blitz"):
          window.location.href = "online/?=" + "blz";
          break;
        case gameMode.includes("Pawn Endgame"):
          window.location.href = "online/?=" + "pwn";
          break;
        case gameMode.includes("Q vs N"):
          window.location.href = "online/?=" + "qvk";
          break;
        case gameMode.includes("Bullet"):
          window.location.href = "online/?=" + "blt";
        default:
          break;
      }
    };
  });

  document.querySelectorAll("#gameModeInfo").forEach((gameModeInfo) => {
    switch (true) {
      case gameMode.includes("Classic"):
        gameModeInfo.innerHTML = "Play against other players online (15 min).";
        localStorage.setItem("gameModeAbbr", "cl");
        break;
      case gameMode.includes("Bot"):
        gameModeInfo.innerHTML = "Play against the computer.";
        localStorage.setItem("gameModeAbbr", "bot");
        break;
      case gameMode.includes("Pawn Endgame"):
        gameModeInfo.innerHTML = "Play against other players online. Only pawns and kings are left on the board.";
        localStorage.setItem("gameModeAbbr", "pwn");
        break;
      case gameMode.includes("Blitz"):
        gameModeInfo.innerHTML = "Play against other players online (3 min).";
        localStorage.setItem("gameModeAbbr", "blz");
        break;
      case gameMode.includes("Queen vs Knights"):
        gameModeInfo.innerHTML = "Play against other players online. Only a queen and some knights are left on the board.";
        localStorage.setItem("gameModeAbbr", "qvk");
        break;
      case gameMode.includes("Bullet"):
        gameModeInfo.innerHTML = "Play against other players online (1 min).";
        localStorage.setItem("gameModeAbbr", "blt");
        break;
    }
  });
}

var dropdownItems = document.querySelectorAll(".dropdown-item");
for (var i = 0; i < dropdownItems.length; i++) {
  dropdownItems[i].addEventListener("click", function (event) {
    dropdownItems.forEach(function (item) {
      item.classList.remove("active");
    });

    event.target.classList.add("active");

    localStorage.setItem("gameMode", event.target.innerHTML);

    updateGameMode(event.target.innerHTML);
  });
}

var onlineItem = document.querySelector("#online");
onlineItem.classList.add("active");

if (localStorage.getItem("gameMode")) {
  var savedGameMode = localStorage.getItem("gameMode");
  if (savedGameMode) {
    updateGameMode(savedGameMode);
  }
} else {
  localStorage.setItem("gameMode", "<i class='fa-solid fa-chess-board'></i> Classic");

  updateGameMode("<i class='fa-solid fa-chess-board'></i> Classic");
}

function changePassword() {
  var oldPassword = document.getElementById("oldPassword").value;
  var newPassword = document.getElementById("newPassword").value;
  let username = localStorage.getItem("username") || sessionStorage.getItem("username");
  var currentPassword = localStorage.getItem("password") || sessionStorage.getItem("password");

  fetch("https://wavebeef.duckdns.org/projects/jchess/php/change_password.php", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: "oldPassword=" + encodeURIComponent(oldPassword) + "&newPassword=" + encodeURIComponent(newPassword) + "&username=" + encodeURIComponent(username) + "&currentPassword=" + encodeURIComponent(currentPassword),
  })
    .then((response) => response.text())
    .then((data) => {
      let errorbox = document.getElementById("settingsResponseMessage");
      errorbox.innerHTML = data;
      errorbox.style.display = "block";
      if (data.includes("success")) {
        errorbox.style.backgroundColor = "#d4edda";
        errorbox.style.borderColor = "#c3e6cb";
        errorbox.style.color = "#155724";
        if (localStorage.getItem("username")) {
          localStorage.setItem("password", newPassword);
        } else {
          sessionStorage.setItem("password", newPassword);
        }
      }
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}

async function getTrophies(username) {
  try {
    const response = await fetch(`https://wavebeef.duckdns.org/projects/jchess/php/updateTrophies.php?username=${username}`);
    const data = await response.json();

    if (data.status === "success") {
      return data.trophies;
    } else {
      console.error("Fehler beim Abrufen der Trophäen:", data.message);
      return null;
    }
  } catch (error) {
    console.error("Fehler:", error);
    return null;
  }
}

async function getRanking(username) {
  try {
    const response = await fetch(`https://wavebeef.duckdns.org/projects/jchess/php/getRanking.php?username=${username}`);
    const data = await response.json();

    if (data) {
      return data.rank;
    } else {
      console.error("Fehler beim Abrufen des Rankings:", data.message);
      return null;
    }
  } catch (error) {
    console.error("Fehler:", error);
    return null;
  }
}

async function updateUserInfo() {
  const username = localStorage.getItem("username") || sessionStorage.getItem("username");
  document.querySelectorAll("#playerUsername").forEach((el) => (el.textContent = username));

  document.querySelectorAll("#playerTrophies").forEach((el) => (el.innerHTML = '<i class="fa-solid fa-spin fa-circle-notch" style="font-size: 0.7em;"></i>'));
  document.querySelectorAll("#playerRanking").forEach((el) => (el.innerHTML = '<i class="fa-solid fa-spin fa-circle-notch" style="font-size: 0.7em;"></i>'));
  document.querySelectorAll("#pfpPlayerInfo").forEach((el) => (el.innerHTML = '<i class="fa-solid fa-spin fa-circle-notch" style="font-size: 0.7em;"></i>'));

  if (!username) return;

  document.querySelectorAll("#pfpPlayerInfo").forEach((el) => (el.innerHTML = "<img src='https://robohash.org/" + (localStorage.getItem("username") || sessionStorage.getItem("username")) + "' id='pfpImg'>"));

  const trophies = await getTrophies(username);
  const ranking = await getRanking(username);

  document.querySelectorAll("#playerTrophies").forEach((el) => (el.textContent = trophies));
  document.querySelectorAll("#playerRanking").forEach((el) => (el.textContent = ranking));
}

updateUserInfo();
document.querySelector(".main-container").style.right = "82px";

document.getElementById("mode-switcher").addEventListener("click", function () {
  const currentMode = document.documentElement.getAttribute("data-theme");
  const newMode = currentMode === "dark" ? "light" : "dark";

  if (newMode === "dark") document.getElementById("mode-switcher").innerHTML = '<i class="fas fa-sun"></i>';
  else document.getElementById("mode-switcher").innerHTML = '<i class="fas fa-moon"></i>';

  document.documentElement.setAttribute("data-theme", newMode);
  document.cookie = `theme=${newMode}; path=/;`;

  updateTheme();
});

function updateTheme() {
  const theme = getCookie("theme") || (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");

  document.documentElement.setAttribute("data-theme", theme);

  if (theme === "dark") document.getElementById("mode-switcher").innerHTML = '<i class="fas fa-sun"></i>';
  else document.getElementById("mode-switcher").innerHTML = '<i class="fas fa-moon"></i>';
}

function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);

  if (parts.length === 2) return parts.pop().split(";").shift();
}

updateTheme();

function fetchMessages() {
  fetch("https://wavebeef.duckdns.org/projects/jchess/php/globalChat.php")
    .then((response) => response.json())
    .then((data) => {
      document.querySelectorAll("#spinnerGlob21").forEach((el) => (el.style.display = "none"));
      let chats = document.querySelectorAll("#globChatWindow");
      chats.forEach((chat) => {
        chat.innerHTML = "";
        let div = document.createElement("div");
        div.innerHTML = "<span style='color: grey; margin-left: 92.5px'>...</span><br><br>";
        chat.appendChild(div);
        data.reverse();
        for (let message of data) {
          let div = document.createElement("div");
          div.className = "globMessage-block";
          div.innerHTML = "<span id='globUser'><i class='fa-solid fa-user'></i>" + message.username + "</span> <br> <span id='globMsg'>" + message.message + "</span>";
          chat.appendChild(div);
        }
        let isAtBottom = chat.scrollTop + chat.clientHeight === chat.scrollHeight;
        if (!isAtBottom) {
          chat.scrollTop = chat.scrollHeight;
        }
      });
    })
    .catch((error) => console.error("Error:", error));
}

fetchMessages();

async function censorMessage(message) {
  const url = "https://corsproxy.io/?https://neutrinoapi.net/bad-word-filter";
  const options = {
    method: "POST",
    headers: {
      "User-ID": "parcivalltd",
      "API-Key": "P8Zq9n2ePQxftphrbCKiyUAEH5WfvsBiRQidluQwtswGmDrY",
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      "censor-character": "*",
      catalog: "strict",
      content: message,
    }),
  };

  try {
    const response = await fetch(url, options);
    const result = await response.json();
    return result["censored-content"];
  } catch (error) {
    console.error(error);
  }
}

function sendMessage(username, message) {
  if (document.getElementById("globMessage").value.trim() === "") return;

  document.getElementById("spinnerGlob").style.display = "inline-block";
  document.getElementById("sendGlob").style.display = "none";

  censorMessage(message).then((censoredMessage) => {
    fetch("https://wavebeef.duckdns.org/projects/jchess/php/globalChat.php", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: "username=" + encodeURIComponent(username) + "&message=" + encodeURIComponent(censoredMessage),
    })
      .then(() => fetchMessages())
      .then(() => {
        document.getElementById("spinnerGlob").style.display = "none";
        document.getElementById("sendGlob").style.display = "inline-block";
      })
      .catch((error) => {
        console.error("Error:", error);
        document.getElementById("spinnerGlob").style.display = "none";
        document.getElementById("sendGlob").style.display = "inline-block";
      });
  });
}
let sendButton = document.getElementById("sendButton");
sendButton.addEventListener("click", function () {
  let username = localStorage.getItem("username") || sessionStorage.getItem("username");
  let message = document.getElementById("globMessage").value;
  sendMessage(username, message);
  messageInput.value = "";
  fetchMessages();
});

let messageInput = document.getElementById("globMessage");
messageInput.addEventListener("keypress", function (event) {
  if (event.key === "Enter") {
    event.preventDefault();

    let username = localStorage.getItem("username") || sessionStorage.getItem("username");
    let message = document.getElementById("globMessage").value;
    sendMessage(username, message);
    messageInput.value = "";
    fetchMessages();
  }
});

messageInput.addEventListener("input", function () {
  if (messageInput.value.trim() === "") {
    sendButton.disabled = true;
  } else {
    sendButton.disabled = false;
  }
});

window.onload = function () {
  if (messageInput.value.trim() === "") {
    sendButton.disabled = true;
  }

  if (!localStorage.getItem("cookiesAccepted")) {
    $("#cookieModal").modal("show");
  }
};

sendButton.disabled = true;
sendButton.classList.add("btn-secondary");
sendButton.classList.remove("btn-primary");

window.onload = function () {
  if (!localStorage.getItem("cookiesAccepted")) {
    $("#cookieModal").modal("show");
  }
};

function acceptCookies() {
  localStorage.setItem("cookiesAccepted", "true");
  $("#cookieModal").modal("hide");
}
