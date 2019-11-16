

const budgetController = (() => {
    const Expenses = function(id, description, value) {
        this.id = id
        this.description = description
        this.value = value
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

                html = '<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>'
            }
            //Replace placeholder with some actual data
            let newHtml = html.replace('%id%',obj.id)

            newHtml = newHtml.replace('%description%',obj.description)

            newHtml = newHtml.replace('%value%',obj.value)


            //insert HTML into the dome
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
            
            document.querySelector(DOMstrings.budgetLabel).textContent = obj.budget
            document.querySelector(DOMstrings.incomeLabel).textContent = obj.totalInc
            document.querySelector(DOMstrings.expensesLabel).textContent = obj.totalExp

            if(obj.percentage > -1){
                document.querySelector(DOMstrings.percentageLabel).textContent = obj.percentage + '%'
            }
            else{
                document.querySelector(DOMstrings.percentageLabel).textContent = '---'
            }
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

    }


    const updateBudget = () => {
        //calculate the budget
        budgetCtrl.calculateBudget()

        //return budget
        const budget = budgetCtrl.getBudget()

        //display the budget in the UI
        UICtrl.displayBudget(budget) 
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
        }


    }

    const ctrlDeleteItem = (event) => {

        //I know this is hard coded :v
        const itemID = event.target.parentNode.parentNode.parentNode.parentNode.id

        if(itemID){
            const splitID = itemID.split('-')

            const type = splitID[0]

            const id = parseInt(splitID[1])


            console.log(type,id)
            //delete item from ds
            budgetCtrl.deleteItem(type , id) 
            //delete item from UI
            UICtrl.deleteListItem(itemID)

            //update and show new budget
            updateBudget()
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
        }
    }    

})(budgetController , UIController)


controller.init()