// Framework using MySql

// function sort(pOrderByElementIndex) {

// 	let table = document.getElementById(gTableDivId);
// 	let rows = table.getElementsByTagName('tr');
// 	let rowsArray = Array.from(rows);

// 	let columnValues = rowsArray.map((row, rowIndex) => ({
// 		[rowIndex]: row.cells[pOrderByElementIndex].textContent
// 	}));


// 	console.log(columnValues);
// 	// console.log(columnValues.sort((key, element) => key.value.localeCompare(element.value)));
// 	// console.log(columnValues.sort((a, b) => a.value.localeCompare(b.value)));
// 	// console.log(pOrderByElementIndex[0]);
// }

// function reverseTable() {
//     var tableBody = document.getElementById("tbody");

//     var rows = Array.from(tableBody.rows);

//     rows.reverse();

//     tableBody.innerHTML = "";

//     rows.forEach(row => {
//         tableBody.appendChild(row);
//     });
// }

// function removeSpans(spans) {
// 	spans.forEach(function(span) {
// 	    span.parentNode.removeChild(span);
// 	});
// }

async function sortTable(pHeaderIndex) { 

	console.log("sort");
}

// 	// var table = document.getElementById(gTableDivId).childNodes[0];
// 	var header = document.getElementById(gHeaders[pHeaderIndex]);
// 	var column = gHeaders[pHeaderIndex];

// 	if (gFieldNames.includes(column)) {
// 		var existingSpan = header.querySelector("span");

// 		if (existingSpan) {
// 			if (existingSpan.className === "glyphicon glyphicon-triangle-bottom") {
// 				existingSpan.className = "glyphicon glyphicon-triangle-top";
// 			} else {
// 				existingSpan.className = "glyphicon glyphicon-triangle-bottom"
// 			}
// 			reverseTable();
// 		} else {
// 			gRecords.sort((a, b) => {
// 		        if (typeof a[column] === 'string') {
// 		            return a[column].localeCompare(b[column]);
// 		        }
// 		        else if (typeof a[column] === 'number') {
// 		            return a[column] - b[column];
// 		        }
// 		        else {
// 		            return 0;
// 		        }
// 		    });

// 		    var spans = document.querySelectorAll('span');

// 	    	if (spans) {
// 	    		removeSpans(spans);
// 	    	}

// 	    	var headerSpan = document.createElement("span");
// 	    	headerSpan.className = "glyphicon glyphicon-triangle-bottom";
// 	    	header.appendChild(headerSpan);
// 		    var tableBody = document.getElementById("tbody");

// 		    tableBody.innerHTML = "";
// 	    	gRecords.forEach(async function(record) {
// 		    	var newRow = await createTableRow(record);
// 		    	console.log(newRow);
// 		        tableBody.appendChild(newRow);
// 		    });
// 		}
// 	}
// }

async function searchRecord(pSearchTerm) {

	if (pSearchTerm.trim() !== '') {

		let searchUrl = `searchRecord.jsp?${gParameterNameOfTableName}=${gTableName}&searchTerm=${pSearchTerm}`;
		console.log(searchUrl);
		let response = await fetch(searchUrl);
		gRecords = await response.json();

		await showAllRecords(gRecords, gFieldNames);
	}
	else {

		await loadAllRecords();
		await showAllRecords(gRecords, gFieldNames);
	}
}

async function deleteRecord(pButton) {

	let row = pButton.parentNode.parentNode;

	let confirmationForDelete = confirm(`Are you sure to delete ${gFieldNames[0]} '${row.id}'?`);

	if (confirmationForDelete == true) {

		let urlToDeleteRecord = `http://138.68.140.83:8080/Prasad/deleteRecord.jsp?${gParameterNameOfTableName}=${gTableName}&${gFieldNames[0]}=${row.id}`;

		// console.log(urlToDeleteRecord);
		let response = await fetch(urlToDeleteRecord);
		let result = await response.text()
		result = result.trim();

		if (result > 0) {

			row.remove();
			showMessage(gFieldNames[0] + " '" + row.id + "' is deleted successfully.");
		}
		else if (result >= 1000) {

			let errorMessage = await getErrorMessage(result);

			if (errorMessage !== null) {

				showMessage(errorMessage);
			}
		}
		else {

			showMessage(result);
		}
	}
}

function showMessage(pMessage) {

	// document.getElementById(gMessageDivId).textContent = pMessage;
	alert(pMessage);
}

