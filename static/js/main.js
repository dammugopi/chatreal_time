let chatName = "";
let chatSocket = null;
let chatWindowUrl = window.location.href;

let chatRoomUuid = Math.random().toString(36).slice(2, 12);

// console.log(chatRoomUuid)

// Element

const chatElement = document.querySelector("#chat");
const chatOpenElement = document.querySelector("#chat_open");
const chatJoinElement = document.querySelector("#chat_join");
const chatIconElement = document.querySelector("#chat_icon");
const chatWelcomeElement = document.querySelector("#chat_welcome");
const chatRoomElement = document.querySelector("#chat_room");
const chatNameElement = document.querySelector("#chat_name");
const chatLogElement = document.querySelector("#chat_log");
const chatInputElement = document.querySelector("#chat_message_input");
const chatSubmitElement = document.querySelector("#chat_message_submit");

// event listers
// document.body.innerHTML = "Hi hello";



//func to  scroll to the bootm of chat

function scrollToBottom(){
  chatLogElement.scrollTop = chatLogElement.scrollHeight
}





// function to get cookies
function getCookie(name) {
  var cookieValue = null;

  if (document.cookie && document.cookie != "") {
    var cookies = document.cookie.split(";");
    console.log(" cookies ", cookies);

    for (var i = 0; i < cookies.length; i++) {
      var cookie = cookies[i].trim();
      console.log(cookie, i, name.length);
      console.log(cookie.substring(0, name.length + 1));

      if (cookie.substring(0, name.length + 1) === name + "=") {
        cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
        console.log(cookieValue.length);
        console.log(cookieValue);
        break;
      }
    }
  }
  console.log(cookieValue);
  return cookieValue;
}

// message function

function sendMessage() {
  chatSocket.send(
    JSON.stringify({
      type: "message",
      message: chatInputElement.value,
      name: chatName,
    })
  );
  chatInputElement.value = "";
}

//on Chat Message

function onChatMessage(data) {
  console.log("onchatMessage", data);

  if (data.type == "chat_message") {
    if (data.agent) {
      console.log(data.agent);
      chatLogElement.innerHTML += `<div class=" w-full mt-2  max-w-md">
      <div  class="flex">
      <div class ="flex-shrink-0 h-10 w-10 rounded-full bg-gray-300 text-center pt-2">${data.initials}
          </div> 
    
    
          <div class="bg-gray-300 p-3 rounded-l-lg rounded-br-lg">
            <p class = "text-sm">${data.message}</p>
          </div>
      </div>
         
          
          
          <div class= "flex " >
          
          
          <span class = "w-full   text-xs text-gray-500 ">${data.created_at} ago</span>
          
          </div>
          

      </div>`;
    } else {
      console.log(data.message);
      chatLogElement.innerHTML += `<div class="flex-col w-full mt-2  max-w-md ml-auto justify-end"> 
      <div class = "flex justify-end"  > 
      
          <div class="bg-blue-300 p-3 rounded-l-lg rounded-br-lg">
            <p class = "text-sm">${data.message}</p>
          </div>
  
          <div class ="h-10 w-10 rounded-full bg-gray-300 text-center pt-2">${data.initials}
          </div> 
        </div>
        <div class="flex justify-end ">
          <span class = "text-center  text-xs text-gray-500 ">${data.created_at} ago</span>
        </div>
          

      </div>`;
    }
  }

  scrollToBottom()
}

async function joinChatRoom() {
  chatName = chatNameElement.value;
  console.log("join as", chatName);
  console.log(chatRoomUuid);

  const data = new FormData();
  data.append("name", chatName);
  data.append("url", chatWindowUrl);

  await fetch(`/create_room/${chatRoomUuid}/`, {
    method: "POST",
    headers: {
      "X-CSRFToken": getCookie("csrftoken"),
    },
    body: data,
  })
    .then((res) => res.json())
    .then((data) => {
      console.log("data", data);
    });

  chatSocket = new WebSocket(
    `ws://${window.location.host}/ws/${chatRoomUuid}/`
  );

  // to recive the message from te back end
  chatSocket.onmessage = function (e) {
    console.log("on Message");

    onChatMessage(JSON.parse(e.data));
  };

  chatSocket.onopen = function (e) {
    console.log("on open"); 
    scrollToBottom()

  };

  chatSocket.onclose = function (e) {
    console.log("on close");
  };
}

chatOpenElement.onclick = function (e) {
  e.preventDefault();
  console.log("hello");

  chatIconElement.classList.add("hidden");
  chatWelcomeElement.classList.remove("hidden");

  // return flase;
};

chatJoinElement.onclick = function (e) {
  console.log("hello");

  chatWelcomeElement.classList.add("hidden");
  chatRoomElement.classList.remove("hidden");
  joinChatRoom();
  // return flase;
};

chatInputElement.onkeyup = function (e) {
  console.log(e);
  if (e.keyCode == 13) {
    sendMessage();
  }
};

chatSubmitElement.onclick = function (e) {
  e.preventDefault();
  sendMessage();
};
