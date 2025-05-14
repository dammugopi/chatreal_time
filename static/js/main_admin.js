console.log("main_admin");

// valiables

const chatRoom = document
  .querySelector("#room_uuid")
  .textContent.replaceAll('"', "");

console.log(chatRoom);

let chatSocket = null;

const chatLogElement = document.querySelector("#chat_log");
const chatInputElement = document.querySelector("#chat_message_input");
const chatSubmitElement = document.querySelector("#chat_message_submit");

//
// function
//

//function to scrooll to bottom
function scrollToBottom(){
  chatLogElement.scrollTop = chatLogElement.scrollHeight
}





// functin to send message to backend with websockket
function sendMessage() {
  chatSocket.send(
    JSON.stringify({
      type: "message",
      message: chatInputElement.value,
      name: document
        .querySelector("#user_name")
        .textContent.replaceAll('"', ""),
      agent: document.querySelector("#user_id").textContent.replaceAll('"', ""),
    })
  );
  chatInputElement.value = "";


}

//function that gets the data from the server and gives to fronend
function onChatMessage(data) {
  console.log("onchatMessage", data);

  if (data.type == "chat_message") {
    if (!data.agent) {
      console.log(data.agent.user);
      chatLogElement.innerHTML += `<div class="flex w-full mt-2  max-w-md justify-end  "> 
      <div class ="flex-shrink-0 h-10 w-10 rounded-full bg-gray-300 text-center pt-2">${data.initials}
          </div> 
        <div>
        

         

          <div class="bg-gray-300 p-3 rounded-l-lg rounded-br-lg">
            <p class = "text-sm">${data.message}</p>
          </div>
         
          </div>
          
          <div class= "flex-col  justify-end" >
          
          
          <span class = "w-full text-end  text-xs text-gray-500 ">${data.created_at} ago</span>
          
          </div>
          

      </div>`;
    } else {
      console.log(data.message, "from else");
      chatLogElement.innerHTML += `<div class="flex  w-full  mt-2  w-fit ml-auto justify-end "> 
      <div>

      
          
      <div class = "flex w-fit justify-end"  > 
      
          <div class="bg-blue-300 p-3 rounded-l-lg rounded-br-lg">
            <p class = "text-sm">${data.message}</p>
          </div>
  
          <div class ="h-10 w-10 rounded-full bg-gray-300 text-center pt-2">${data.initials}
          </div> 
        </div>
         <div >
          <span class = "text-center  text-xs text-gray-500 ">${data.created_at} ago</span>
        </div>
       </div>

      </div>`;
    }
  }
  
 
scrollToBottom()
}

chatSocket = new WebSocket(`ws://${window.location.host}/ws/${chatRoom}/`);

chatSocket.onmessage = function (e) {
  console.log("on message");
  onChatMessage(JSON.parse(e.data));
};
chatSocket.onopen = function (e) {
  console.log("on Open");
  scrollToBottom()
  
   
};

chatSocket.onclose = function (e) {
  console.log("on close");
};

// event

chatSubmitElement.onclick = function (e) {
  e.preventDefault();
  sendMessage();
};



chatInputElement.onkeyup = function(e){
  console.log(e)
  if(e.keyCode == 13){
    sendMessage()
  }
}