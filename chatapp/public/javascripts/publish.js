'use strict';

// 昇順降順が変わるたびに変わる
let orderFlag = true;

const ids = [];

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
    // ユーザ名を取得
    const userName = $('#userName').val();

    // 入力されたメッセージを取得
    const message = $('#message').val();
    const socketId = socket.id;

    //　メッセージIDの生成
    const messageId = generateId();

    // 投稿内容を送信

    if(message.trim() !== ''){
        socket.emit('publish', {userName: userName, message: message, socketId: socketId, messageId: messageId});
        //messageIDを各ページで共有する
        publishself(messageId);
        //1分間ボタンを押せなくする
        disableButtonMinute();
        //textboxを空に
        textboxEmpty();
    }else{
        alert("空白では送信できません");
    }
    return false;
  }

//自分に太字で送信
function publishself(id) {
    // ユーザ名を取得
    const userName = $('#userName').val();
    // 入力されたメッセージを取得
    const message = $('#message').val();
    //日時取得
    const socketId = socket.id;
    const time = new Date;
    const year = time.getFullYear();
    const month = ( '00' + (time.getMonth()+1) ).slice( -2 );
    const date = ( '00' + time.getDate() ).slice( -2 );
    const hour = ( '00' + time.getHours() ).slice( -2 );
    const minute = ( '00' + time.getMinutes() ).slice( -2 );
    const second = ( '00' + time.getSeconds() ).slice( -2 );

    // 日付部分
    const datePart = year + "/" + month + "/" + date + " " + hour + ":" + minute + ":" + second + "　　";

    //pタグのidに埋め込む
    toThread(`<p id=${id}>` + datePart + '<b>' + userName + '#' + socketId + 'さん: ' + message + '</b>' +
      `<input type="button" value="編集" onclick="editSelf(${id})" /> <input type="button" value="削除" onclick="removeSelf(${id})" /></p>`
    );

    return false;
}

function directmessage() {
    // ユーザ名を取得
    const userName = $('#userName').val();

    // 入力されたメッセージを取得
    const message = $('#message').val();
    const directmessageName = $('#directmessageName').val();
    const socketId = socket.id;
    // 投稿内容を送信
    if(message.trim() !== ''){
        socket.emit('publish', {userName: userName, message: message, socketId: socketId, directmessageName: directmessageName});
        directmessageself();
        //textboxを空に
        textboxEmpty();
    }else{
        alert("空白では送信できません");
    }
}

function directmessageself() {
    // ユーザ名を取得
    const userName = $('#userName').val();
    // 入力されたメッセージを取得
    const message = $('#message').val();
    //日時取得
    const directmessageName = $('#directmessageName').val();
    const socketId = socket.id;
    const time = new Date;
    const year = time.getFullYear();
    const month = ( '00' + (time.getMonth()+1) ).slice( -2 );
    const date = ( '00' + time.getDate() ).slice( -2 );
    const hour = ( '00' + time.getHours() ).slice( -2 );
    const minute = ( '00' + time.getMinutes() ).slice( -2 );
    const second = ( '00' + time.getSeconds() ).slice( -2 );

    // 日付部分
    const datePart = year + "/" + month + "/" + date + " " + hour + ":" + minute + ":" + second + "　　";

    toThread(`<p>` + datePart　+'<b>' + userName +'#'+socketId+ 'さんから'+directmessageName+'さんへのメッセージ: '+ message + '</b></p>');
}



function enterKeyPressed() {
  // keycode13はエンターキー
  if (window.event.keyCode == 13) {

    // 投稿ボタンの属性disabledの値がtrueならば
    if( $('#publish-btn').attr('disabled') ) {
      return false;
    }

    publish();

    //textboxを空に
    textboxEmpty();
  }
}

function generateId(){
  // 0 ~ 10000のランダムな整数を作成
  const id =  Math.floor( Math.random() * 10000 );
  if (ids.indexOf(id) !== -1) {
    return generateId();
  } else {
    ids.push(id);
    return id;
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
  toThread(`<p id=${data.id}>` + data.msg + '</p>');
});

socket.on('otherRemoveEvent', id => {
    removeComment(id);
})

socket.on('otherEditEvent', data => {
    editOtherComment(data.id, data.msg);
})

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
}


function textboxEmpty(){
    const textbox = document.getElementById('message');
    textbox.value = '';
}

function editSelf(id) {
  const msg = prompt('編集後の内容を入力してください');
  socket.emit('editEvent', {id: id, msg: msg});
  editMyComment(id, msg);
}

function removeSelf(id) {
  socket.emit('removeEvent', id);
  removeComment(id);
}

//指定IDのコメントを編集
function editMyComment(id, msg) {
  if (!msg) {
    return false;
  }
  const comment = $(`#${id} b`).text();
  const data = comment.split(' ');
  $(`#${id} b`).text(data.slice(0, -1) + ' ' + msg);
}

function editOtherComment(id, msg) {
  if(!msg) {
    return false;
  }
  const comment = $(`#${id}`).text();
  const data = comment.split(' ');
  $(`#${id}`).text(data.slice(0, -1) + ' ' + msg);
}

// 指定IDのコメントを削除
function removeComment(id) {
  $(`#${id}`).remove();
}
