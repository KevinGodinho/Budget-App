// use module methodology to organize code. data encapsulation allows you to hide code from outside scope. only expose the public interface (API)
 
// create first module. IIFEs allow for data privacy because it creates a new scope

// BUDGET CONTROLLER
var budgetController = (function() {
    
    // create a constructor for expense objects to be created through 
    var Expense = function(id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
        this.percentage = -1;
    }; // end constructor
    
    // create a method that calculates the percentage of each input in inc and exp
    Expense.prototype.calcPercentage = function(totalIncome) {
        
        if (totalIncome > 0) {
            // take the value of the input and divide it by the total income to find the percentage of the individual inc or exp
            this.percentage = Math.round((this.value / totalIncome) * 100);
        } else {
            this.percentage = -1;
        } // end if
        
    }; // end method
    
    // create a method to return the percentage
    Expense.prototype.getPercentage = function() {
        return this.percentage;
    }; // end method
    
    // create a constructor for income objects to be created through 
    var Income = function(id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
    }; // end constructor
    
    // create function to calculate income and expenses
    var calculateTotal = function(type) {
        // set a variable to store the sum of either incomes or expenses
        var sum = 0;
        
        // loop over the exp or inc array and add contents to get the some. forEach accepts a callback function
        data.allItems[type].forEach(function(cur) {
            sum += cur.value; // this will get the value of the object that is stored in the all items object inside either the exp or inc array based on the current position in the forEach
        });
        
        data.totals[type] = sum; // store the total in the data object in the totals portion
        
    } // end function
    
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
        }, // end totals
        budget: 0,
        percentage: -1 // -1 is a value that is used to say something does not exist
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
        
        deleteItem: function(type, id) {
            var ids, index;
            
            // map loops through all of the items in the inc or exp data array, returning a new array
            ids = data.allItems[type].map(function(current){
                
                return current.id;
                
            }); // end map
            
            // indexOf returns the index number of the element of the array that is placed in the id spot
            index = ids.indexOf(id);
            
            // if the index actually has a value, then remove the element
            if (index !== -1) {
                // splice will remove elemets starting at the specified index
                data.allItems[type].splice(index, 1);
            } // end if
            
        }, // end function
        
        // create a function to calculate the budget
        calulateBudget: function() {
            
            // calculate total income and expenses
            calculateTotal('inc');
            calculateTotal('exp');
            
            // calculate the budget: income - expenses
            data.budget = data.totals.inc - data.totals.exp;
            
            // calculate the percentage of income that was spent, make sure income is greater than 0 before calculating and displaying the percentage
            if (data.totals.inc > 0) {
                data.percentage = Math.round((data.totals.exp / data.totals.inc) * 100); // multiply by one hundred to go from decimal to percentage, round the result to not get a long decimal
            } else {
                data.percentage = -1
            } // end if
            
        }, // end function
        
        calculatePercentages: function() {
            
            // we have access to the current variable, that is what cur is
            data.allItems.exp.forEach(function(cur) {
                
                cur.calcPercentage(data.totals.inc);
                
            }); // end forEach 
            
        }, // end function
        
        getPercentages: function() {
            // use map to create a new array
            var allPerc = data.allItems.exp.map(function(cur) {
                return cur.getPercentage();
            }); // end map
            
            return allPerc;
            
        }, // end function
        
        getBudget: function() {
            
            return {
                budget: data.budget,
                totalInc: data.totals.inc,
                totalExp: data.totals.exp,
                percentage: data.percentage
            }; // end return
            
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
        expensesContainer: '.expenses__list',
        budgetLabel: '.budget__value',
        incomeLabel: '.budget__income--value',
        expensesLabel: '.budget__expenses--value',
        percentageLabel: '.budget__expenses--percentage',
        container: '.container',
        expensesPercLabel: '.item__percentage',
        dateLabel: '.budget__title--month'
    }
    
    // create a function that will calculate the number format accordingly for inc and exp. plus or minus before the number, a comma seperating thousands, and 2 decimal points
    var formatNumber = function(num, type) {
            
        // abs = absolute removes the sign of the number
        num = Math.abs(num);
        num = num.toFixed(2); // set the num two decimal places
            
        // split the number at the decimal point, this will give us the integer part and the decimal part seperately
        numSplit = num.split('.'); 
            
        int = numSplit[0]; // get the integer portion
            
        // because split returns a string, we have access to the arrays index and the length of the string inside
        if (int.length > 3) {
            // substring allows you to grab at a particular index in the string and output as many characters in sequence as you like. we are grabbing the first portion and adding a comma after and then attaching the rest after the comma here
            int = int.substr(0, int.length - 3) + ',' + int.substr(int.length - 3, 3);
        } // end if
            
        dec = numSplit[1]; // get the decimal portion
            
        return (type === 'exp' ? '-' : '+') + ' ' + int + '.' + dec;
            
    }; // end function
    
    // create a function for the node list, to loop through the node list using a for loop
    var nodeListForEach = function(list, callback) {
        for (var i = 0; i < list.length; i++) {
            callback(list[i], i);
        } // end loop
    }; // end function
    
    // this method needs to be accessible from the outside, so you have to return it as an object so it can be accessed
    return {
        getInput: function() {
            // rather than having 3 variables in this function, we are going to return another object with all 3 of the variables asigned as key value pairs
            return {
                type: document.querySelector(DOMstrings.inputType).value, // value can be inc for income or exp for expenses
                description: document.querySelector(DOMstrings.inputDescription).value,
                value: parseFloat(document.querySelector(DOMstrings.inputValue).value) // parseFloat converts a string to a floating number, so it can have decimals
            };
        },
        
        addListItem: function(obj, type) {
            var html, newHtml, element;
            
            // create HTML string with placeholder text
            if (type === 'inc') {
                element = DOMstrings.incomeContainer;
                html = '<div class="item clearfix" id="inc-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            } else if (type === 'exp') {
                element = DOMstrings.expensesContainer;
                html = '<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            } // end if
            
            // replace the placeholder text with actual data from the object
            newHtml = html.replace('%id%', obj.id);
            newHtml = newHtml.replace('%description%', obj.description);
            newHtml = newHtml.replace('%value%', formatNumber(obj.value, type));
            
            // insert the HTML into the DOM
            document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);
            
        }, // end function
        
        // create a function to delete the item selected from the UI
        deleteListItem: function(selectorID) {
            var el = document.getElementById(selectorID);
          
            el.parentNode.removeChild(el);
            
        }, // end function
        
        // create a way to remove the values entered into the fields by the user in prep for the next input
        clearFields: function() {
            var fields, fieldsArr;
            
            // you need the comma because normall you would be selecting it according to HTML style text, but you have the html style stored in the DOMstrings object
            fields = document.querySelectorAll(DOMstrings.inputDescription + ', ' + DOMstrings.inputValue);
            
            // Array is the function constructor. Slice() is stored in the Array object's prototype. because slice is a function you can use call and put in the fields list to trick it into converting the list into an array. we need it to be an array so we can loop through it
            fieldsArr = Array.prototype.slice.call(fields);
            
            // use forEach to loop through the fieldsArr. place an anonymous callback function that can have up to three parameters
            fieldsArr.forEach(function(current, index, array) {
                current.value = '';
            });
            
            // set the focus back to the description input type
            fieldsArr[0].focus();
        }, // end function
        
        // create function to display the budget in the UI
        displayBudget: function(obj) {
            var type;
            
            // find if type is inc or exp for the budgetLabel
            obj.budget > 0 ? type = 'inc' : type = 'exp';
            
            // call the formatNumber function on all of the cases where numbers are displayed to the UI
            document.querySelector(DOMstrings.budgetLabel).textContent = formatNumber(obj.budget, type);
            document.querySelector(DOMstrings.incomeLabel).textContent = formatNumber(obj.totalInc, 'inc');
            document.querySelector(DOMstrings.expensesLabel).textContent = formatNumber(obj.totalExp, 'exp');
            
            // only display the percentage if it greater than 0
            if (obj.percentage > 0) {
                document.querySelector(DOMstrings.percentageLabel).textContent = obj.percentage + '%';
            } else {
                document.querySelector(DOMstrings.percentageLabel).textContent = '---';
            } // end if
            
        }, // end function
        
        // create function to display percentages 
        displayPercentages: function(percentages) {
            
            // select the element where the percentages will be displayed in the HTML
            var fields = document.querySelectorAll(DOMstrings.expensesPercLabel);
            
            nodeListForEach(fields, function(current, index) {
                
                if (percentages[index] > 0) {
                    current.textContent = percentages[index] + '%';
                } else {
                    current.textContent = '---';
                } // end if
                
            }); // end forEach
            
        }, // end function
        
        // create a function to get the current month
        displayMonth: function() {
            var now, month, months, year;
            
            now = new Date();
            
            // create an array of months to grab the index of the corresponding month to display the name and not just a number from the getMonth()
            months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
            
            month = now.getMonth();
            
            year = now.getFullYear();
            
            document.querySelector(DOMstrings.dateLabel).textContent = months[month] + ' ' + year;
            
        }, // end function
        
        // function for listener change input fields to red if exp is selected
        changedType: function() {
            
            var fields = document.querySelectorAll(
                DOMstrings.inputType + ',' + DOMstrings.inputDescription + ',' + DOMstrings.inputValue
            );
            
            nodeListForEach(fields, function(cur) {
                cur.classList.toggle('red-focus');
            }); // end forEach
            
            document.querySelector(DOMstrings.inputBtn).classList.toggle('red');
            
        }, // end function
        
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
        
        // add listener to remove items from U
        document.querySelector(DOM.container).addEventListener('click', ctrlDeleteItem);
        
        // add listener to add an event on plus and minus input to change
        document.querySelector(DOM.inputType).addEventListener('change', UICtrl.changedType); 
        
    } // end function
    
    var updateBudget = function() {
        
        // 1. Calculate the budget
        budgetCtrl.calulateBudget();
        
        // 2. Return the budget
        var budget = budgetCtrl.getBudget();
        
        // 3. Display the budget on the UI
        UICtrl.displayBudget(budget);
        
    } // end function
    
    // create a function to update the percentages of the inputs
    var updatePercentages = function() {
      
        // 1. Calculate percentages
        budgetCtrl.calculatePercentages();
        
        // 2. Read percentages from budget controller
        var percentages = budgetCtrl.getPercentages();
        
        // 3. Update the UI with new percentages
        UICtrl.displayPercentages(percentages);
        
    }; // end function
    
    var ctrlAddItem = function() {
        var input, newItem;
        
        // 1. Get the filed input data
        input = UIController.getInput();
        
        // check and make sure there is data that can be used before adding it to the UI, prevents empty lines being entered
        // isNaN checks to see if the input is NaN, so we make sure that it is not NaN, make sure value is greater than 0 because 0 is not an income or an expense
        if (input.description !== '' && !isNaN(input.value) && input.value > 0) {
            
            // 2. Add item to budget controller
            newItem = budgetCtrl.addItem(input.type, input.description, input.value);
        
            // 3. Add the new item to the UI
            UICtrl.addListItem(newItem, input.type);
        
            // 4. Clear the fields
            UICtrl.clearFields();
            
            // 5. Calculate and update budget
            updateBudget();
            
            // 6. Calculate and update percentages
            updatePercentages();
            
        } // end if
        
    }; // end function
    
    var ctrlDeleteItem = function(event) {
        var itemID, splitID, type, ID;
        
        // you can access parent nodes in the DOM with parentNode, and you can use it as many times as you want to traverse your way up the DOM
        itemID = event.target.parentNode.parentNode.parentNode.parentNode.id;
        
        // only if the element has an ID will this occur
        if (itemID) {
            
            // inc-1, split will split the element at the specified character and seperate it into any array
            splitID = itemID.split('-');
            // the first element will be inc or exp, so that will be the type
            type = splitID[0];
            // the second element will be the number that follows the type
            ID = parseInt(splitID[1]); // use parseInt to make string an integer to be compared to the array of numbers to delete the element
            
            // 1. delete item from data structure
            budgetCtrl.deleteItem(type, ID);
            
            // 2. delete item from UI
            UICtrl.deleteListItem(itemID);
            
            // 3. update and show new budget
            updateBudget();
            
            // 4. Calculate and update percentages
            updatePercentages();
            
        } // end if
        
    }; // end function
    
    // create an init function that can be accessed globally. this will give you access to the event listeners function
    return {
        init: function() {
            console.log('App start');
            UICtrl.displayMonth();
            // pass an object into the displayBudget function to set everything to 0 upon app start up
            UICtrl.displayBudget({
                budget: 0,
                totalInc: 0,
                totalExp: 0,
                percentage: -1
            });
            setupEventListeners();
        } // end function
    }; // end return
    
})(budgetController, UIController); // end controller

// call the event listeners to execute
controller.init();




























