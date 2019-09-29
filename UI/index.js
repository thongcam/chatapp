$( document ).ready(function() {
  fetch('https://chatapp-entropy.herokuapp.com/',{
    method: 'get',
    headers: {'Content-Type':  'application/json'},
    credentials: 'include'
  }).then(response => response.json())
    .then(data => {
      const {playercode,player} = data;
      if (data !== 'Failed') {
        data.messages.forEach((message) => {
          $('.messages-wrapper').append(`<div class="message">
            <span class="sender ${message.playercode}">${message.player}: </span>${message.text}
          </div>`)
        })

        $('.title').append(`<span class='${playercode}'>(${player})</span>`)
        var socket = io.connect('https://chatapp-entropy.herokuapp.com/');

        $('.send').click(() => {
          if ($('.chatinput').val()) {
              socket.emit('chat',{
              message: $(".chatinput").val(),
              playercode: playercode,
              player: player
            })
          }
        })

        socket.on('chat', (data) => {
          $('.messages-wrapper').append(`<div class="message">
            <span class="sender ${data.playercode}">${data.player}: </span>${data.message}
          </div>`);
          $('.chatinput').val('');
        })
      } else if(data === 'Failed'){
        window.location.assign('https://thongcam.github.io/chatapp/Players/index.html')
      }
    })
});

$('.logout').click(() => {
  var mydate = new Date();
  mydate.setTime(mydate.getTime() - 1);
  document.cookie = "username=; expires=" + mydate.toGMTString();
  setTimeout(window.location.replace('https://chatapp-entropy.herokuapp.com/logout'),1000)
})
