let socket = io();

// socket 연결 시, connect 이벤트 호출
socket.on('connect', ()=> {
    // prompt는 window 메서드로 사용자가 text를 입력할 수 있는 알림창 띄워줌
    let name = prompt('대화명을 입력해주세요.', '');
    socket.emit('newUserConnect', name);
})

let chatWindow = document.getElementById('chatWindow');
socket.on('updateMessage', (data) => {
    // 서버에서 작성되어 전달된 텍스트 처리
    // 서버에서 전달된 경우, innerHTML에 메시지 삽입해주기
    if(data.name === 'SERVER') {
        let info = document.getElementById('info');
        info.innerHTML = data.message;
        //메시지 1초 뒤 지우기
        setTimeout(() => {
            info.innerHTML = '';
        }, 1000);
    // 사용자가 작성하여 전달된 텍스트 처리
    } else {
        let chatMessageElement = drawChatMessage(data);
        chatWindow.appendChild(chatMessageElement);

        //chatWindow의 스크롤을 chatWindow의 스크롤 높이만큼 내려주는 부분
        chatWindow.scrollTop = chatWindow.scrollHeight;
    }
});

// 채팅은 텍스트 수가 계속 늘어나야 하므로, 객체로 만들어 append 해주기
function drawChatMessage(data) {
    // 인자로 받은 data는 data.name(대화명) 과 data.message (대화텍스트)

    // createElement 메서드 통해 p태그와 span 태그 생성
    // wrap 전체 감싸기 위한 객체 , message는 메시지 담을 객체, name은 대화명 담을 객체
    let wrap = document.createElement('p');
    let message = document.createElement('span');
    let name = document.createElement('span');

    //innerText 통해 대화명과 대화를 객체에 담아주기
    name.innerText = data.name;
    message.innerText = data.message;

    // 객체 컨트롤을 위해 class 및 id 추가
    name.classList.add('output_user_name');
    message.classList.add('output_user_message');
    wrap.classList.add('output_user');
    wrap.dataset.id = socket.id;

    // wrap 객체 안에 name, message 넣어주기 
    wrap.appendChild(name);
    wrap.appendChild(message);

    return wrap;
}

let sendButton = document.getElementById('chatMessageSendBtn');
let chatInput = document.getElementById('chatInput');

sendButton.addEventListener('click', () => {
    let message = chatInput.value;
    // message 값이 빈 경우, 에러처리
    if(!message) return false;

    socket.emit('sendMessage', {
        message
    });
    // message를 emit하고 난 다음, 값 비워주기
    chatInput.value = '';
});
