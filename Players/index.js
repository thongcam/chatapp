//Loading spinner (not important)
const showSpinner = (text) => {
  $("#spinner").show();
  $("#spinner-backdrop").show();
  $("#spinner-text").text(text);
};

const hideSpinner = () => {
  $("#spinner").hide();
  $("#spinner-backdrop").hide();
};

$(document).ready(() => {
  hideSpinner();
});

//Chọn người chơi
$(".choice").click((event) => {
  showSpinner("Loading...");
  fetch("https://chatapp-entropy.herokuapp.com/choose", {
    method: "post",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({
      playercode: event.target.id,
      //Lấy id từ id của element được click
      player: event.target.firstChild.nodeValue,
      //Lấy playername từ content của element được click
    }),
  })
    .then((response) => response.json())
    .then((data) => {
      if (data === "Success") {
        hideSpinner();
        setTimeout(
          window.location.assign(
            "https://thongcam.github.io/chatapp/UI/index.html"
          ),
          1000
        );
        //redirect tới trang gửi tin nhắn
      } else {
        hideSpinner();
        alert("Error");
      }
    });
});