async function getFieldNames() {

	let fieldNamesUrl = `http://138.68.140.83:8080/Prasad/getFieldNames.jsp?${gParameterNameOfTableName}=${gTableName}`;

	let response = await fetch(fieldNamesUrl);

	let rFieldNames = await response.json();

	return rFieldNames["Field"];
}

function getTextBoxes(pFieldNames) {

	// let textBoxElements = document.getElementsByClassName("textBoxes");

	// let rTextBoxes = Array.from(textBoxElements);

	let rTextBoxes = [];

	for (let fieldName of pFieldNames) {

		rTextBoxes.push(document.getElementById(fieldName));
	}

	return rTextBoxes;
}

async function getRecord() {

	let textBoxes = getTextBoxes(gFieldNames);

	let rRecord = [];

	for (let index = 0; index < textBoxes.length; index++) {

		rRecord.push(document.getElementById(textBoxes[index].id).value);
	}

	return rRecord;
}

async function getErrorMessage(pErrorNumber) {

	let urlToSelectErrorMessage = `http://138.68.140.83:8080/Prasad/getErrorMessage.jsp?ErrorNumber=${pErrorNumber}`;

	let response = await fetch(urlToSelectErrorMessage);
	let errorMessage = await response.text();
	errorMessage = errorMessage.trim();

	if (errorMessage !== '') {

		// alert(errorMessage);
		return errorMessage;
	}
	else {

		return null;
	}
}

async function saveRecord() {

	let form = document.querySelector("form");

	if (form.checkValidity() === true) {

		let newRecord = await getRecord();

		// console.log("saveRecord");

		// http://138.68.140.83:8080/Prasad/saveItem.jsp?ItemId=I2342&Description=Vatika+Hair+Oil&UnitPrice=99.0&SupplierId=S1023&StockQty=500

		let insertUrl = `http://138.68.140.83:8080/Prasad/saveRecord.jsp?${gParameterNameOfTableName}=${gTableName}&`;

		for (let index = 0; index < newRecord.length; index++) {

			insertUrl += gFieldNames[index] + "=" + newRecord[index] + "&";
		}

		insertUrl = insertUrl.slice(0, -1);

		let response = await fetch(insertUrl);

		let result = await response.text()
		result = result.trim();

		if (result == 1 || result == 2) {

			await addRecordToTable(await getViewOfRecord(newRecord[0]));	
		}
		else if (result >= 1000) {

			let errorMessage = await getErrorMessage(result);

			if (errorMessage !== null) {

				showMessage(errorMessage);
			}
		}
		else {

			showMessage(result);
		}

		clearAllInputBoxes();
	}


}

async function getViewOfRecord(pRecordId) {

	let urlToSelectViewOfRecord = `http://138.68.140.83:8080/Prasad/getViewOfRecord.jsp?${gParameterNameOfTableName}=${gTableName}&${gFieldNames[0]}=${pRecordId}`;

	let response = await fetch(urlToSelectViewOfRecord);
	let viewOfRecord = await response.json();

	return viewOfRecord["record"];
}

async function addRecordToTable(pRecord) {

	if (document.getElementById("Save").textContent === "Update") {

		let tableRow = document.getElementById(pRecord[gFieldNames[0]]);

		tableRow.innerHTML = "";

		appendRecordToRow(pRecord, gHeaders, tableRow);
		showMessage(gFieldNames[0] + " '" + pRecord[gFieldNames[0]] + "' is updated successfully.");
	}
	else {

		let tableDiv = document.getElementById(gTableDivId);

		// console.log(tableDiv.innerHTML);

		let table = tableDiv.childNodes[0];

		let tableBody = table.childNodes[1];
		// console.log(tableBody.innerHTML);
		// console.log(allRows.innerHTML);

		tableBody.appendChild(getTableRow(pRecord, gHeaders, createTableRow()));
		showMessage(gFieldNames[0] + " '" + pRecord[gFieldNames[0]] + "' is inserted successfully.");
	}
}

function populateRecord(pButton) {

	let row = pButton.parentNode.parentNode;

	// let textBoxElements = document.querySelectorAll(".textBoxes");
	// let textBoxes = Array.from(textBoxElements);

	// let textBoxElements = document.getElementsByClassName("textBoxes");

	let textBoxes = getTextBoxes(gFieldNames);

	let textBoxIds = textBoxes.map(textBox => textBox.id);

	for (let index = 0; index < textBoxIds.length; index++) {

		document.getElementById(textBoxIds[index]).value = row.cells[index].textContent;
	}

	textBoxes[0].disabled = true;

	document.getElementById("Save").textContent = "Update";

	document.getElementById("textBoxes").scrollIntoView({behavior: "smooth", block: "start"});
}

