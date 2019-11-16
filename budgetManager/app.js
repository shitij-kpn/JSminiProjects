

const budgetController = (() => {
    const Expenses = function(id, description, value) {
        this.id = id
        this.description = description
        this.value = value
        this.percentage = -1
    }

    Expenses.prototype.calcPercentage = function(totalIncome){
        if(totalIncome > 0){
            this.percentage = Math.round((this.value / totalIncome) * 100)
        }else{
            this.percentage = -1
        }
    }

    Expenses.prototype.getPercentage = function(){
        return this.percentage
    }

    const Income = function(id, description, value) {
        this.id = id
        this.description = description
        this.value = value
    }

    const data = {
        allItems : {
            exp : [],
            inc : []
        },
        totals : {
            exp : 0,
            inc : 0
        },
        budget : 0,
        percentage : -1
    }


    const calculateTotal = (type) => {
        let sum = 0

        data.allItems[type].forEach( item => {
            sum += item.value
        })

        data.totals[type] = sum
    }

    return {
        addItem : (type , des , val) => {
            let newItem
            let ID = 0

            //Create new ID

            ID = (ID > 0) ?  data.allItems[type][data.allItems[type].length -1].id + 1 :  0

            //create new item based on inc or exp
            if(type === 'exp'){
                newItem = new Expenses(ID , des , val)
            }
            else{
                newItem = new Income(ID , des , val)
            }


            //push it in the array
            data.allItems[type].push(newItem)

            return newItem
        },

        deleteItem : (type ,id) => {
            const ids = data.allItems[type].map(current => {
                return current.id
            })

            const index = ids.indexOf(id)

            if(index > -1){
                data.allItems[type].splice(index,1)    
            }
        },

        calculateBudget: () => {
            //calculate total income and expenses
            calculateTotal('exp')

            calculateTotal('inc')

            //calculate budget : income - expenses
            data.budget = data.totals.inc - data.totals.exp

            //calculate the percentage of income that we spent
            if(data.totals.inc > 0) {
                data.percentage = Math.round((data.totals.exp / data.totals.inc) * 100)
            }
            else{
                data.percentage = -1
            }
            
        },

        calculatePercentages : () => {
            data.allItems.exp.forEach(item => {
                item.calcPercentage(data.totals.inc)
            })
        },

        getPercentages : () => {
            const percentages = data.allItems.exp.map(item => {return item.getPercentage()})

            return percentages
        },

        getBudget : () => {
            return {
                budget : data.budget,
                totalInc : data.totals.inc,
                totalExp : data.totals.exp,
                percentage : data.percentage
            }
        },


        testing : () =>{
            console.table(data)
        }
    }

})()






