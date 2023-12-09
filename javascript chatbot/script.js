const chatInput = document.querySelector(".chat-input textarea");
const sendChatBtn = document.querySelector(".chat-input span");
const chatBox = document.querySelector(".chatbox");
const chatBotToggler = document.querySelector(".chatbot-toggler");
const chatBotClosebtn = document.querySelector(".close-btn");
let inputInTheHeight = chatInput.scrollHeight;
handleClick = ()=>{
  document.body.classList.toggle("show-chatbot")
}
handleClose = ()=>{
  document.body.classList.remove("show-chatbot")
}
chatBotToggler.addEventListener("click",handleClick);
let userMessage;
const API_KEY = "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";
const generateResponse = (incomingChatLi) => {
  const API_URL = "https://api.openai.com/v1/chat/completions";
  const messageElement = incomingChatLi.querySelector("p");
  const requestOptions = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${API_KEY}`,
    },
    body: JSON.stringify({
      model: "gpt-3.5-turbo",
      "messages": [{"role": "system", "content": "You are a helpful assistant."}, {"role": "user", "content": userMessage}]
    }),
  };


  // {
  //   "model": "gpt-3.5-turbo",
  //   "messages": [{"role": "system", "content": "You are a helpful assistant."}, {"role": "user", "content": "Hello!"}]
  // }
  
  // send post request to API and get response
  fetch(API_URL, requestOptions)
    .then((response) => response.json())
    .then((data) => {
      messageElement.textContent = data.choices[0].message.content;
    })
    .catch((error) => {
      messageElement.classList.add("error");
      messageElement.textContent = "OOPS! Something went wrong.. Please try again."})
    .finally(()=> chatBox.scrollTo(0,chatBox.scrollHeight))
};

const createChatLi = (message, className) => {
  // create a chat <li> element with the given message and className
  const chatLi = document.createElement("li");
  chatLi.classList.add("chat", className);
  let chatContent =
    className === "outgoing"
      ? `<p></p>`
      : `<span id="send-btn" class="material-symbols-outlined"> smart_toy</span><p></p>`;
  chatLi.innerHTML = chatContent;
  chatLi.querySelector("p").textContent = message;
  return chatLi;
};

const handleInput = () => {
  userMessage = chatInput.value.trim();
  console.log(userMessage);
  if (!userMessage) return;
  chatInput.style.height = `${ inputInTheHeight }px`;

  //Append the users message to the chatbox
  chatBox.appendChild(createChatLi(userMessage, "outgoing"));
  chatBox.scrollTo(0,chatBox.scrollHeight)

  setTimeout(() => {
    const incomingChatLi = createChatLi("Thinking....", "incoming")
    chatBox.appendChild(incomingChatLi);
    generateResponse(incomingChatLi);
  }, 600);
};
chatInput.addEventListener("input",()=>{
  // Adjust the input tetarea according to its content 
  chatInput.style.height = `${ inputInTheHeight }px`;
  chatInput.style.height = `${ chatInput.scrollHeight }px`;

})
chatInput.addEventListener("keydown",(e)=>{
  // send a message on the click of the enter button (keyboard),
  // And go to next line on click of shift+enter
  if(e.key == "Enter" && !e.shiftkey && window.innerWidth > 180){
    e.preventDefault();
    handleInput()
  }


})
sendChatBtn.addEventListener("click", handleInput);
chatBotClosebtn.addEventListener("click", handleClose)
console.log("script is loading");
