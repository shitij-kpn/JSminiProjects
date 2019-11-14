const operators = document.getElementsByClassName("operator")

const numbers = document.getElementsByClassName("number")

//
const getHistory = () => document.getElementById("history-value").innerText

const printHistory = num => {
    document.getElementById("history-value").innerText = num
}



//
const getOutput = () => document.getElementById("output-value").innerText

const printOutput = num => {

    if(num==""){
        document.getElementById("output-value").innerText = ""
    }
    else{
        document.getElementById("output-value").innerText = getFormattedNumber(num)
    }
}


//"99999" to "99,999"
const getFormattedNumber = num => {
    if(num=='-'){
        return ""
    }
    
    let n = Number(num)
    let value = n.toLocaleString("en")
    return value
}


//"99,999" to 99999
const reverseNumberFormat = num => {
    return Number(num.replace(/,/g,''))
}


for(let i=0;i<operators.length;i++){
    operators[i].addEventListener('click',function(){
        if(this.id == "clear"){
            printHistory("")
            printOutput("")
        }
        else if(this.id == 'backspace'){
            let output = reverseNumberFormat(getOutput()).toString()
            if(output){
                output= output.substr(0,output.length-1)
                printOutput(output)
            }
        }
        else{
            let output = getOutput()
            let history = getHistory()
            if(output==""&&history!=""){
				if(isNaN(history[history.length-1])){
					history= history.substr(0,history.length-1)
				}
			}
            if(output!="" || history!=""){
                output= output=="" ? output : reverseNumberFormat(output)
                history = history+output
                if(this.id=='='){
                    let result = eval(history)
                    printOutput(result)
                    printHistory("")
                }
                else{
                    history = history+this.id;
                    printOutput("")
                    printHistory(history)
                }
            }
        }
    })
}

for(let i=0;i<numbers.length;i++){
    numbers[i].addEventListener('click',function(){
        let output = reverseNumberFormat(getOutput())
        if(output!=NaN){
            output=output + this.id
            printOutput(output)
        }
    })
}




