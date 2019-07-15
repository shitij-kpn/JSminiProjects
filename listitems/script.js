var button = document.getElementById("btn")

var input = document.getElementById("ts")

var ul = document.querySelector("ul")

//writes it on the document
function lmeo(){
    let li = document.createElement("li")
    li.appendChild(document.createTextNode(input.value))
    ul.appendChild(li)
    input.value = ""
}

//returns length of the string entered
function llen(){
    return input.value.length
}

//enter is click on screen
button.addEventListener("click",()=>{
    if(llen() !== 0){
        lmeo()
    }
    else{
        alert("enter some text first")
    }
})

//enter is pressed on keyboard
input.addEventListener("keypress",(event)=>{
    if(llen() > 0 && event.keyCode === 13){
        lmeo()
    }
})