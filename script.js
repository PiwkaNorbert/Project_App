var elements =[];
var page = 0;

window.onload = function() {
    reloadData();
};

function incrementPage() {
    var e = document.getElementById("row-count");
    var amountToPaginate = e.options[e.selectedIndex].text;
    var total = elements.length -1 ;

    var amountOfPages = Math.round(total / amountToPaginate);

    if(page < amountOfPages){
        page ++;
        display();
    }
}

function decreasePage() {
    if(page != 0){
        page--;
        display();
    }
}

function reloadData(){
    var storageItems = localStorage.getItem("elements");
    if(storageItems != null){
        elements = JSON.parse(storageItems);
    }
    display();
}

function writeObjectToElements(element){
    elements.push(element);
    localStorage.setItem("elements", JSON.stringify(elements));
    reloadData();
}

function injectElementsToStorage(){
    localStorage.setItem("elements", JSON.stringify(elements));
    reloadData();
}

function addElement(event) {
    event.preventDefault();
    let form = new FormData(document.getElementById('addForm'));

    let data = {};
    for (let pair of form.entries()) {
        data[pair[0]] = pair[1];
    }

    data.id = Math.round(Math.random()*10000);
    data.done = false;
    writeObjectToElements(data);
    
    document.getElementById('addNameInput').value = '';

}

function display() {
    var e = document.getElementById("row-count");
    var amountToPaginate = e.options[e.selectedIndex].value;
    var total = elements.length;

    var start = page * amountToPaginate;
    var end = parseInt(start) + parseInt(amountToPaginate);
    document.getElementById('text-amount-pagination').innerHTML = start +' - '+ end + ' of ' + total;
    var amountOfPages = Math.round(total / amountToPaginate);

    var toDraw = getPaginatedItems(amountToPaginate,page);

    var tableBody = document.getElementById("tableBody");
    if(elements === null){
        return;
    }

    let htmlToInsert = "";
    toDraw.forEach( element => {
        htmlToInsert += '<tr>';
        htmlToInsert += '<td onclick="deleteElementFromElements('+element.id+')" style="cursor:pointer;">'+element.name+'</td>';
        htmlToInsert += '<td onclick="deleteElementFromElements('+element.id+')" style="cursor:pointer;">'+element.prio+'</td>';
        if(element.done){
            htmlToInsert += '<td><div class="container"><input class="myCheckbox" type="checkbox" checked onchange="uncheckDone('+element.id+')"/></div></td>';
        }else{
            htmlToInsert += '<td><div class="container"><input class="myCheckbox" type="checkbox" onchange="checkDone('+element.id+')"></div></td>';
        }
        htmlToInsert += '<td onclick="deleteElementFromElements('+element.id+')" style="cursor:pointer;" ><img class="removeBtn" style="width:20px;height:20px;" src="times-circle-solid.svg" alt="delete '+element.id+'"/></td>';
        htmlToInsert += '</tr>';
    });
    tableBody.innerHTML = htmlToInsert;
}

function getPaginatedItems(pagesize,page){
    var toSkip = pagesize * page;

    var counter = 1;
    var newElements = [];
    elements.forEach((element,index) => {
        if(counter > toSkip){
            if(newElements.length == pagesize){
                return newElements;
            }else{
                newElements.push(element);
            }
        }
        counter++;
    })

    return newElements;
}

function changePageSize(){
    display();
}

function uncheckDone(id){
    elements.forEach( element => {
        if(element.id == id){
            element.done = false;
            injectElementsToStorage();
        }
    });
}

function checkDone(id){
    elements.forEach( element => {
        if(element.id == id){
            element.done = true;
            injectElementsToStorage();
        }
    });
}

function deleteElementFromElements(id){
    elements.forEach( (element,index) => {
        if(element.id == id){
            elements.splice(index,1);
            injectElementsToStorage();
        }
    });
}

function sortColumn(field){
    var elem = document.getElementById('sort-m-'+field);
    if(elem.textContent == 'U'){
        elements.sort(dynamicSort('-' + field));
        elem.textContent = 'D';
    }else{
        elements.sort(dynamicSort(field));
        elem.textContent = 'U';
    }
    cleanupSortingValues(field);
    display();
}

function cleanupSortingValues(field){
    if(field == 'name'){
        document.getElementById('sort-m-prio').textContent = '';
        document.getElementById('sort-m-done').textContent = '';
    }

    if(field == 'prio'){
        document.getElementById('sort-m-name').textContent = '';
        document.getElementById('sort-m-done').textContent = '';
    }

    if(field == 'done'){
        document.getElementById('sort-m-name').textContent = '';
        document.getElementById('sort-m-prio').textContent = '';
    }
}

function dynamicSort(property) {
    var sortOrder = 1;
    if(property[0] === "-") {
        sortOrder = -1;
        property = property.substr(1);
    }
    return function (a,b) {
        var result = (a[property] < b[property]) ? -1 : (a[property] > b[property]) ? 1 : 0;
        return result * sortOrder;
    }
}
