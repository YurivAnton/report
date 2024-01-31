<?php
$host = 'localhost';
$user = 'wpusr';
$pass = 'password';
$name = 'wp_db';

$link = mysqli_connect($host, $user, $pass, $name);

function getCustomerInfo($customer, $link){
    $query = "SELECT
                offices.office_name as office_name, offices.office_address as office_address, offices.office_city as office_city, 
                customers.customerName as customers_name, customers.address as customers_address, customers.city as customers_city, customers.contractual as contractual
            FROM 
            offices 
            LEFT JOIN customers ON customers.id=offices.customer_id
            WHERE customerName = '$customer'";
    $res = mysqli_query($link, $query) or die(mysqli_error($link));

    for ($data = []; $row = mysqli_fetch_assoc($res); $data[] = $row);

    return json_encode($data);
}

function getOfficeInfo($office, $link){
    $query = "SELECT * FROM offices WHERE office_name = '$office'";
    $res = mysqli_query($link, $query) or die(mysqli_error($link));

    for ($data = []; $row = mysqli_fetch_assoc($res); $data[] = $row);

    return json_encode($data);
}

if(!empty($_GET['customer'])){
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


if(isset($_POST['sub'])){
    // var_dump($_POST);
    /* file_put_contents("webdictionary.pdf", "asd");
    $myfile = fopen("webdictionary.pdf", "r") or die("Неможливо відкрити файл!");
    echo fread($myfile,filesize("webdictionary.pdf"));
    fclose($myfile); */
}