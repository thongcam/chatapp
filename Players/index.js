$('.choice').click((event) => {
  fetch("https://chatapp-entropy.herokuapp.com/choose", {
      method:'post',
      headers: {'Content-Type': 'application/json'},
      credentials: 'include',
      body: JSON.stringify({
        playercode: event.target.id,
        player: event.target.firstChild.nodeValue,
    })})
    .then(response => response.json())
    .then(data => {
      if (data === 'Success') {
        setTimeout(window.location.assign('https://thongcam.github.io/chatapp/UI/index.html'),2000)
      } else {
        alert('Error')
      }
    })
})
