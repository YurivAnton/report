"use strict";


let addTechnikBnt = document.querySelector('#addTechnik');
let addSparePartsBnt = document.querySelector('#addSpareParts');
let technik = document.querySelector('#technik');
let sparePart = document.querySelector('#spareParts')
let dateTransport = document.querySelector('#dateTransport');
// let workDays = document.getElementById('workDays');
let counterDate = 0;
let counterTech = 0;
let counterSparePart = 0;

let currentDate = new Date();

function createInput(attrs){
    let input = document.createElement('input');
    let nameOfAttrs = ['id', 'class', 'name', 'type', 'placeholder'];
    
    for(let i=0; i<attrs.length; i++){
        input.setAttribute(nameOfAttrs[i], attrs[i]);
    }
    input.style.marginRight = '5px';
    return input;
}

function createListOfCustomers(){
    let promise = fetch('report.php?allCustomers=all');
	
	promise.then(
		response => {
            return response.json();
		}
	).then(
        data => {
            for(let item of data){
                let option = document.createElement('option');
                option.innerHTML = item.customer_name;
                selectCustomer.appendChild(option);
                // console.log(item.customerName);
            }
            // console.log(data);
        }
    );
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

function createWorkDayOption(){
    let dates = document.querySelectorAll('#dateTransport .date');
    /* let oldWorkDays = document.querySelector('#workDays');
    if(oldWorkDays){
        oldWorkDays.remove();
    } */
    let workDays = document.createElement('select');
    workDays.id = 'workDays';
    workDays.classList.add('workDays');
    workDays.name = 'workDays[]';

    let uniqueDates = [];
    for(let date of dates){
        if(uniqueDates.indexOf(date.value) < 0){
            uniqueDates.push(date.value);
        }
    }

    for(let uniqueDate of uniqueDates){
        let option = document.createElement('option');
        option.innerHTML = uniqueDate;
        workDays.append(option);
    }

    let parags = document.querySelectorAll('#technik p');
    for(let p of parags){
        let clone = workDays.cloneNode(true);
        for(let item of p.children){
            if(item.id == 'workDays'){
                item.remove();
            }
        }
        if(p.lastChild.id == 'workDays'){
            p.lastChild.remove();
        }
        
        if(p.lastChild.id == 'del'){
            p.insertBefore(clone, p.lastChild);
        } else {
            p.append(clone); 
        }
    }
}

function changeStartTime(isStart){
    let time = this.value.split(':');
    this.value = timeAdjustment(Number(time[0]), time[1], isStart);
}

function changeFinishTime(){
    let time = this.value.split(':');
    this.value = timeAdjustment(Number(time[0]), time[1], false);
}

createListOfCustomers();

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
            // console.log(response.json());
            return response.json();
		}
	).then(
        data => {
            // console.log(data['dataCustomer'].customer_address);
            if(data['dataCustomer'].customer_address){
                let inpupCustomerAddress = createInput(['customerAddress', 'report', 'customerAddress', 'text', '']);
                inpupCustomerAddress.setAttribute('value', data['dataCustomer']['customer_address']);
                addCustomerInfo.append(inpupCustomerAddress);

                let inpupCustomerCity = createInput(['customerCity', 'report', 'customerCity', 'text', '']);
                inpupCustomerCity.setAttribute('value', data['dataCustomer']['customer_city']);
                addCustomerInfo.append(inpupCustomerCity);

                let inputContractual = createInput(['contractual', 'report', 'contractual', 'hidden', '']);
                inputContractual.setAttribute('value', data['dataCustomer']['contractual']);
                addCustomerInfo.append(inputContractual);
            }
                   
            if(data['dataOffice'][0].office_name){
                for(let i=0; i<data['dataOffice'].length; i++){
                    let option = document.createElement('option');
                    option.innerHTML = data['dataOffice'][i].office_name;
                    selectOffice.append(option);
                }
                createOfficeInfo(data['dataOffice']);
            }
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
		}
	);
}) 

let date = document.querySelector('#date');

date.value = addZero(currentDate.getFullYear()) + '-' + addZero(currentDate.getMonth() + 1) + '-' + addZero(currentDate.getDate());
date.addEventListener('blur', function(event){
    createWorkDayOption();
})

let finishTime = document.querySelector('#finishTime');
finishTime.value = timeAdjustment(currentDate.getHours(), currentDate.getMinutes(), false);
finishTime.addEventListener('change', changeFinishTime);

let startTime = document.querySelector('#startTime');
startTime.addEventListener('change', changeStartTime);

