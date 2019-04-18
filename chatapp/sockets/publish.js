'use strict';

// 直近の投稿ユーザー
let prePostUser;

module.exports = function (socket, io) {
    // 投稿メッセージを送信する
    socket.on('publish', function (data) {
      //　データが受け取れているか確認する
      if (!data) {
        return false;
      }
      if(!data.directmessageName){
        if (prePostUser === data.userName) {
          socket.emit('contPostError', '同じユーザが連続で投稿することはできません。');
          return false;
        }
        prePostUser = data.userName;
        const time = new Date;
        const year = time.getFullYear();
        const month = ( '00' + (time.getMonth()+1) ).slice( -2 );
        const date = ( '00' + time.getDate() ).slice( -2 );
        const hour = ( '00' + time.getHours() ).slice( -2 );
        const minute = ( '00' + time.getMinutes() ).slice( -2 );
        const second = ( '00' + time.getSeconds() ).slice( -2 );
        // データを整形して渡す
        const message = year+"/"+month+"/"+date+" "+hour+":"+minute+":"+second+"　　"+`${data.userName}#${data.socketId}さん： ${data.message}`;

        socket.broadcast.emit('receiveMessageEvent', message);
      }else{
        const time = new Date;
        const year = time.getFullYear();
        const month = ( '00' + (time.getMonth()+1) ).slice( -2 );
        const date = ( '00' + time.getDate() ).slice( -2 );
        const hour = ( '00' + time.getHours() ).slice( -2 );
        const minute = ( '00' + time.getMinutes() ).slice( -2 );
        const second = ( '00' + time.getSeconds() ).slice( -2 );
        // データを整形して渡す
        const message = "<font color = \"red\">"+year+"/"+month+"/"+date+" "+hour+":"+minute+":"+second+"　　"+`${data.userName}#${data.socketId}さんからのメッセージ： ${data.message}`+"<font>";

        socket.to(data.directmessageName).emit('receiveMessageEvent', message);
      }
    });
};
