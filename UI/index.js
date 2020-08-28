const showSpinner = (text) => {
  $("#spinner").show();
  $("#spinner-backdrop").show();
  $("#spinner-text").text(text);
};

const hideSpinner = () => {
  $("#spinner").hide();
  $("#spinner-backdrop").hide();
};

$(document).ready(function () {
  showSpinner("Loading messages");
  fetch("https://chatapp-entropy.herokuapp.com/", {
    method: "get",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
  })
    .then((response) => response.json())
    .then((data) => {
      const { playercode, player } = data;
      if (data !== "Failed") {
        hideSpinner();
        //iterate qua list tin nhắn => display mỗi tin nhắn
        data.messages.forEach((message) => {
          $(".messages-wrapper").append(`<div class="message">
            <span class="sender ${message.playercode}">${message.player}: </span>${message.text}
          </div>`);
        });
        //set tên người chơi
        $(".title").append(`<span class='${playercode}'>(${player})</span>`);
        $(".send").addClass(playercode);
        var socket = io.connect("https://chatapp-entropy.herokuapp.com/");

        $(".send").click(() => {
          if ($(".chatinput").val()) {
            socket.emit("chat", {
              message: $(".chatinput").val(),
              playercode: playercode,
              player: player,
            });
          }
        });
        //tin nhắn mới
        socket.on("chat", (data) => {
          $(".messages-wrapper").append(`<div class="message">
            <span class="sender ${data.playercode}">${data.player}: </span>${data.message}
          </div>`);
          $(".chatinput").val("");
        });
      } else if (data === "Failed") {
        showSpinner("Redirecting...");
        window.location.assign(
          "https://thongcam.github.io/chatapp/Players/index.html"
        );
      }
    });
});

$(".logout").click(() => {
  //xóa cookie
  var mydate = new Date();
  mydate.setTime(mydate.getTime() - 1);
  document.cookie = "username=; expires=" + mydate.toGMTString();
  showSpinner("Redirecting...");
  //redirect
  setTimeout(
    window.location.replace("https://chatapp-entropy.herokuapp.com/logout"),
    1000
  );
});