let addWorkDayBtn = document.querySelector('#addWorkDay');
addWorkDayBtn.addEventListener('click', function(event){
    counterDate = counterDate + 1;
    event.preventDefault();

    let parag = document.createElement('p');

    let date = createInput(['date' + counterDate, 'date', 'date[]', 'date', '']);
    parag.append(date);

    let transportKm = createInput(['transportKm' + counterDate, '',  'transportKm[]', 'number', '']);
    transportKm.value = 10;
    parag.append(transportKm);

    let transportTime = createInput(['transportTime' + counterDate, '', 'transportTime[]', 'number', '']);
    transportTime.value = 0.5;
    parag.append(transportTime);

    let delButton = document.createElement('button');
    delButton.id = 'del';
    delButton.innerHTML = 'delete';
    parag.append(delButton);
    delButton.addEventListener('click', function(event){
        event.preventDefault();
        this.parentElement.remove();
        createWorkDayOption();
    })

    dateTransport.insertBefore(parag, addWorkDayBtn);

    date.addEventListener('blur', function(event){        
        createWorkDayOption();
    })

})

createWorkDayOption();

addTechnikBnt.addEventListener('click', function addTechnik(event){
    counterTech = counterTech + 1;
    event.preventDefault();

    let parag = document.createElement('p');
    let start = document.getElementById('startTime');
    let finish = document.getElementById('finishTime');
    

    let technicianName = createInput(['technicianName' + counterTech, 'tech', 'technicianName[]', 'text', 'Meno TECHNIKA']);
    parag.append(technicianName);

    let startTime = createInput(['startTime' + counterTech, 'time', 'startTime[]', 'time', '']);
    startTime.addEventListener('change', changeStartTime);
    startTime.value = start.value;
    parag.append(startTime);

    let finishTime = createInput(['finishTime' + counterTech, 'time', 'finishTime[]', 'time', '']);
    finishTime.addEventListener('change', changeFinishTime);
    finishTime.value = finish.value;
    parag.append(finishTime);

    let delButton = document.createElement('button');
    delButton.id = 'del';
    delButton.innerHTML = 'delete';
    parag.append(delButton);
    delButton.addEventListener('click', function(event){
        event.preventDefault();
        this.parentElement.remove();
        for(let option of mainTech){
            // видаляю зі списку хто підписується
            if(option.value == this.parentElement.firstChild.value){
                option.remove();
            }
        }
        
    })
    
    technik.insertBefore(parag, addTechnikBnt);

    technicianName.addEventListener('blur', function(){
        // видаляємо всіх зі списку на підпис
        while(mainTech.firstChild){
            mainTech.removeChild(mainTech.firstChild);
        }
        // отримуємо всіх техніків
        let allTechNames = document.querySelectorAll('#technik .tech');

        let uniqueNames = [];
        for(let techName of allTechNames){
            if(uniqueNames.indexOf(techName.value) < 0){
                uniqueNames.push(techName.value);
            }
        }

        for(let elem of uniqueNames){
            let option = document.createElement('option');
            option.innerHTML = elem;
            mainTech.append(option);
        }
    });

    createWorkDayOption();
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

    let delButton = document.createElement('button');
    delButton.innerHTML = 'delete';
    parag.append(delButton);
    delButton.addEventListener('click', function(event){
        event.preventDefault();
        this.parentElement.remove();
    })

    sparePart.insertBefore(parag, addSparePartsBnt);
})

let mainTech = document.querySelector('#mainTech');
let firstTechName = document.querySelector('#technicianName');

firstTechName.addEventListener('blur', function func(){
    let option = document.createElement('option');
    option.innerHTML = firstTechName.value;
    mainTech.append(option);
})

let createCanvasTech = document.getElementById('createCanvasTech')
createCanvasTech.addEventListener('click', function(event){
    event.preventDefault();
    canvasTech.style.display = '';
    clearCanvasTech.style.display = '';
    saveCanvasTech.style.display = '';
})
let saveCanvasTech = document.getElementById('saveCanvasTech');
saveCanvasTech.addEventListener('click', function(event){
    event.preventDefault();
    let searchParams = new URLSearchParams();
    searchParams.set('signTech', canvasTech.toDataURL("image/png"));

    fetch('report.php', {
		method: 'POST',
		body: searchParams,
	});
})

let createCanvasCust = document.getElementById('createCanvasCust');
createCanvasCust.addEventListener('click', function(event){
    event.preventDefault();
    canvasCustomer.style.display = '';
    clearCanvasCustomer.style.display = '';
    saveCanvasCustomer.style.display = '';
})

let saveCanvasCustomer = document.getElementById('saveCanvasCustomer');
saveCanvasCustomer.addEventListener('click', function(event){
    event.preventDefault();
    let searchParams = new URLSearchParams();
    searchParams.set('signCustomer', canvasCustomer.toDataURL("image/png"));

    fetch('report.php', {
		method: 'POST',
		body: searchParams,
	});
})

