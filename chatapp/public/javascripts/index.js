'use strict';

function getValue(){
    const userName = $('#userName').val();
    return userName;
}

// チャットルームに入室する
function enter() {
    // 入力されたユーザ名を取得する
    const userName = getValue();
    if (userName === ''){
        alert("ユーザー名が入力されていません");
    }else{
    // ユーザ名が未入力でないかチェックする


        $('form').submit();
    }
}
