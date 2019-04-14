// use module methodology to organize code. data encapsulation allows you to hide code from outside scope. only expose the public interface (API)
 
// create first module. IIFEs allow for data privacy because it creates a new scope

// BUDGET CONTROLLER
var budgetController = (function() {
    
    // Some code
    
})();



// UI CONTROLLER
var UIController = (function() {
    
    // create an object to store all of the class names/element types, so that if you ever change class names/ids, etc., you can just alter it here rather than going through the whole code line by line
    var DOMstrings = {
        inputType: '.add__type',
        inputDescription: '.add__description',
        inputValue: '.add__value',
        inputBtn: '.add__btn'
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
        
        // rather than setting up multiple objects for the classes in other modules, we are going to expose the DOMstrings object to the public so it can be accessed by other modules and added to/utilized
        getDOMstrings: function() {
            return DOMstrings;
        }
    };
    
})();


// seperation of concerns means that each part of the app should be focused on doing one thing independently. the two moduels above are stand alon modules. we need a way to connect them

// pass two arguments into this controller to give the above two modules access to each other. the two arguments will be the two modules. it is not good practice to just use outside modules inside this one. better practice is to set them as parameters/arguments

// GLOBAL APP CONTROLLER
var controller = (function(budgetCtrl, UICtrl) {
    
    var DOM = UICtrl.getDOMstrings(); // utilize DOMstrings object in this module
    
    var ctrlAddItem = function() {
        
        // 1. Get the filed input data
        var input = UIController.getInput();
        console.log(input);
        
        // 2. Add item to budget controller
        
        // 3. Add the new item to the UI
        
        // 4. Calculate the budget
        
        // 5. Display the budget on the UI
        
    } // end function
    
    // add a click event for the information to be entered
    document.querySelector(DOM.inputBtn).addEventListener('click', ctrlAddItem); // end click listener
    
    // set keypress event on global document so that when the user presses enter, it submits the info as well. the event parameter is automatically passed into the function when the event is triggered. setting something in the parameter can give us access to this event 
    document.addEventListener('keypress', function(event) {
        
        // you can console the event and press the key you want and then look in the key's object to find the keyCode value
        if (event.keyCode === 13 || event.which === 13) {
            ctrlAddItem();
        }
        
    }); // end keypress listener
    
})(budgetController, UIController); // end controller