let canvasTech = document.getElementById("canvasTech");
let contextTech = canvasTech.getContext("2d");

let clearCanvasTech = document.getElementById('clearCanvasTech');
clearCanvasTech.addEventListener('click', function(event){
    event.preventDefault();

    contextTech.clearRect(0, 0, canvasTech.width, canvasTech.height);
}) 
 
const wTech = canvasTech.width;
const hTech = canvasTech.height;
 
const mouseTech = { x:0, y:0};      // координаты мыши
let drawTech = false;
              
// нажатие мыши
canvasTech.addEventListener("mousedown", function(e){
      
    mouseTech.x = e.pageX - this.offsetLeft;
    mouseTech.y = e.pageY - this.offsetTop;
    drawTech = true;
    contextTech.beginPath();
    contextTech.moveTo(mouseTech.x, mouseTech.y);
});
// перемещение мыши
canvasTech.addEventListener("mousemove", function(e){
      
    if(drawTech == true){
      
        mouseTech.x = e.pageX - this.offsetLeft;
        mouseTech.y = e.pageY - this.offsetTop;
        contextTech.lineTo(mouseTech.x, mouseTech.y);
        contextTech.stroke();
    }
});
 
// отпускаем мышь
canvasTech.addEventListener("mouseup", function(e){
      
    mouseTech.x = e.pageX - this.offsetLeft;
    mouseTech.y = e.pageY - this.offsetTop;
    contextTech.lineTo(mouseTech.x, mouseTech.y);
    contextTech.stroke();
    contextTech.closePath();
    drawTech = false;
});

let canvasCustomer = document.getElementById("canvasCustomer");
let contextCustomer = canvasCustomer.getContext("2d");
 
let clearCanvasCustomer = document.getElementById('clearCanvasCustomer');
clearCanvasCustomer.addEventListener('click', function(event){
    event.preventDefault();

    contextCustomer.clearRect(0, 0, canvasCustomer.width, canvasCustomer.height);
})

const w = canvasCustomer.width;
const h = canvasCustomer.height;
 
const mouse = { x:0, y:0};      // координаты мыши
let draw = false;
              
// нажатие мыши
canvasCustomer.addEventListener("mousedown", function(e){
      
    mouse.x = e.pageX - this.offsetLeft;
    mouse.y = e.pageY - this.offsetTop;
    draw = true;
    contextCustomer.beginPath();
    contextCustomer.moveTo(mouse.x, mouse.y);
});
// перемещение мыши
canvasCustomer.addEventListener("mousemove", function(e){
      
    if(draw==true){
      
        mouse.x = e.pageX - this.offsetLeft;
        mouse.y = e.pageY - this.offsetTop;
        contextCustomer.lineTo(mouse.x, mouse.y);
        contextCustomer.stroke();
    }
});
 
// отпускаем мышь
canvasCustomer.addEventListener("mouseup", function(e){
      
    mouse.x = e.pageX - this.offsetLeft;
    mouse.y = e.pageY - this.offsetTop;
    contextCustomer.lineTo(mouse.x, mouse.y);
    contextCustomer.stroke();
    contextCustomer.closePath();
    draw = false;
});

let form = document.querySelector('#form');
// console.log(form);
let show = document.querySelector('#show');

show.addEventListener('click', function (event) {
    event.preventDefault();
    
    /* let searchParams = new URLSearchParams();
    searchParams.set('signTech', canvasTech.toDataURL("image/png"));
    searchParams.set('signCustomer', canvasCustomer.toDataURL("image/png"));

    let promise = fetch('report.php', {
		method: 'POST',
		body: searchParams,
	});

     */
    form.action = 'testFpdf.php';
    form.submit();
})

let saveSent = document.getElementById('saveSent');
saveSent.addEventListener('click', function(event){
    event.preventDefault();

    saveReport();

    form.action = 'testFpdf.php';
    form.submit();

    fetch('sendMail.php', {
        method: 'POST',
    })
})

let save = document.getElementById('save');

function saveReport(){
    let formData = new FormData(form);
	formData.set('save', 'save');
    formData.set('signTech', canvasTech.toDataURL("image/png"));
    formData.set('signCustomer', canvasCustomer.toDataURL("image/png"));

    fetch('report.php', {
		method: 'POST',
		body: formData,
	});
};

save.addEventListener('click', function(event){
    event.preventDefault();

	

    saveReport();
    /* let promise = fetch('report.php', {
		method: 'POST',
		body: formData,
	}); */
})