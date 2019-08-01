// this gives us the order of the buttons, which we can use to step through the buttons in various directions
// since we know the layout, + 1 moves to the next item, -1 previous, +4 is one row down, -4 is one row up
buttonOrder = ["#button7","#button8","#button9","#buttonDivide","#button4","#button5","#button6","#buttonMultiply","#button1","#button2","#button3","#buttonAdd","#button0","#buttonClear","#buttonEquals","#buttonSubtract"];

// add the selected class to an item. you can pass this any jquery selector, such as #id or .class
// calling this will de-select anything currently selected
function selectItem(name) {
	$("button").removeClass("cursor");
	$(name).addClass("cursor")
}

// gets the currently selected item, and returns its #id
// returns null if no item is selected
// note that if multiple items are selected, this will only return the first
// but you could rewrite this to return a list of items if you wanted to track multiple selections
function getSelectedItem() {
	selected = $(".cursor"); // this returns an array
	if (selected.length == 0) {
		return null;
	}
	else {
		return "#" + selected.first().attr('id')
	} 
}

// the next four functions move the selected UI control
// this uses the array buttonOrder to know the order of the buttons. so you could change buttonOrder
// to change the order that controls are highlighted/
// if no button is currently selected, such as when the page loads, this will select the first
// item in buttonOrder (which is the 7 button)
// selectNext: go to the right, wrapping around to the next row
// selectPrevious: go to the left, wrapping around to the previous row
// selectUp: select the item above
// selectDown: select the item below

function selectNext() {
	selected = getSelectedItem()
	if (selected == null) {
		selectItem(buttonOrder[0]);
	} else {
		index = buttonOrder.indexOf(selected);
		index = (index + 1) % buttonOrder.length;
		selectItem(buttonOrder[index])
	}
}

function selectPrevious() {
	selected = getSelectedItem()
	if (selected == null) {
		selectItem(buttonOrder[0]);
	} else {
		index = buttonOrder.indexOf(selected);
		index = (index - 1);
		if (index < 0) index = buttonOrder.length + index
		selectItem(buttonOrder[index])
	}	
}

function selectUp() {
	selected = getSelectedItem()
	if (selected == null) {
		selectItem(buttonOrder[0]);
	} else {
		index = buttonOrder.indexOf(selected);
		index = (index - 4);
		if (index < 0) index = buttonOrder.length + index
		selectItem(buttonOrder[index])
	}
}

function selectDown() {
	selected = getSelectedItem()
	if (selected == null) {
		selectItem(buttonOrder[0]);
	} else {
		index = buttonOrder.indexOf(selected);
		index = (index + 4) % buttonOrder.length;
		selectItem(buttonOrder[index])
	}
}

// actuate the currently selected item
// if no item is selected, this does nothing
// if multiple items are selected, this selects the first
function clickSelectedItem() {
	whichButton = getSelectedItem();
	if (whichButton != null) {
		$(whichButton).click();
	}
}

// this function responds to user key presses
// you'll rewrite this to control your interface using some number of keys
$(document).keydown(function(event) {
	
	var keyCode = (event.keyCode ? event.keyCode : event.which);
	if (event.key == "a")
	{
		alert("You pressed the 'a' key!");	
	} 
	else if (event.key == "b") 
	{
		alert("You pressed the 'b' key!");
	}
	else if(keyCode==37) // left-arrow button
    {
		selectPrevious();
    }
	else if(keyCode==38) // up-arrow button
    {
		selectUp();
    }
    else if(keyCode==39) // right-arrow button
    {
		selectNext();
    }
	else if(keyCode==40) // down-arrow button
    {
		selectDown();
    }
	else if(keyCode==13) // enter buttons
	{
		clickSelectedItem();		
    }
	
	else if(keyCode==32) // space button
    {
		if(isRow)
			selectNextRow();
		else
			selectNext();
    }
	else if(keyCode==18) // 0 buttons
	{
		if(isRow)
			clickSelectedRow();
		else
			clickSelectedItem();
    }
		
})

$('input.foo').bind('keyup', 'ctrl+z', function(){
	alert("shortcup");
	if(!isRow)
	{
		selectItem(null);
		isRow = true;
	}
});


/* calculator stuff below here */
// for operations, we'll save + - / *
firstValue = null;
operation = null;
addingNumber = false;

digits = "0123456789"
operators = "+-*/"

