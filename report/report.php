<?php
$host = 'localhost';
$user = 'wpusr';
$pass = 'password';
$name = 'wp_db';

$link = mysqli_connect($host, $user, $pass, $name);



function getAllCustomers($link){
    $query = "SELECT customer_name FROM customers";
    $res = mysqli_query($link, $query) or die(mysqli_error($link));
    for ($data = []; $row = mysqli_fetch_assoc($res); $data[] = $row);
    return json_encode($data);
    var_dump($_POST);
}

function getCustomerInfo($customer, $link){
    if($customer == ''){
        $data = ['dataCustomer'=>[], 'dataOffice'=>['office_name']];
        return json_encode($data);
    }

    $queryCustomer = "SELECT * FROM customers WHERE customer_name = '$customer'";
    $res = mysqli_query($link, $queryCustomer) or die(mysqli_error($link));
    for ($dataCustomer = []; $row = mysqli_fetch_assoc($res); $dataCustomer[] = $row);

    $customerId = $dataCustomer[0]['id'];
    
    $queryOffice = "SELECT * FROM offices WHERE customer_id = $customerId";
    $res = mysqli_query($link, $queryOffice) or die(mysqli_error($link));
    for ($dataOffice = []; $row = mysqli_fetch_assoc($res); $dataOffice[] = $row);

    if(empty($dataOffice)){
        $dataOffice[] = 'office_name';
    }
    $data = ['dataCustomer'=>$dataCustomer[0], 'dataOffice'=>$dataOffice];
    
    return json_encode($data);
}

function getOfficeInfo($office, $link){
    $query = "SELECT * FROM offices WHERE office_name = '$office'";
    $res = mysqli_query($link, $query) or die(mysqli_error($link));

    for ($data = []; $row = mysqli_fetch_assoc($res); $data[] = $row);

    return json_encode($data);
}

function getAllReports($link){
    $query = "SELECT id, customerName, officeName FROM reports";
    $res = mysqli_query($link, $query) or die(mysqli_error($link));

    for ($data = []; $row = mysqli_fetch_assoc($res); $data[] = $row);

    return json_encode($data);
}

function save($data, $link){
    $customerName = $data['customerName'];
    $officeName = $data['officeName'];
    $fp = $data['fp'];
    if($fp == 0){
        $quantityCircuits = 0;
    } else {
        $quantityCircuits = $data['quantityCircuits'];
    }
    $fpBig = $data['fpBig'];
    if($fpBig == 0){
        $quantityCircuitsBig = 0;
    } else {
        $quantityCircuitsBig = $data['quantityCircuitsBig'];
    }
    
    $leaklog = $data['leaklog'];
    $description = $data['description'];
    $descriptionResult = $data['descriptionResult'];
    $typDevice = $data['typDevice'];
    $snDevice = $data['snDevice'];
    $coolant = $data['coolant'];
    $newCoolant = $data['newCoolant'];
    $oldCoolant = $data['oldCoolant'];
    $oil = $data['oil'];
    $newOil = $data['newOil'];
    $oldOil = $data['oldOil'];
    $mainTech = $data['mainTech'];
    $signTech = $data['signTech'];
    $nameCustomerSign = $data['nameCustomerSign'];
    $signCustomer = $data['signCustomer'];


    // $values = "('$customerName', '$officeName', '$fp', '$quantityCircuits')";

    $query = "INSERT 
        INTO reports (customerName, officeName, fp, quantityCircuits, fpBig, quantityCircuitsBig, leaklog, description, descriptionResult, typDevice, snDevice, coolant, newCoolant, oldCoolant, oil, newOil, oldOil, mainTech, nameCustomerSign, signTech, signCustomer) 
        VALUES ('$customerName', '$officeName', '$fp', '$quantityCircuits', '$fpBig', '$quantityCircuitsBig', '$leaklog', '$description', '$descriptionResult', '$typDevice', '$snDevice', '$coolant', '$newCoolant', '$oldCoolant', '$oil', '$newOil', '$oldOil', '$mainTech', '$nameCustomerSign', '$signTech', '$signCustomer')";
    mysqli_query($link, $query) or die(mysqli_error($link));

    $query = "SELECT MAX(id) FROM reports";
    $res = mysqli_query($link, $query) or die(mysqli_error($link));
    $row = mysqli_fetch_assoc($res);

    $report_id = $row['MAX(id)'];
    $dates = $data['date'];
    $transportKm = $data['transportKm'];
    $transportTime = $data['transportTime'];

    for($i=0; $i<count($dates); $i++){
        $query = "INSERT INTO dateTrans (report_id, dateRep, transportKm, transportTime) VALUES ('$report_id', '$dates[$i]', '$transportKm[$i]', '$transportTime[$i]')";
        mysqli_query($link, $query) or die(mysqli_error($link));
    }

    $technicianName = $data['technicianName'];
    $startTime = $data['startTime'];
    $finishTime = $data['finishTime'];
    $workDays = $data['workDays'];

    for($i=0; $i<count($technicianName); $i++){
        $query = "INSERT INTO workers (report_id, technicianName, startTime, finishTime, workDays) VALUES ('$report_id', '$technicianName[$i]', '$startTime[$i]', '$finishTime[$i]', '$workDays[$i]')";
        mysqli_query($link, $query) or die(mysqli_error($link));
    }

    $nameSparePart = $data['nameSparePart'];
    $quantitySparePart = $data['quantitySparePart'];
    $noteSparePart = $data['noteSparePart'];

    for($i=0; $i<count($nameSparePart); $i++){
        $query = "INSERT INTO spareParts (report_id, nameSparePart, quantitySparePart, noteSparePart) VALUES ('$report_id', '$nameSparePart[$i]', '$quantitySparePart[$i]', '$noteSparePart[$i]')";
        mysqli_query($link, $query) or die(mysqli_error($link));
    }
    
}

