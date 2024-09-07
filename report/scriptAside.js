"use strict";

let aside = document.getElementById('aside');
let listOfReports = document.getElementById('reports');
let customerInfo = document.getElementById('customerInfo');
let officeInfo = document.getElementById('officeInfo');

let reportTechSign = document.getElementById('reportTechSign');
let reportTech = document.getElementById('reportTech');

let reportCustomerSign = document.getElementById('reportCustomerSign');
let reportCustomer = document.getElementById('reportCustomer');

// let filds = document.querySelectorAll('fieldset p');
// console.log(filds);


let promiseRep = fetch('report.php?getAllReports=getAll');

promiseRep.then(
    response => {
        return response.json();
    }
).then(
    data => {
        for(let elem of data){
            let p = document.createElement('p');
            p.addEventListener('click', function(){
                let prgs = document.querySelectorAll('#aside p');
                
                for(let p of prgs){
                    // console.log(p.lastChild.innerHTML);
                    if(p.lastChild.innerHTML){
                        p.lastChild.remove();
                    }
                }
                let showBnt = document.createElement('button');
                showBnt.innerHTML = 'show';
                showBnt.name = elem.id;
    
                showBnt.addEventListener('click', function(){
                    customerInfo.innerHTML = '';
                    officeInfo.innerHTML = '';
                    dateTransport.innerHTML = '';

                    let promise = fetch('report.php?show='+elem.id, {
                        method: 'POST',
                    });
                    promise.then(
                        response => {
                            return response.json();
                        }
                    ).then(
                        data => {
                            


                            let datesParag = document.createElement('p');
                            let workersParag = document.createElement('p');
                            let customerName = createInput(['customerName', 'report', 'customerName', 'text', '']);
                            customerName.value = data[0][0].customer_name;
                            customerInfo.append(customerName);

                            let customerAddress = createInput(['customerAddress', 'report', 'customerAddress', 'text', '']);
                            customerAddress.setAttribute('value', data[0][0].customer_address);
                            customerInfo.append(customerAddress);

                            let customerCity = createInput(['customerCity', 'report', 'customerCity', 'text', '']);
                            customerCity.setAttribute('value', data[0][0].customer_city);
                            customerInfo.append(customerCity);

                            let contractual = createInput(['contractual', 'report', 'contractual', 'hidden', '']);
                            contractual.setAttribute('value', data[0][0].contractual);
                            customerInfo.append(contractual);

                            let officeName = createInput(['officeName', 'report', 'officeName', 'text', '']);
                            officeName.value = data[1][0].office_name;
                            officeInfo.append(officeName);

                            let officeAddress = createInput(['officeAddress', 'report', 'officeAddress', 'text', '']);
                            officeAddress.setAttribute('value', data[1][0].office_address);
                            officeInfo.append(officeAddress);

                            let officeCity = createInput(['officeCity', 'report', 'officeCity', 'text', '']);
                            officeCity.setAttribute('value', data[1][0].office_city);
                            officeInfo.append(officeCity);

                            for(let date of data[2]){
                                let day = createInput(['date', 'date', 'date[]', 'date', '']);
                                day.value = date.dateRep;
                                datesParag.append(day);
                                let transKm = createInput(['transportKm', '',  'transportKm[]', 'number', '']);
                                transKm.value = date.transportKm;
                                datesParag.append(transKm);
                                let transTime = createInput(['transportTime', '', 'transportTime[]', 'number', '']);
                                transTime.value = date.transportTime;
                                datesParag.append(transTime);
                            }
                            dateTransport.append(datesParag);

                            let fpYes = document.getElementById('fpYes');
                            let fpNo = document.getElementById('fpNo');
                            let quantityCircuits = document.getElementById('quantityCircuits');
                            let fpYesBig = document.getElementById('fpYesBig');
                            let fpNoBig = document.getElementById('fpNoBig');
                            let quantityCircuitsBig = document.getElementById('quantityCircuitsBig');
                            let leaklogYes = document.getElementById('LeaklogYes');
                            let leaklogNo = document.getElementById('LeaklogNo');
                            if(data[3][0].fp == 1){ 
                                fpYes.checked = true;
                                quantityCircuits.value = data[3][0].quantityCircuits;
                            } else {
                                fpNo.checked = true;
                                quantityCircuits.value = '';
                            }
                            if(data[3][0].fpBig == 1){
                                fpYesBig.checked = true;
                                quantityCircuitsBig.value = data[3][0].quantityCircuitsBig;
                            } else {
                                fpNoBig.checked = true;
                                quantityCircuitsBig.value = '';
                            }
                            if(data[3][0].leaklog == 1){
                                leaklogYes.checked = true;
                            } else {
                                leaklogNo.checked = true;
                            }
                            
                            technik.innerHTML = '';
                            for(let worker of data[4]){
                                let workerName = createInput(['technicianName', 'tech', 'technicianName[]', 'text', '']);
                                workerName.setAttribute('value', worker.technicianName);
                                workersParag.append(workerName);

                                let startTime = createInput(['startTime', 'time', 'startTime[]', 'time', '']);
                                startTime.value = worker.startTime;
                                workersParag.append(startTime);

                                let finishTime = createInput(['finishTime', 'time', 'finishTime[]', 'time', '']);
                                finishTime.value = worker.finishTime;
                                workersParag.append(finishTime);

                                let date = createInput(['workDays', 'workDays', 'workDays[]', 'date', '']);
                                date.value = worker.workDays;
                                workersParag.append(date);
                            }
                            technik.append(workersParag);

                            let description = document.getElementById('description');
                            description.innerHTML = '';
                            let descText = document.createElement('textarea');
                            descText.name = 'description';
                            descText.value = data[3][0].description;
                            description.append(descText);

                            let descRes = document.getElementById('descRes');
                            descRes.innerHTML = '';
                            let descResText = document.createElement('textarea');
                            descResText.name = 'descriptionResult';
                            descResText.value = data[3][0].descriptionResult;
                            descRes.append(descResText);

                            let device = document.getElementById('device');
                            device.innerHTML = '';
                            let typDevice = createInput(['', '', 'typDevice', 'text', '']);
                            typDevice.value = data[3][0].typDevice;
                            device.append(typDevice);

                            let snDevice = createInput(['', '', 'snDevice', 'text', '']);
                            snDevice.value = data[3][0].snDevice;
                            device.append(snDevice);

                            let cool = document.getElementById('cool');
                            cool.innerHTML = '';
                            let coolant = createInput(['coolant', '', 'coolant', 'text', '']);
                            coolant.value = data[3][0].coolant;
                            cool.append(coolant);
                            let newCoolant = createInput(['newCoolant', '', 'newCoolant', 'text', '']);
                            newCoolant.value = data[3][0].newCoolant;
                            cool.append(newCoolant);
                            let oldCoolant = createInput(['oldCoolant', '', 'oldCoolant', 'text', '']);
                            oldCoolant.value = data[3][0].oldCoolant;
                            cool.append(oldCoolant);

                            let oilParag = document.getElementById('oilParag');
                            oilParag.innerHTML = '';
                            let oil = createInput(['oil', '', 'oil', 'text', '']);
                            oil.value = data[3][0].oil;
                            oilParag.append(oil);
                            let newOil = createInput(['newOil', '', 'newOil', 'text', '']);
                            newOil.value = data[3][0].newOil;
                            oilParag.append(newOil);
                            let oldOil = createInput(['oldOil', '', 'oldOil', 'text', '']);
                            oldOil.value = data[3][0].oldOil;
                            oilParag.append(oldOil);

                            let spareParts = document.getElementById('spareParts');
                            spareParts.innerHTML = '';
                            let sparePartsParag = document.createElement('p');
                            for(let part of data[5]){
                                let partName = createInput(['spare', '', 'nameSparePart[]', 'text', '']);
                                partName.value = part.nameSparePart;
                                sparePartsParag.append(partName);
                                let partQuantity = createInput(['quantitySpare', '', 'quantitySparePart[]', 'number', '']);
                                partQuantity.value = part.quantitySparePart;
                                sparePartsParag.append(partQuantity);
                                let partNote = createInput(['noteSpare', '', 'noteSparePart[]', 'text', '']);
                                partNote.value = part.noteSparePart;
                                sparePartsParag.append(partNote);
                            }
                            spareParts.append(sparePartsParag);

                            
                            reportTech.innerHTML = '';
                            let mainTechName = createInput(['mainTech', '', 'mainTech', 'text', '']);
                            mainTechName.value = data[3][0].mainTech;
                            reportTech.append(mainTechName);

                            // let reportCustomer = document.getElementById('reportCustomer');
                            reportCustomer.innerHTML = '';
                            let customerNameSign = createInput(['customerSign', '', 'nameCustomerSign', 'text', '']);
                            customerNameSign.value = data[3][0].nameCustomerSign;
                            reportCustomer.append(customerNameSign);
                            
                            reportTechSign.innerHTML = '';
                            let techSign = document.createElement('img');
                            let urlTech = data[3][0].signTech;

                            reportCustomerSign.innerHTML = '';
                            let customerSign = document.createElement('img');
                            let urlCustomer = data[3][0].signCustomer;
                            
                            techSign.src = urlTech;
                            techSign.height = 250;
                            techSign.width = 400;

                            customerSign.src = urlCustomer;
                            customerSign.height = 250;
                            customerSign.width = 400;

                            let searchParams = new URLSearchParams();
                            searchParams.set('signTech', data[3][0].signTech);
                            searchParams.set('signCustomer', data[3][0].signCustomer);
                        
                            fetch('report.php', {
                                method: 'POST',
                                body: searchParams,
                            });


                            reportTechSign.append(techSign);
                            reportCustomerSign.append(customerSign);
                            console.log(data);
                        }
                    );
                    /* fetch('testFpdf.php', {
                        method: 'POST',
                        // body: text,
                    }) */
                    // form.action = 'testFpdf.php';
                    // showBnt.submit();
                })
                p.append(showBnt);
            })
            p.innerHTML = elem.customerName + '_' + elem.officeName;
            aside.appendChild(p);
        }
    }
);