// handle calculator functions. all buttons with class calcButton will be handled here
$(".calcButton").click(function(event) {
	buttonLabel = $(this).text();
	
	// if it's a number, add it to our display
	if (digits.indexOf(buttonLabel) != -1) {
		// if we weren't just adding a number, clear our screen
		if (!addingNumber) {
			$("#number_input").val("")
		}
		$("#number_input").val($("#number_input").val() + buttonLabel);
		addingNumber = true;
	// if it's an operator, push the current value onto the stack
	} else if (operators.indexOf(buttonLabel) != -1) {
		// have we added a number? if so, check our stack
		if (addingNumber) {
			// is this the first number on the stack?
			// if so, save it
			if (firstValue == null) {
				firstValue = $("#number_input").val();
				addingNumber = false;
			// do we have a number on the stack already? if so, this is the same as equals
			} else if (firstValue != null) {
				secondValue = $("#number_input").val();
				evaluateExpression(firstValue,operation,secondValue)
				// in this case, keep the operation
				firstValue = $("#number_input").val();
				addingNumber = false;
			}
		}
		// either way, save this as the most recent operation
		operation = buttonLabel;
	} else if (buttonLabel == "C") {
		$("#number_input").val("");
		firstValue = null;
		operation = null;
		addingNumber = false;
	} else if (buttonLabel == "=") {
		if (firstValue != null && operation != null && addingNumber) {
			secondValue = $("#number_input").val();
			evaluateExpression(firstValue,operation,secondValue);
			// clear our state
			firstValue = null;
			operation = null;
			addingNumber = true
		}
	}
})

// do the math for our calculator
function evaluateExpression(first,op,second) {
	output = 0;
	if (op == "+") {
		output = parseInt(first) + parseInt(second);
	} else if (op == "-") {
		output = parseInt(first) - parseInt(second);
	} else if (op == "*") {
		output = parseInt(first) * parseInt(second);
	} else if (op == "/") {
		output = parseInt(first) / parseInt(second);
	}
	
	// now, handle it
	$("#number_input").val(output.toString());
	// deal with state elsewhere
}


/* ROW SELECTIONS: */
rowOrder = ["#row_1", "#row_2", "#row_3", "#row_4"];
rowFirstOrder = ["#button7", "#button4", "#button1", "#button0"]
isRow = true;

// add the selected class to an item. you can pass this any jquery selector, such as #id or .class
// calling this will de-select anything currently selected
function selectRow(name) {
	$(".calculator_row").removeClass("cursorRow");
	$(name).addClass("cursorRow")
}

// gets the currently selected item, and returns its #id
// returns null if no item is selected
// note that if multiple items are selected, this will only return the first
// but you could rewrite this to return a list of items if you wanted to track multiple selections
function getSelectedRow() {
	selectedRow = $(".cursorRow"); // this returns an array
	if (selectedRow.length == 0) {
		return null;
	}
	else {
		return "#" + selectedRow.first().attr('id')
	} 
}

function selectNextRow() 
{
	isRow = true;
	selectedRow = getSelectedRow();
	if (selectedRow == null) {
		selectRow(rowOrder[0]);
	} else {
		indexRow = rowOrder.indexOf(selectedRow);
		indexRow = (indexRow + 1) % rowOrder.length;
		selectRow(rowOrder[indexRow])
	}
}

// actuate the currently selected item
// if no item is selected, this does nothing
// if multiple items are selected, this selects the first
function clickSelectedRow() {
	isRow = false;
	whichRow = getSelectedRow();
	
	//*
	var rowContainer = document.getElementById(whichRow.substring(1));
	//alert(rowContainer);
	var rowButtons = rowContainer.getElementsByClassName("calcButton");
	alert(rowButtons[0].id);
	//alert(rowButtons.getAttribute('id'));
	//var buttonOrderInRow = rowButtons.map(btn => btn.id);
	//alert(buttonOrderInRow);
	//*/
	
	if (whichRow != null) {
		//$(whichRow).click();
		first_button_in_row = rowFirstOrder[indexRow];
		alert("you selected row "+whichRow);
		alert("first_button_in_row "+first_button_in_row);
		selectItem(first_button_in_row);
	}
}

function selectNextInRow() {
	selected = getSelectedItem()
	if (selected == null) {
		selectItem(buttonOrder[0]);
	} else {
		index = buttonOrder.indexOf(selected);
		index = (index + 1) % buttonOrder.length;
		selectItem(buttonOrder[index])
	}
}