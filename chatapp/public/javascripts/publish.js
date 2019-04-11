'use strict';

let preResponceDate

// 投稿メッセージをサーバに送信する
function publish() {
    //１分間ボタンを押せなくする
    disableButtonMinute();

    // ユーザ名を取得
    const userName = $('#userName').val();
    // 入力されたメッセージを取得
    const message = $('#message').val();
    // 投稿内容を送信
    socket.emit('publish', {userName: userName, message: message})

    return false;
}

function enterKeyPressed() {
  if (window.event.keyCode == 13) {
    publish();
  }
}

function disableButtonMinute(){
  $('#publish-btn').attr('disabled', true);
  setTimeout(() => {
      $('#publish-btn').attr('disabled', false);
  }, 60000);
}

// サーバから受信した投稿メッセージを画面上に表示する
socket.on('receiveMessageEvent', function (data) {
    $('#thread').prepend('<p>' + data + '</p>');
});