function clearAllInputBoxes() {

	for (let fieldName of gFieldNames) {

		let inputBox = document.getElementById(fieldName);

		inputBox.value = "";

		if (inputBox.disabled == true) {

			inputBox.disabled = false;
		}
	}

	document.getElementById("Save").textContent = "Save";
}

async function loadAllRecords() {

	let selectUrl = `showRecords.jsp?${gParameterNameOfTableName}=${gTableName}`;

	let response = await fetch(selectUrl);
	gRecords = await response.json();

	// console.log(allRecords);

	// return allRecords;
}

function getHeaders(pRecords) {

	if (Object.keys(pRecords[0]).length > 0) {

		let keys = Object.keys(pRecords[0]);

		let rHeaders = [];

		for (let header of keys) {

			rHeaders.push(header);
		}

		// let rHeaders = gFieldNames.slice();

		// if (gFieldNames.length < keys.length) {

		// 	for (let key of keys) {

		// 		if (!gFieldNames.includes(key)) {

		// 			rHeaders.push(key);
		// 		}
		// 	}
		// }

		return rHeaders;
	}

}

async function showAllRecords(pRecords, pFieldNames) {

	// let pRecords = await loadAllRecords();
	let tableDiv = document.getElementById(gTableDivId);
	tableDiv.innerHTML = "";

	if (pRecords.length !== 0) {

		gHeaders = getHeaders(pRecords);
		
		// console.log(tableDiv.innerHTML);

		tableDiv.appendChild(createTable(pRecords, gHeaders));
	}
}

function createTable(pRecords, pHeaders) {

	rTable = document.createElement("table");

	rTable.border = "1";

	rTable.appendChild(createTableHeader(pHeaders));
	rTable.appendChild(createTableBody(pRecords, pHeaders));

	return rTable;
}

function createTableHeader(pHeaders) {

	rTHead = document.createElement("thead");

	for (let index = 0; index < pHeaders.length; index++) {

		rTHead.appendChild(createTableHeaderCell(pHeaders[index], sortTable, index));
	}

	return rTHead;
}

function createTableHeaderCell(pHeaderName, pOnclickFunction, pOnclickFunctionArgument) {

	let rTh = document.createElement("th");

	rTh.textContent = pHeaderName;
	rTh.id = pHeaderName;

	if (pOnclickFunction !== null) {

		if (gFieldNames.includes(pHeaderName) === true) {

			addOnclickFunction(rTh, pOnclickFunction, pOnclickFunctionArgument);
		}
	}

	return rTh
}

function createTableBody(pRecords, pHeaders) {

	let rTBody = document.createElement("tbody");

	for (let recordData of pRecords) {

		rTBody.appendChild(getTableRow(recordData, pHeaders));
	}

	return rTBody;
}

function createTableRow() {

	return document.createElement("tr");
}

function appendRecordToRow(pRecordData, pFieldNames, pTr) {


	for (let fieldName of pFieldNames) {

		pTr.appendChild(createTableCell(pRecordData[fieldName]));
	}

	// if (Object.entries(pRecordData).length > pFieldNames.length) {

	// 	for (let fieldName in pRecordData) {

	// 		if (!pFieldNames.includes(fieldName)) {

	// 			pTr.appendChild(createTableCell(pRecordData[fieldName]));
	// 		}
	// 	}
	// }
}

function getTableRow(pRecordData, pFieldNames) {

	// let rTr = document.createElement("tr");
	let rTr = createTableRow();

	appendRecordToRow(pRecordData, pFieldNames, rTr);

	// console.log(pRecordData);
	// console.log(pFieldNames);

	// rTr.setAttribute("id", pRecordData[pFieldNames[0]]);
	rTr.id = pRecordData[pFieldNames[0]];

	// for (let fieldName of pFieldNames) {

	// 	rTr.appendChild(createTableCell(pRecordData[fieldName]));
	// }

	// if (Object.entries(pRecordData).length > pFieldNames.length) {

	// 	for (let fieldName in pRecordData) {

	// 		if (!pFieldNames.includes(fieldName)) {

	// 			rTr.appendChild(createTableCell(pRecordData[fieldName]));
	// 		}
	// 	}
	// }

	return rTr;
}

function createTableCell(pValue) {

	let rTd = document.createElement("td");

	rTd.innerHTML = pValue;
	// rTd.id = pFieldName;
	// rTd.name = pFieldName;

	return rTd;
}

