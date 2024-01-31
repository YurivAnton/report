"use strict";


let addTechnikBnt = document.querySelector('#addTechnik');
let addSparePartsBnt = document.querySelector('#addSpareParts');
let technik = document.querySelector('#technik');
let sparePart = document.querySelector('#spareParts')
let counterTech = 0;
let counterSparePart = 0;

let currentDate = new Date();

function createInput(attrs){
    let input = document.createElement('input');
    let nameOfAttrs = ['id', 'class', 'name', 'type', 'placeholder'];
    
    for(let i=0; i<attrs.length; i++){
        input.setAttribute(nameOfAttrs[i], attrs[i]);
    }
    // technik.append(input);
    input.style.marginRight = '5px';
    return input;
}

function createOfficeInfo(data){
    let inpupOfficeAddress = createInput(['officeAddress', 'report', 'officeAddress', 'text', '']);
    inpupOfficeAddress.setAttribute('value', data[0].office_address);
    addOfficeInfo.append(inpupOfficeAddress);

    let inpupOfficeCity = createInput(['officeCity', 'report', 'officeCity', 'text', '']);
    inpupOfficeCity.setAttribute('value', data[0].office_city);
    addOfficeInfo.append(inpupOfficeCity);
}

function addZero(num) {
	if (num >= 0 && num <= 9) {
		return '0' + num;
	} else {
		return num;
	}
}

function timeAdjustment(hours, minutes, start){
    if(!start){
        if(Math.ceil(minutes / 15) * 15 == 60){
            hours += 1;
            minutes = 0;
        } else {
            minutes = Math.ceil(minutes / 15) * 15;
        }
    } else {
        minutes = Math.floor(minutes / 15) * 15;
    }
    return addZero(hours) + ':' + addZero(minutes);
}

addTechnikBnt.addEventListener('click', function addTechnik(event){
    counterTech = counterTech + 1;
    event.preventDefault();

    let firstParag = document.querySelector('#paragTech');
    let parag = document.createElement('p');
    let start = document.getElementById('startTime');
    let finish = document.getElementById('finishTime');


    let technicianName = createInput(['technicianName' + counterTech, 'report', 'technicianName[]', 'text', 'Meno TECHNIKA']);
    parag.append(technicianName);

    let startTime = createInput(['startTime' + counterTech, 'report', 'startTime[]', 'time', '']);
    // startTime.value = timeAdjustment(Number(currentDate.getHours()), currentDate.getMinutes(), true);
    startTime.value = start.value;
    parag.append(startTime);

    let finishTime = createInput(['finishTime' + counterTech, 'report', 'finishTime[]', 'time', '']);
    // finishTime.value = timeAdjustment(Number(currentDate.getHours()), currentDate.getMinutes(), false);
    finishTime.value = finish.value;
    parag.append(finishTime);
    
    firstParag.append(parag);
    if (counterTech == 5){
        addTechnikBnt.setAttribute('disabled', '');
        
    }
})

addSparePartsBnt.addEventListener('click', function addSpareParts(event){
    counterSparePart = counterSparePart + 1;
    event.preventDefault();

    let parag = document.createElement('p');

    let nameSparePart = createInput(['spare' + counterSparePart, 'report', 'nameSparePart[]', 'text', 'Nazov dielu'])
    parag.append(nameSparePart);

    let quantitySparePart = createInput(['quantitySpare' + counterSparePart, 'report', 'quantitySparePart[]', 'number', 'Množstvo']);
    parag.append(quantitySparePart);

    let noteSparePart = createInput(['noteSpare' + counterSparePart, 'report', 'noteSparePart[]', 'text', 'Pozanámka']);
    parag.append(noteSparePart);

    sparePart.append(parag);

    if (counterSparePart == 4){
        addSparePartsBnt.setAttribute('disabled', '');
    }
})


let selectCustomer = document.querySelector('#customerName');
let selectOffice = document.querySelector('#officeName');
let addOfficeInfo = document.querySelector('#addOfficeInfo');
let addCustomerInfo = document.querySelector('#addCustomerInfo');

