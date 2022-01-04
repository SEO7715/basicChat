// 설치한 express 모듈 불러오기 
const express = require('express');

// 설치한 socket.io 모듈 불러오기
const socket = require('socket.io');

// node.js 기본 내장 모듈 불러오기
const http = require('http');

// express 객체 생성
const app = express();

//  express http 서버 생성
const server = http.createServer(app);

// 기본 내장 모듈 fs(file system) 불러오기
const fs = require('fs');

//  생성된 서버를 socket.io에 바인딩
const io = socket(server);

// express 객체의 src 폴더 접근 권한 설정해주기
// express의 use 메서드를 통해 정적 파일 설정해주기
app.use(express.static('src'));

app.get('/', (req, res) => {
    // fs 메소드 중, 파일 전체를 비동기로 읽어오는 readFile(파일명, 옵션(인코딩 문자열), 콜백함수) 
    fs.readFile('./src/index.html', (err, data) => {
        if(err) throw err;
    // http의 메서드인 writeHead는 응답 스트림에 헤더와 상태코드 작성
        res.writeHead(200, {
            'content-type': 'text/html'
        })
    // write 메서드는 응답 body 작성
        .write(data)
    // write를 통해 응답 전송한 다음 end 메서드를 통해 필히 요청 전송을 종료해주어야함
        .end();
    });
  });

// 서버와 클라이언트 통신 위한 연결 설정
// io.sockets는 스스로를 포함한 모든 소켓의 객체
// connection 이벤트는 소켓 연결되면 호출되는 이벤트
// on 메서드를 통해 이벤트 바인딩, emit 메서드를 통해 이벤트 호출
// socket은 접속된 해당 소켓의 객체
// socket 연결 중 어떤 이벤트를 바인딩하고자하면, connetction 콜백함수 스코프 내부에 이벤트 리스너 작성해주기
io.sockets.on('connection', (socket) => {
    socket.on('newUserConnect', (name) => {
        socket.name = name;

        io.sockets.emit('updateMessage', {
            name : 'SERVER', //newUserConnect는 서버에서 전달하는 메세지이므로
            message : name + '님이 입장했습니다.'
        });
    });

    socket.on('disConnect', () => {
        // socket.broadcast는 스스로를 제외한 전체 소켓
        io.sockets.emit('updateMessage', {
            name : 'SERVER', //newUserConnect는 서버에서 전달하는 메세지이므로
            message : socket.name + '님이 퇴장했습니다.'
        });
    });
    socket.on('sendMessage', (data) => {
        data.name = socket.name;
        io.sockets.emit('updateMessage', data);
    });
});



// 서버를 4000 포트로 listen // listen(port, listener)
server.listen(4000, () => {
    console.log('✅ Listening on at http://localhost:4000 ')
});

