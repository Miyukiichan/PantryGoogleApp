//Sheet indexing starting at 1 - assumes no data between item name and value columns
//Conventional setup - first line is header, first column is name, second column is value
//Only thing to change in this file is the ID's of the various google forms and spreadsheet that need creating
const headerLine = 1;
const nameCol = 1;
const valueCol = 2;
const startLine = headerLine + 1;
const nameIdx = nameCol - 1;
const valueIdx = valueCol - 1;
//For new pantry items they will be set to this by default
const defaultValue = false;

function createShoppingList() {
  createList(getShoppingListForm(), false);
}

function createPantryList() {
  createList(getPantryForm(), true);
}

function createRemoveItemDropdown() {
  var sheet = getThatSheet();
  data = sheet
    .getRange(startLine, nameCol, sheet.getLastRow() - 1, 1)
    .getValues();
  var dropdown = getRemoveItemForm().getItems()[0].asListItem();
  dropdown.setChoiceValues(data);
}

function refreshLists() {
  createShoppingList();
  createPantryList();
  createRemoveItemDropdown();
}

//Generate checkbox list for form + whether to just include unchecked items or all items
function createList(form, includeAll) {
  var sheet = getThatSheet();
  var data = sheet
    .getRange(startLine, nameCol, sheet.getLastRow() - 1, valueCol)
    .getValues();
  var choicesItem = form.getItems()[0].asCheckboxItem();
  var choices = data.filter((d) => d[valueIdx] == false || includeAll);
  choices = choices.map((d) => choicesItem.createChoice(d[nameIdx]));
  if (choices.length > 0) {
    choicesItem.setChoices(choices);
  }
  //Cannot have empty list so provide empty option
  else choicesItem.setChoices([choicesItem.createChoice("")]);
}

//Write values to the sheet based on the corresponding names
//Invert sets the sheet value to the opposite of the form checkstate
function setValuesFromResponse(form, invert = false) {
  var responseValue = getFirstResponseValue(form);
  var sheet = getThatSheet();
  var data = sheet.getDataRange().getValues();
  var formIndex = 0;
  for (var i = headerLine; i < data.length; i++) {
    if (formIndex >= responseValue.length) break;
    if (data[i][nameIdx] == responseValue[formIndex]) {
      sheet.getRange(i + 1, valueCol).setValue(!invert);
      formIndex++;
    }
  }
  refreshLists();
}

function addPantryItem() {
  var sheet = getThatSheet();
  var value = getFirstResponseValue(getNewItemForm());
  //Check for dupes
  var row = findFirstItemInSheet(value);
  if (!(isNaN(row) || row == null)) return;
  sheet.appendRow([value, defaultValue]);
  sortSheet();
  var range = sheet.getRange(startLine, valueCol, sheet.getLastRow() - 1);
  range.insertCheckboxes();
  refreshLists();
}

function removePatryItem() {
  var sheet = getThatSheet();
  var response = getFirstResponseValue(getRemoveItemForm());
  if (response == "") return;
  var range = findFirstItemInSheet(response);
  var row = range.getRow();
  if (isNaN(row)) return;
  sheet.deleteRow(row);
  refreshLists();
}

function submitShoppingList() {
  setValuesFromResponse(getShoppingListForm());
}

function submitPatryList() {
  setValuesFromResponse(getPantryForm(), true);
}

function findFirstItemInSheet(text) {
  var finder = getThatSheet().createTextFinder(text);
  return finder.findNext();
}

function getFirstResponseValue(form) {
  var responses = form.getResponses();
  if (responses.length == 0) return;
  var response = responses[responses.length - 1];
  return response.getItemResponses()[0].getResponse();
}

function sortSheet() {
  var sheet = getThatSheet();
  var range = sheet.getRange(startLine, nameCol, sheet.getLastRow(), valueCol);
  range.sort({ column: nameCol, ascending: true });
}

function getThatSheet() {
  return SpreadsheetApp.openById("SPREADSHEET_ID_HERE").getSheetByName(
    "Pantry"
  );
}

function getShoppingListForm() {
  return FormApp.openById("SHOPPING_LIST_ID_HERE");
}

function getPantryForm() {
  return FormApp.openById("PANTRY_FORM_ID_HERE");
}

function getNewItemForm() {
  return FormApp.openById("NEW_ITEM_FORM_HERE");
}

function getRemoveItemForm() {
  return FormApp.openById("REMOVE_ITEM_FORM_HERE");
}
