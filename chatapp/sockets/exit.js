'use strict';

module.exports = function (socket) {
    // 退室メッセージをクライアントに送信する
    socket.on('exit', function (data) {
      data += 'さんが退室しました。';
      socket.broadcast.emit('exitOtherEvent', data);
    });
};