selectCustomer.addEventListener('change', function(){
    selectOffice.innerHTML = '';
    
    addOfficeInfo.innerHTML = '';
    
    addCustomerInfo.innerHTML = '';
    let customerName = this.value;

    let promise = fetch('report.php?customer='+customerName);
	
	promise.then(
		response => {
            return response.json();
		}
	).then(
        data => {
            let inpupCustomerAddress = createInput(['customerAddress', 'report', 'customerAddress', 'text', '']);
            inpupCustomerAddress.setAttribute('value', data[0].customers_address);
            addCustomerInfo.append(inpupCustomerAddress);

            let inpupCustomerCity = createInput(['customerCity', 'report', 'customerCity', 'text', '']);
            inpupCustomerCity.setAttribute('value', data[0].customers_city);
            addCustomerInfo.append(inpupCustomerCity);

            let inputContractual = createInput(['contractual', 'report', 'contractual', 'hidden', '']);
            inputContractual.setAttribute('value', data[0].contractual);
            addCustomerInfo.append(inputContractual);

            for(let i=0; i<data.length; i++){
                let option = document.createElement('option');
                option.innerHTML = data[i].office_name;
                selectOffice.append(option);
            }

            createOfficeInfo(data);
		}
	);
})

selectOffice.addEventListener('change', function(){
    addOfficeInfo.innerHTML = '';
    let promise = fetch('report.php?office='+this.value);

    promise.then(
		response => {
            return response.json();
		}
	).then(
        data => {
            createOfficeInfo(data);
            // console.log(data[0]);
		}
	);
}) 


let date = document.querySelector('#date');

date.value = addZero(currentDate.getFullYear()) + '-' + addZero(currentDate.getMonth() + 1) + '-' + addZero(currentDate.getDate());

let finishTime = document.querySelector('#finishTime');
finishTime.value = timeAdjustment(currentDate.getHours(), currentDate.getMinutes(), false);
finishTime.addEventListener('change', function(event){
    let time = finishTime.value.split(':');
    finishTime.value = timeAdjustment(Number(time[0]), time[1], false);
})

let startTime = document.querySelector('#startTime');
startTime.addEventListener('change', function(event){
    let time = startTime.value.split(':');
    startTime.value = timeAdjustment(Number(time[0]), time[1], true);
})

let mainTech = document.createElement('select');


const canvas = document.getElementById("canvas");
const context = canvas.getContext("2d");
 
const w = canvas.width;
const h=canvas.height;
 
const mouse = { x:0, y:0};      // координаты мыши
let draw = false;
              
// нажатие мыши
canvas.addEventListener("mousedown", function(e){
      
    mouse.x = e.pageX - this.offsetLeft;
    mouse.y = e.pageY - this.offsetTop;
    draw = true;
    context.beginPath();
    context.moveTo(mouse.x, mouse.y);
});
// перемещение мыши
canvas.addEventListener("mousemove", function(e){
      
    if(draw==true){
      
        mouse.x = e.pageX - this.offsetLeft;
        mouse.y = e.pageY - this.offsetTop;
        context.lineTo(mouse.x, mouse.y);
        context.stroke();
    }
});
 
// отпускаем мышь
canvas.addEventListener("mouseup", function(e){
      
    mouse.x = e.pageX - this.offsetLeft;
    mouse.y = e.pageY - this.offsetTop;
    context.lineTo(mouse.x, mouse.y);
    context.stroke();
    context.closePath();
    draw = false;
});

let show = document.querySelector('#show');

show.addEventListener('click', function (event) {
    event.preventDefault();
    
    let searchParams = new URLSearchParams();
    searchParams.set('signTech', canvas.toDataURL("image/png"));
    let promise = fetch('report.php', {
		method: 'POST',
		body: searchParams,
	});

    let f = document.querySelector('#form');
    f.action = 'testFpdf.php';
    f.submit();
})