const UIController = (() => {
    
    const DOMstrings = {
        inputType: '.add__type',
        inputDescription: '.add__description',
        inputValue: '.add__value',
        inputBtn: '.add__btn',
        incomeContainer: '.income__list',
        expensesContainer: '.expenses__list',
        budgetLabel: '.budget__value',
        incomeLabel: '.budget__income--value',
        expensesLabel: '.budget__expenses--value',
        percentageLabel: '.budget__expenses--percentage',
        container: '.container',
        expensesPercLabel: '.item__percentage',
        dateLabel: '.budget__title--month'
    }

    const formatNumber = (num ,type) => {
        num = Math.abs(num)

        num = num.toFixed(2)

        const numSplit = num.toLocaleString('en')
        
        return (type === 'exp' ? '-' : '+') + ' ' + numSplit
    }

    const nodeListForEach = (list , callback) => {
        for(let i = 0 ; i < list.length ; i++){
            callback(list[i],i)
        }
    }

    return {
        getInput: () => {
            return {
                type: document.querySelector(DOMstrings.inputType).value,
                description : document.querySelector(DOMstrings.inputDescription).value,
                value : parseFloat(document.querySelector(DOMstrings.inputValue).value)
            }
        },

        addListItem : (obj , type) => {
            //create HTML string with placeHolder Text
            let element
            let html
            
            if(type === 'inc'){

                element = DOMstrings.incomeContainer

                html = '<div class="item clearfix" id="inc-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>'
            }
            else{

                element = DOMstrings.expensesContainer

                html = '<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage"></div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>'
            }
            //Replace placeholder with some actual data
            let newHtml = html.replace('%id%',obj.id)

            newHtml = newHtml.replace('%description%',obj.description)

            newHtml = newHtml.replace('%value%',formatNumber(obj.value , type))


            //insert HTML into the dom
            document.querySelector(element).insertAdjacentHTML('beforeend',newHtml)
        },

        deleteListItem: (id) => {
            const selectorID = document.getElementById(id)

            selectorID.parentNode.removeChild(selectorID)
        },

        clearFields : () => {
            let fields = document.querySelectorAll(DOMstrings.inputDescription + ',' + DOMstrings.inputValue)

            const fieldsArr = Array.prototype.slice.call(fields)

            fieldsArr.forEach(current => {
                current.value = ''
            })

            fieldsArr[0].focus()
        },

        displayBudget : (obj) => {
            
            document.querySelector(DOMstrings.budgetLabel).textContent = formatNumber(obj.budget , 'inc')
            document.querySelector(DOMstrings.incomeLabel).textContent = formatNumber(obj.totalInc,'inc')
            document.querySelector(DOMstrings.expensesLabel).textContent = formatNumber(obj.totalExp,'exp')

            if(obj.percentage > -1){
                document.querySelector(DOMstrings.percentageLabel).textContent = obj.percentage + '%'
            }
            else{
                document.querySelector(DOMstrings.percentageLabel).textContent = '---'
            }
        },


        displayPercentages: (percentages) => {   //array


            const fields = document.querySelectorAll(DOMstrings.expensesPercLabel)


            nodeListForEach(fields , (current , index) => {
                if(percentages[index] > 0){
                    current.textContent = percentages[index] + '%'
                }else{
                    current.textContent = '---'
                }
            })
        },

        displayDate:() => {
            const now = new Date()

            const year = now.getFullYear()

            document.querySelector(DOMstrings.dateLabel).textContent = year
            
            
        },

        toggleTheme:() => {
            const fields = document.querySelectorAll(DOMstrings.inputType + ',' + DOMstrings.inputValue + ',' + DOMstrings.inputDescription)

            nodeListForEach(fields , (current , index) => {
                current.classList.toggle('red-focus')

            })

            document.querySelector(DOMstrings.inputBtn).classList.toggle('red')
        },
        

        getDOMstrings: () =>  DOMstrings
    }
})()





//Global App Controller

const controller = ((budgetCtrl , UICtrl)=>{
    
    const setUpEventListeners = () => {

        const DOM = UICtrl.getDOMstrings()

        document.querySelector(DOM.inputBtn).addEventListener('click',ctrlAddItem)

        document.addEventListener('keypress',(event)=>{
            if(event.keyCode === 13){
                ctrlAddItem();
            }
        })

        document.querySelector(DOM.container).addEventListener('click',ctrlDeleteItem);

    
        document.querySelector(DOM.inputType).addEventListener('change',UICtrl.toggleTheme)
    }


    const updateBudget = () => {
        //calculate the budget
        budgetCtrl.calculateBudget()

        //return budget
        const budget = budgetCtrl.getBudget()

        //display the budget in the UI
        UICtrl.displayBudget(budget) 
    }    

    const updatePercentage = () => {
        //calculate percentages 
        budgetCtrl.calculatePercentages()

        //read percentages from budget controller
        const percentages = budgetCtrl.getPercentages()

        //update UI with new percentages
        UICtrl.displayPercentages(percentages)

         
    }

    const ctrlAddItem = () => {
        
        //Get input field data
        const {type , description, value} = UICtrl.getInput()


        if(description !== '' && !isNaN(value)  &&  value > 0){
            //Add item to budget controller
            const newItem =  budgetCtrl.addItem(type , description, value)

            //Add Item to the UI
            UICtrl.addListItem(newItem , type)

            UICtrl.clearFields()

            //calculate and update budget
            updateBudget()

            //calculate and update percentages
            updatePercentage()

        }


    }

    const ctrlDeleteItem = (event) => {

        //I know this is hard coded :v
        const itemID = event.target.parentNode.parentNode.parentNode.parentNode.id

        if(itemID){
            const splitID = itemID.split('-')

            const type = splitID[0]

            const id = parseInt(splitID[1])


            //delete item from ds
            budgetCtrl.deleteItem(type , id) 
            //delete item from UI
            UICtrl.deleteListItem(itemID)

            //update and show new budget
            updateBudget()

            //update and percentages
            updatePercentage()
        }
    }

    

    return {
        init : () => {
            setUpEventListeners()
            UICtrl.displayBudget({
                budget : 0,
                totalInc : 0,
                totalExp : 0,
                percentage : -1
            })
            UICtrl.displayDate()
        }
    }    

})(budgetController , UIController)


controller.init()