# PantryGoogleApp

## Overview

The purpose of this application is to have a simple pantry list of all items regularly bought in a Google Sheet with a column for the item name and a checkbox column to denote if the item is full. There is no usage of actual stock levels, just whether or not something needs to be replenished. The main goal is simplicity, multi user editing and customization to the users needs - which does demand some additional setup.

Included with this is the framework to use the following Google Forms:

- Add New Pantry Item - This inserts a new Item into the pantry list using a free text field
- Remove Pantry Item - This is a dropdown to remove one of the items in the list
- Pantry List - This let's the user add items to the shopping list. It does not show the status of the pantry due to Google Form limitations. Each item that is checked will be added to the shopping list and marked as empty and is essentially a "Select Items to Buy" form
- Shopping List - List of all the items marked as empty. Each item that is checked will be marked as full on form submission and removed from the shopping list

For most use cases, it is only required to use the forms which provides a better editing experience for both mobile and desktop users. These lists can be shared with other users using Google's own sharing feature and access can be controlled for each form so only certain people can add/remove stock items for example.

Each of the forms is updated when another is submitted - this is not instantaneous and does require a restart of the webpage when the form is in use to get an accurate state of the pantry. However, for small households with not many editors, this should not pose as an issue.

## Setting up

You will need to create a spreadsheet with the first row as the header. If you are importing data manually, the first column is the item name and the second column is the full status (true/false represented with checkboxes)

You then need to create forms for each of the .js files in the Forms directory, go into the script editor and paste in the source code for the corresponding form from its .js file.

Each of the forms require the following questions:

- Add Item - Short desc
- Remove Item - Dropdown
- Pantry List - Checkboxes
- Shopping List - Checkboxes

Once the forms are created, get the ID's of each of the forms and the spreadsheet and paste these into the relevant indicated places in PantryLib.js. The ID can be found in the page URL.

You then need to create an app scripts library and paste the contents of PantryLib.js into there. Make sure to call the library PantryLib. Include this library in all the form scripts as PantryLib.

Each of the forms will need a trigger to map to the onFormSubmit function when submitting the form. This will likely prompt authentication and trusting the developer (feel free to check the source code before doing this).

And that's it! Add you're items in via the Add Item form to refresh the other lists (editing the sheet won't do this by default - see Optional Step), mark items that need replenishing in the Pantry List, check items off when bought in the Shopping List, rinse and repeat.

## Optional step

For manual editing of the spreadsheet, it is advised that you use the PantrySheet.js file in the sheet's app script and trigger the function when editing. This will keep the forms in sync with the database where usually, the synchronization is called on form submit and not on form open. You can, of course change this but it's something to keep in mind.
