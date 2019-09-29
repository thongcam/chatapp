$('.choice').click((event) => {
  fetch("https://chatapp-entropy.herokuapp.com/choose", {
      method:"post",
      headers: {'Content-Type': 'application/json'},
      credentials: 'include',
      body: JSON.stringify({
        playercode: event.target.id,
        player: event.target.firstChild.nodeValue,
    })})
    .then(setTimeout(window.location.assign('https://thongcam.github.io/chatapp/UI/index.html'),2000))
})
