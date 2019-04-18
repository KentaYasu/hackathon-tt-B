'use strict';

// 昇順降順が変わるたびに変わる
let orderFlag = true;

// #threadへの書き込みはここの関数を使ってください
function toThread(data) {
  if (orderFlag){
    $('#thread').prepend(data);
  } else {
    $('#thread').append(data);
  }
}

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
        publishself();
        disableButtonMinute();
        textboxEmpty();
    }else{
        alert("空白では送信できません");
    }

    publishself();
}

//自分に太字で送信
function publishself() {
    // ユーザ名を取得
    const userName = $('#userName').val();
    // 入力されたメッセージを取得
    const message = $('#message').val();
    // メモの内容を表示
    toThread('<p><b>' + userName + 'さん: ' + message + '</b></p>');

    return false;
}

function enterKeyPressed() {
  // keycode13はエンターキー
  if (window.event.keyCode == 13) {

    // 投稿ボタンの属性disabledの値がtrueならば
    if( $('#publish-btn').attr('disabled') ) {
      return false;
    }

    publish();
  }
}

function disableButtonMinute(){
  // buttonタグは属性disabledをtrueにするとクリックできなくなる
  $('#publish-btn').attr('disabled', true);

  //１分後に投稿ボタンをクリック可能にする
  setTimeout(() => {
      $('#publish-btn').attr('disabled', false);
  }, 60000);
}

// サーバから受信した投稿メッセージを画面上に表示する
socket.on('receiveMessageEvent', function (data) {
  //　ascがtrueなら#threadの上、falseなら下側にメッセージを追加していく
  toThread('<p>' + data + '</p>');
});

<<<<<<< Updated upstream
//　サーバから連続投稿した際のエラーメッセージを受信する
socket.on('contPostError', function (msg) {
  alert('<p>' + msg + '</p>');
});


//threadタグ内の昇順降順を入れ替える
function switchAscDesc() {

  //　子要素を配列で取得する
  const msgs = $('#thread').children();

  //　threadのタグの子要素を全て一度削除する
  $('#thread').empty();

  // for文で配列の要素を順に描画していく
  for (let msg of msgs) {
    $('#thread').prepend('<p>' + msg.innerHTML + '</p>');
  }

  orderFlag = !orderFlag;
=======
function textboxEmpty(){
    const textbox = document.getElementById('message');
    textbox.value = '';
>>>>>>> Stashed changes
}
