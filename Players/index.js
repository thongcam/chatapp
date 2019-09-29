const showSpinner = (text) => {
  $('#spinner').show();
  $('#spinner-backdrop').show();
  $('#spinner-text').text(text);
}

const hideSpinner = () => {
  $('#spinner').hide();
  $('#spinner-backdrop').hide();
}

$( document ).ready(() => {
  hideSpinner();
});

$('.choice').click((event) => {
  showSpinner('Loading...');
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
        hideSpinner();
        setTimeout(window.location.assign('https://thongcam.github.io/chatapp/UI/index.html'),1000)
      } else {
        hideSpinner();
        alert('Error')
      }
    })
})
