let date = new Date().toDateString();
let todayDate = document.createElement("h4");
todayDate.textContent = date;
let json;
let data;
let cellNumber = 1;
let jsonData = [];
let tableBody = document.getElementById("tableBody")


let currentDate = () => {

    document.getElementById("hora_fecha").appendChild(todayDate);  
}


let addRow = (tableId, cellValues) =>{
    let table = document.getElementById(tableId);
    let newRow = table.insertRow(-1);
    for(let i = 0; i < cellValues.length; i++){
        let newcell = newRow.insertCell(i);
        let text = document.createTextNode(cellValues[i]);
        newcell.appendChild(text);
    }
}

let deleteRow = () =>{
    tableBody.parentNode.removeChild(tableBody);
}

let getJsonData = () => {
    return fetch('https://mayor28zellevalidator.azurewebsites.net/getdata')
        .then((result) => {
            data = result.json()
            return data;
        })
        .then((data) => {
            console.log(data)
            return jsonData = data;
        })
        .then(() => {
            writeData();
        })
        .catch(e => console.log(e));
}

function validateExistingData(){
    const table = document.getElementById('tableBody');
    const firstCells = [];

    const rows = table.getElementsByTagName('tr');

    for (let i = 0; i < rows.length; i++) {
        const firstCell = rows[i].getElementsByTagName('td')[0];
        const cellContent = firstCell.textContent;
        firstCells.push(cellContent);
        }

    return firstCells;
}

function writeData(){
    for(item of jsonData){
        let cellValues = [];
        if (validateExistingData().includes(item.id)) continue;
        cellValues.push(item.id,item.sender,"$"+item.ammount,item.date,item.receiver);
        addRow("tableBody",cellValues);
    }jsonData=[];   
}


