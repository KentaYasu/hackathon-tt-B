'use strict';

// 投稿メッセージをサーバに送信する
function publish() {
    //１分間ボタンを押せなくする
    disableButtonMinute();

    // ユーザ名を取得
    const userName = $('#userName').val();

    // 入力されたメッセージを取得
    const message = $('#message').val();
    // 投稿内容を送信
    if(message !== ''){
        socket.emit('publish', {userName: userName, message: message});
    }else{
        alert("空白では送信できません");
    }
    publishself();
return false;
}

//自分に太字で送信
function publishself() {
    // ユーザ名を取得
    const userName = $('#userName').val();
    // 入力されたメッセージを取得
    const message = $('#message').val();
    // メモの内容を表示
    $('#thread').prepend('<p><b>' + userName + 'さん:' + message + '</b></p>');

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

//　サーバから連続投稿した際のエラーメッセージを受信する
socket.on('contPostError', function (msg) {
  alert(msg);
});
