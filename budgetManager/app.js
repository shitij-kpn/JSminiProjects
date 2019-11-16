

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
        }
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
                value : document.querySelector(DOMstrings.inputValue).value
            }
        },

        addListItem : (obj , type) => {
            //create HTML string with placeHolder Text
            let element
            let html
            
            if(type === 'inc'){

                element = DOMstrings.incomeContainer

                html = '<div class="item clearfix" id="income-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>'
            }
            else{

                element = DOMstrings.expensesContainer

                html = '<div class="item clearfix" id="expense-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>'
            }
            //Replace placeholder with some actual data
            let newHtml = html.replace('%id%',obj.id)

            newHtml = newHtml.replace('%description%',obj.description)

            newHtml = newHtml.replace('%value%',obj.value)


            //insert HTML into the dome
            document.querySelector(element).insertAdjacentHTML('beforeend',newHtml)
        },

        clearFields : () => {
            let fields = document.querySelectorAll(DOMstrings.inputDescription + ',' + DOMstrings.inputValue)

            const fieldsArr = Array.prototype.slice.call(fields)

            fieldsArr.forEach(current => {
                current.value = ''
            })

            fieldsArr[0].focus()
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

    }

    

    const ctrlAddItem = () => {
        
        //Get input field data
        const {type , description, value} = UICtrl.getInput()

        //Add item to budget controller
        const newItem =  budgetCtrl.addItem(type , description, value)

        //Add Item to the UI
        UICtrl.addListItem(newItem , type)

        UICtrl.clearFields()

        //calculate the budget


        //display the budget in the UI

    }


    return {
        init : () => {
            setUpEventListeners()
        }
    }    

})(budgetController , UIController)


controller.init()