function createBreak() {

	return document.createElement("br");
}

function createForm() {

	let rForm = document.createElement("form");

	// rForm.action = "submit";

	return rForm;
}

function createInputBox(pNameOfInputBox, pInputType, pClassNameOfInputBox, pPlaceHolder) {

	rInputBox = document.createElement("input");

	rInputBox.name = pNameOfInputBox;
	rInputBox.id = pNameOfInputBox;
	rInputBox.type = pInputType;
	rInputBox.required = true;
	rInputBox.placeholder = pPlaceHolder;

	if (pClassNameOfInputBox !== null) {

		rInputBox.setAttribute("class", pClassNameOfInputBox);
	}

	return rInputBox;
}

function addOnclickFunction(pElement, pOnclickFunction, pOnclickFunctionArgument) {

	if (pOnclickFunctionArgument === null) {

		pElement.onclick = function() {

			pOnclickFunction();
		}
	}
	else {

		pElement.onclick = function() {

			pOnclickFunction(pOnclickFunctionArgument);
		}
	}


}

function createButton(pNameOfButton, pOnclickFunction, pOnclickFunctionArgument, pType) {

	rButton = document.createElement("button");

	rButton.name = pNameOfButton;
	rButton.id = pNameOfButton;
	rButton.textContent = pNameOfButton;

	if (pType !== null) {

		rButton.type = pType;
	}


	addOnclickFunction(rButton, pOnclickFunction, pOnclickFunctionArgument);
	// if (pOnclickFunctionArgument === null) {

	// 	rButton.onclick = function() {

	// 		pOnclickFunction();
	// 	}
	// }
	// else {

	// 	rButton.onclick = function() {

	// 		pOnclickFunction(pOnclickFunctionArgument);
	// 	}
	// }

	return rButton;
}

function createDiv(pClassNameOfDiv) {

	let rDiv = document.createElement("div");

	rDiv.name = pClassNameOfDiv;
	rDiv.id = pClassNameOfDiv;

	rDiv.class = pClassNameOfDiv;

	// rDiv.setAttribute("class", pClassNameOfDiv);

	return rDiv;
}

async function createConnection(pTableName) {

	let connectionUrl = `http://138.68.140.83:8080/Prasad/dbConnection.jsp`;

	await fetch(connectionUrl);
}

function createLabelToInputBox(pFor) {

	let rLabel = document.createElement("label");

	rLabel.setAttribute("for", pFor);
	rLabel.textContent = pFor + ": ";

	return rLabel;
}

function createTextBoxes(pFieldNames) {

	let rDiv = createDiv("textBoxes");
	let form = createForm();


	for (let fieldName of pFieldNames) {

		form.appendChild(createLabelToInputBox(fieldName));
		form.appendChild(createInputBox(fieldName, "text", "textBoxes", "Enter " + fieldName));
		form.appendChild(createBreak());
	}

	form.appendChild(createButton("Save", saveRecord, null, null));
	form.appendChild(createButton("Clear", clearAllInputBoxes, null, null));

	rDiv.appendChild(form);

	return rDiv;
}

async function addEventForSearch(pSearchBoxId) {

	let searchBox = document.getElementById(pSearchBoxId);

	searchBox.addEventListener('input', async function() {

		let searchTerm = searchBox.value.trim().toUpperCase();

		await searchRecord(searchTerm);
	});
}


var gFieldNames;
var gTableDivId = "table-container";
var gMessageDivId = "message-container";
var gHeaders;
var gSerchBoxId = "search";
var gRecords;
var gTableName = "Item";
var gParameterNameOfTableName = "tableName";

document.addEventListener("DOMContentLoaded", async function() {

	await createConnection();

	gFieldNames = await getFieldNames();

	document.body.appendChild(createInputBox(gSerchBoxId, "text", null, "Search"));
	document.body.appendChild(createTextBoxes(gFieldNames));
	const buttonContainer = createDiv("button-container");
	// buttonContainer.appendChild(createButton("Save", saveRecord, null));
	// buttonContainer.appendChild(createButton("Clear", clearAllInputBoxes, null, null));
	document.body.appendChild(buttonContainer);
	document.body.appendChild(createDiv(gMessageDivId));
	document.body.appendChild(createDiv(gTableDivId));
	await loadAllRecords();
	await showAllRecords(gRecords, gFieldNames);

	await addEventForSearch(gSerchBoxId);
});