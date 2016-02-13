// create a new to-do
function createNewToDo()
{
    var todoDictionary = {};
 
    // prompt the user to enter to-do
    var todo = prompt("To-Do","");
    if (todo != null)
    {
        if (todo == "")
        {
            alert("To-Do can't be empty!");
        }
        else
        {
            // append the new to-do with the table
            todoDictionary = { check : 0 , text : todo};
            addTableRow(todoDictionary, false);
        }
    }
 
}

// add a row to the table
var rowID = 0;
function addTableRow(todoDictionary, appIsLoading)
{
    rowID +=1;
    var table = document.getElementById("dataTable");
    var rowCount = table.rows.length;
    var row = table.insertRow(rowCount);
 
    // create the checkbox
    var cell1 = row.insertCell(0);
    var element1 = document.createElement("input");
    element1.type = "checkbox";
    element1.name = "chkbox[]";
    element1.checked = todoDictionary["check"];
    element1.setAttribute("onclick", "checkboxClicked()");
    cell1.appendChild(element1);
 
    // create the textbox
    var cell2 = row.insertCell(1);
    var element2 = document.createElement("input");
    element2.type = "text";
    element2.name = "txtbox[]";
    element2.size = 16;
    element2.id = "text" + rowID;
    element2.value = todoDictionary["text"];
    element2.setAttribute("onchange", "saveToDoList()");
    cell2.appendChild(element2);
 
    // create the view button
    var cell3 = row.insertCell(2);
    var element3 = document.createElement("input");
    element3.type = "button";
    element3.id = rowID;
    element3.value = "View";
    element3.setAttribute("onclick", "viewSelectedRow(document.getElementById('text' + this.id))");
    cell3.appendChild(element3);
 
    // create the delete button
    var cell4 = row.insertCell(3);
    var element4 = document.createElement("input");
    element4.type = "button";
    element4.value = "Delete";
    element4.setAttribute("onclick", "deleteSelectedRow(this)");
    cell4.appendChild(element4);
 
    // update the UI and save the to-do list
    checkboxClicked();
    saveToDoList();
 
    if (!appIsLoading) alert("Task Added Successfully.");
}
// add the strike-through styling to completed tasks
function checkboxClicked()
{
    var table = document.getElementById("dataTable");
    var rowCount = table.rows.length;
 
    // loop through all rows of the table
    for(var i = 0; i < rowCount; i++)
    {
        var row = table.rows[i];
        var chkbox = row.cells[0].childNodes[0];
        var textbox = row.cells[1].childNodes[0];
 
        // if the checkbox is checked, add the strike-through styling
        if(null != chkbox && true == chkbox.checked)
        {
            if(null != textbox)
            {       
                textbox.style.setProperty("text-decoration", "line-through");
            }
        }
 
        // if the checkbox isn't checked, remove the strike-through styling
        else
        {
            textbox.style.setProperty("text-decoration", "none");
        }
 
    }
 
    // save the to-do list
    saveToDoList();
} 
// view the content of the selected row
       
        function viewSelectedRow(todoTextField)
        {
            alert(todoTextField.value);
        }

    