function show($link){
    $id = $_GET['show'];
    /* $query = "SELECT reports.customerName, dateTrans.dateRep, workers.technicianName
        FROM reports 
        LEFT JOIN dateTrans ON reports.id = dateTrans.report_id
        LEFT JOIN workers ON reports.id = workers.report_id
        WHERE reports.id=$id"; */
    $queryReport = "SELECT * FROM reports WHERE id=$id";
    $resReport = mysqli_query($link, $queryReport) or die(mysqli_error($link));
    for ($dataReport = []; $row = mysqli_fetch_assoc($resReport); $dataReport[] = $row);

    // var_dump($dataReport);
    $signTech = $dataReport[0]['signTech'];
    $image = substr($signTech, strpos($signTech, ',')+1);
    file_put_contents('signTech.png', base64_decode($image));

    $customerName = $dataReport[0]['customerName'];
    $queryCustomer = "SELECT * FROM customers WHERE customer_name='$customerName' LIMIT 1";
    $resCustomer = mysqli_query($link, $queryCustomer) or die(mysqli_error($link));
    for ($dataCustomer = []; $row = mysqli_fetch_assoc($resCustomer); $dataCustomer[] = $row);

    $officeName = $dataReport[0]['officeName'];
    $queryOffice = "SELECT * FROM offices WHERE office_name='$officeName' LIMIT 1";
    $resOffice = mysqli_query($link, $queryOffice) or die(mysqli_error($link));
    for ($dataOffice = []; $row = mysqli_fetch_assoc($resOffice); $dataOffice[] = $row);

    $queryDays = "SELECT * FROM dateTrans WHERE report_id=$id";
    $resDays = mysqli_query($link, $queryDays) or die(mysqli_error($link));
    for ($dataDays = []; $row = mysqli_fetch_assoc($resDays); $dataDays[] = $row);

    $queryWorkers = "SELECT * FROM workers WHERE report_id=$id";
    $resWorkers = mysqli_query($link, $queryWorkers) or die(mysqli_error($link));
    for ($dataWorkers = []; $row = mysqli_fetch_assoc($resWorkers); $dataWorkers[] = $row);

    $querySpare = "SELECT * FROM spareParts WHERE report_id=$id";
    $resSpare = mysqli_query($link, $querySpare) or die(mysqli_error($link));
    for ($dataSpare = []; $row = mysqli_fetch_assoc($resSpare); $dataSpare[] = $row);

    $data[] = $dataCustomer;
    $data[] = $dataOffice;
    $data[] = $dataDays;
    $data[] = $dataReport;
    $data[] = $dataWorkers;
    $data[] = $dataSpare;

    return json_encode($data);
    // return $data;
}

if(!empty($_GET['allCustomers'])){
    echo getAllCustomers($link);
}

if(isset($_GET['customer'])){
    echo getCustomerInfo($_GET['customer'], $link);
}

if(!empty($_GET['office'])){
    echo getOfficeInfo($_GET['office'], $link);
}

if(!empty($_POST['signTech'])){
    $signTech = $_POST['signTech'];
    $image = substr($signTech, strpos($signTech, ','));
    file_put_contents('signTech.png', base64_decode($image));
}

if(!empty($_POST['signCustomer'])){
    $signCustomer = $_POST['signCustomer'];
    $imageC = substr($signCustomer, strpos($signCustomer, ','));
    file_put_contents('signCustomer.png', base64_decode($imageC));
}

if(!empty($_POST['save'])){
    // $a = $_POST['customerName'];
    // var_dump($_POST);
    save($_POST, $link);
}

if(!empty($_GET['show'])){
    echo show($link);
}

if(!empty($_GET['getAllReports'])){
    echo getAllReports($link);
}