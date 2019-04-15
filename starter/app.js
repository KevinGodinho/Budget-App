// use module methodology to organize code. data encapsulation allows you to hide code from outside scope. only expose the public interface (API)
 
// create first module. IIFEs allow for data privacy because it creates a new scope

// BUDGET CONTROLLER
var budgetController = (function() {
    
    // create a constructor for expense objects to be created through 
    var Expense = function(id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
    } // end constructor
    
    // create a constructor for income objects to be created through 
    var Income = function(id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
    } // end constructor
    
    // create an object to store all income/expense data, rather than creating a bunch of variables
    var data = {
        // rather than just having a bunch of key value pairs in an object, create inner objects to organize the data seperately
        allItems: {
            exp: [],
            inc: [],
        }, // end allItems
        totals: {
            exp: 0,
            inc: 0
        } // end totals
    } // end object
    
    // return an object that contains all of the public methods
    return {
        // add items based on income or expense
        addItem: function(type, des, val) {
            var newItem, ID;
            
            // if there has not been any items stored in our data object yet, then evaluate based on if there is not any items to determine ID from, set ID to 0 to get started. This will set the first item's ID to 1
            if (data.allItems[type].length > 0) {
                // create new ID, this will target last element in array and add one to it for the ID
                ID = data.allItems[type][data.allItems[type].length - 1].id + 1;
            } else {
                ID = 0;
            } // end if
            
            // create new item based on inc or exp type
            if (type === 'exp') {
                newItem = new Expense(ID, des, val); // use Expense constructor to create new Object
            } else if (type === 'inc') {
                newItem = new Income(ID, des, val); // use Income constructor to create new Object
            } // end if
            
            // push the inc or exp into the allItems object in the data object above based on the value inc or exp. this will store the new items created into their own array in an object, which we can use later
            data.allItems[type].push(newItem);

            // return the new element
            return newItem;
            
        }, // end function
        
        testing: function() {
            console.log(data);
        }
        
    }; // end return
    
})(); // end budget controller



// UI CONTROLLER
var UIController = (function() {
    
    // create an object to store all of the class names/element types, so that if you ever change class names/ids, etc., you can just alter it here rather than going through the whole code line by line
    var DOMstrings = {
        inputType: '.add__type',
        inputDescription: '.add__description',
        inputValue: '.add__value',
        inputBtn: '.add__btn',
        incomeContainer: '.income__list',
        expensesContainer: '.expenses__list'
    }
    
    // this method needs to be accessible from the outside, so you have to return it as an object so it can be accessed
    return {
        getInput: function() {
            // rather than having 3 variables in this function, we are going to return another object with all 3 of the variables asigned as key value pairs
            return {
                type: document.querySelector(DOMstrings.inputType).value, // value can be inc for income or exp for expenses
                description: document.querySelector(DOMstrings.inputDescription).value,
                value: document.querySelector(DOMstrings.inputValue).value
            };
        },
        
        addListItem: function(obj, type) {
            var html, newHtml, element;
            
            // create HTML string with placeholder text
            if (type === 'inc') {
                element = DOMstrings.incomeContainer;
                html = '<div class="item clearfix" id="income-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            } else if (type === 'exp') {
                element = DOMstrings.expensesContainer;
                html = '<div class="item clearfix" id="expense-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            } // end if
            
            // replace the placeholder text with actual data from the object
            newHtml = html.replace('%id%', obj.id);
            newHtml = newHtml.replace('%description%', obj.description);
            newHtml = newHtml.replace('%value%', obj.value);
            
            // insert the HTML into the DOM
            document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);
            
        },
        
        // rather than setting up multiple objects for the classes in other modules, we are going to expose the DOMstrings object to the public so it can be accessed by other modules and added to/utilized
        getDOMstrings: function() {
            return DOMstrings;
        }
    };
    
})(); // end UI controller



// seperation of concerns means that each part of the app should be focused on doing one thing independently. the two moduels above are stand alon modules. we need a way to connect them

// pass two arguments into this controller to give the above two modules access to each other. the two arguments will be the two modules. it is not good practice to just use outside modules inside this one. better practice is to set them as parameters/arguments

// GLOBAL APP CONTROLLER
var controller = (function(budgetCtrl, UICtrl) {
    
    // create a function to hold all of the event listeners
    var setupEventListeners = function() {
        
        var DOM = UICtrl.getDOMstrings(); // utilize DOMstrings object in this module
        
        // add a click event for the information to be entered
        document.querySelector(DOM.inputBtn).addEventListener('click', ctrlAddItem); // end click listener
    
        // set keypress event on global document so that when the user presses enter, it submits the info as well. the event parameter is automatically passed into the function when the event is triggered. setting something in the parameter can give us access to this event 
        document.addEventListener('keypress', function(event) {
        
        // you can console the event and press the key you want and then look in the key's object to find the keyCode value
            if (event.keyCode === 13 || event.which === 13) {
            ctrlAddItem();
    
            } // end if
        
        }); // end keypress listener
        
    } // end function
    
    var ctrlAddItem = function() {
        var input, newItem;
        
        // 1. Get the filed input data
        input = UIController.getInput();
        
        // 2. Add item to budget controller
        newItem = budgetCtrl.addItem(input.type, input.description, input.value);
        
        // 3. Add the new item to the UI
        UICtrl.addListItem(newItem, input.type);
        
        // 4. Calculate the budget
        
        // 5. Display the budget on the UI
        
    } // end function
    
    // create an init function that can be accessed globally. this will give you access to the event listeners function
    return {
        init: function() {
            console.log('App start');
            setupEventListeners();
        } // end function
    }; // end return
    
})(budgetController, UIController); // end controller

// call the event listeners to execute
controller.init();




























