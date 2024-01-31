<?php
require('fpdf/fpdf.php'); 

// var_dump($_POST);
/* for($i = 0; $i<count($_POST['technicianName']); $i++){
    if(isset($_POST["mainTech$i"])){
        var_dump($_POST["mainTech$i"]);
        var_dump($_POST["technicianName"][$i]);

    }
    
} */


$customerName = '';
$customerAddress = '';
$customerCity = '';
$customerContractual = 0;
$officeName = '';
$officeAddress = '';
$officeCity = '';

$date = date('d.m.Y', strtotime($_POST['date']));
$startTime = $_POST['startTime'][0];
$finishTime = $_POST['finishTime'][0];
$transportKm = $_POST['transportKm'];
$workedTimeSum = 0;
for($i=0; $i<count($_POST['finishTime']); $i++){
    $workedTimeSum += round((strtotime($_POST['finishTime'][$i]) - strtotime($_POST['startTime'][$i])) / 3600, 1);
}
$transportTime = $_POST['transportTime'];
$transportTimeSum = 0;

$fP = $_POST['fp'];
$fPBig = $_POST['fpBig'];

$description = $_POST['description'];
$descriptionResult = $_POST['descriptionResult'];

$coolant = $_POST['coolant'];

if(!empty($_POST['customerName'])){
    $customerName = $_POST['customerName'];
    $customerAddress = $_POST['customerAddress'];
    $customerCity = $_POST['customerCity'];
}

if(!empty($_POST['contractual'])){
    $customerContractual = $_POST['contractual'];
}

if(!empty($_POST['officeName'])){
    $officeName = $_POST['officeName'];
    $officeAddress = $_POST['officeAddress'];
    $officeCity = $_POST['officeCity'];
}

class report_PDF extends FPDF{
    function Header(){
        $this->AddFont('Roboto-Regular', '', 'Roboto-Regular.php');
        $this->AddFont('Roboto-Bold', 'B', 'Roboto-Bold.php');
        $this->Image('ksmart.jpg', 10, 10 , 150, 40); 
        $this->SetXY(200, 5);
        $this->SetFont('Roboto-Bold', 'B', 24);
        $this->Cell(200, 50, $this->encodHelper('Servisný záznam'), '', '', 'C');
        $this->SetXY(410, 10);
        $this->SetFont('Roboto-Regular', '', 8);

        $str = 'Ksmart s.r.o. Stromová 5723/22 900 27 Bernolákovo IČO: 46 89 20 52 DIČ: 2023667448  IČ DPH: SK 2023667448';
        $this->MultiCell(180, 15, $this->encodHelper($str), '', 'C', '');
    }

    function objed($nameTitle, $name, $adres, $city, $x, $y, $text, $customerContractual){
        $this->SetFont('Roboto-Regular', '', 11);
        $this->Cell(150, 45, $this->encodHelper($nameTitle), 'TLB', '', 'C');
        $this->Cell(50, 15, $this->encodHelper('Názov :'), 'T', '', 'R');   
        $this->Cell(255, 15, $name, 'TB', '', 'C');
        
        $this->SetFillColor(200,220,255);
        $this->Cell(120, 15, $this->encodHelper($text), '1', '1', 'C', true);
        
        $this->SetLeftMargin(160);

        $this->Cell(50, 15, $this->encodHelper('Adresa :'), '', '', 'R');
        $this->Cell(255, 15, $adres, 'B', '', 'C');

        if ($text === 'Typ zákazníka:') {
            if($customerContractual){
                $this->Cell(120, 30, $this->encodHelper('Zmluvný'), '1', '', 'C');
            } else {
                $this->Cell(120, 30, $this->encodHelper('Nezmluvný'), '1', '1', 'C');
            }
        } else {
            $this->Cell(120, 30, '', '1', '1');
        }

        $this->SetXY($x, $y);
        $this->Cell(50, 15, $this->encodHelper('Mesto :'), 'B', '', 'R');
        $this->Cell(270, 15, $city, 'B', '', 'C');
    }

    function timing($data, $widths, $height, $fill = false){
        $ln = '';
        for($i=0; $i<count($data); $i++){
            if($i == count($data) - 1){
                $ln = 1;
            }
            $this->Cell($widths[$i], $height, $this->encodHelper($data[$i]), '1', $ln, 'C', $fill);
        }
    }

    function encodHelper($text){
        return mb_convert_encoding($text, 'ISO-8859-2', 'UTF-8');
    }
}


$pdf = new report_PDF('P', 'pt', 'A4');
$pdf->AddPage(); 
$pdf->AddFont('Roboto-Regular', '', 'Roboto-Regular.php');
$pdf->AddFont('Roboto-Bold', 'B', 'Roboto-Bold.php');

$pdf->SetXY(10, 65);
$pdf->objed('OBJEDNÁVATEĽ', $customerName, $customerAddress, $customerCity, 160, 95, 'Typ zákazníka:', $customerContractual);

$pdf->SetXY(10, 110);
$pdf->objed('UŽÍVATEĽ', $officeName, $officeAddress, $officeCity, 160, 140, 'Číslo ponuky / akcie:', $customerContractual);

$pdf->SetXY(10, 155);
$pdf->SetFont('Roboto-Regular', '', 9);
$pdf->Cell(375, 10, $pdf->encodHelper('Sumárny záznam'), '', '', 'C');
$pdf->Cell(10, 10, '', '');
$pdf->Cell(205, 10, $pdf->encodHelper('Podrobný rozpis'), '', '', 'C');

$pdf->SetFont('Roboto-Regular', '', 8);
$pdf->SetXY(10, 165);
$pdf->SetFillColor(200,220,255);
$pdf->SetLeftMargin(10);

$sumZazTitle = ['Dátum', 'Začiatok práce', 'Koniec práce', 'Doprava km', 'Odprac. Hodiny', 'Doprava Hodiny'];
$sumZazWidth = [75, 60, 60, 60, 60, 60];
$pdf->timing($sumZazTitle, $sumZazWidth, 30, $fill = true);
$pdf->SetFont('Roboto-Regular', '', 10);
$sumZazData = [$date, $startTime, $finishTime, $transportKm, $workedTimeSum, $transportTime];
$pdf->timing($sumZazData, $sumZazWidth, 30);

$pdf->SetFont('Roboto-Bold', 'B', 12);
$pdf->Cell(75, 30, $pdf->encodHelper('F-Plyny'), '1', '', 'C');
$pdf->SetFont('Roboto-Regular', '', 10);

if($fP){
    $fP = 'Áno';
    $fPQ = $_POST['quantityCircuits'];
} else {
    $fP = 'Nie';
    $fPQ = '';
}
$pdf->Cell(300, 15, $pdf->encodHelper('5 - 50 ton CO2-eq'.' - '.$fP.' '.$fPQ.' ks'), '1', '2', 'C');

if($fPBig){
    $fPBig = 'Áno';
    $fPQBig = $_POST['quantityCircuitsBig'];
} else {
    $fPBig = 'Nie';
    $fPQBig = '';
}
$pdf->Cell(300, 15, $pdf->encodHelper('50 - 500 ton CO2-eq'.' - '.$fPBig.' '.$fPQBig.' ks'), '1', '1', 'C');
$pdf->SetFont('Roboto-Bold', 'B', 12);
$pdf->Cell(75, 15, $pdf->encodHelper('Leaklog'), '1', '', 'C');
$pdf->SetFont('Roboto-Regular', '', 10);
$pdf->Cell(300, 15, $pdf->encodHelper($_POST['leaklog']), '1', '', 'C');

$pdf->SetFont('Roboto-Regular', '', 8);
$pdf->SetXY(385, 165);
$pdf->Cell(10, 10, '', '');

$pdf->Cell(100, 30, $pdf->encodHelper('Meno TECHNIKA'), '1', '', 'C', true);
$pdf->MultiCell(55, 15, $pdf->encodHelper('Odpracované Hodiny'), '1', 'C', true);
$pdf->SetXY(549, 165);
$pdf->MultiCell(36, 15, $pdf->encodHelper('Doprava Hodiny'), '1', 'C', true);
// $pdf->SetXY(577, 165);
// $pdf->MultiCell(23, 15, $pdf->encodHelper('Druh prác'), '1','C', true);


$pdf->SetFont('Roboto-Regular', '', 10);
$y = 195;
for($i=0; $i<count($_POST['technicianName']); $i++){
    $pdf->SetXY(395, $y);
    $transportTimeSum += $transportTime;
    $technicianName = $_POST['technicianName'];
    $workedTime = $workedTime = round((strtotime($_POST['finishTime'][$i]) - strtotime($_POST['startTime'][$i])) / 3600, 1);
    $pdf->timing([$_POST['technicianName'][$i], $workedTime, $transportTime], [100, 54, 36], 15);
    $y += 15;
    if(isset($_POST["mainTech$i"])){
        $nameOfMainTech = $_POST['technicianName'][$i];
    }
    /* if($_POST['mainTech']){
        $nameOfMainTech = $_POST['technicianName'][$i];
    } */
    // var_dump($_POST['technicianName']);
    if($i == count($_POST['technicianName']) - 1){
        $pdf->SetXY(395, $y);
        $pdf->SetFont('Roboto-Bold', 'B', 12);
        $pdf->timing(['Sumár spolu', $workedTimeSum, $transportTimeSum], [100, 54, 36], 15);
    }
}
if($y < 250){
    $pdf->SetXY(10, 280);
} else {
    $pdf->ln(10);
}

$pdf->SetFont('Roboto-Regular', '', 14);
$pdf->MultiCell(575, 20, $pdf->encodHelper('Popis zásahu: ').$pdf->encodHelper($description), '1');

$pdf->ln(10);
$pdf->MultiCell(575, 20, $pdf->encodHelper('Výsledok / Odporúčania: ').$pdf->encodHelper($descriptionResult), '1');

$pdf->ln(10);
$pdf->SetFont('Roboto-Regular', '', 10);
$pdf->Cell(575, 15, $pdf->encodHelper('Identifikácia ZARIADENIA'), '1', '1', 'C', true);
$pdf->Cell(195, 15, $pdf->encodHelper('CIAT typ:'), '1', '', 'C');
$pdf->Cell(380, 15, $pdf->encodHelper('A.R./series N°'), '1', '1', 'C');
$pdf->SetFont('Roboto-Bold', 'B', 12);
$pdf->Cell(195, 15, $_POST['typDevice'], '1', '', 'C');
$pdf->Cell(380, 15, $_POST['snDevice'], '1', '1', 'C');

$pdf->ln(10);
$pdf->SetFont('Roboto-Regular', '', 10);
$pdf->Cell(290, 15, $pdf->encodHelper('CHLADIVO'), '1', '', 'C', true);
$pdf->Cell(285, 15, $pdf->encodHelper('OLEJ'), '1', '1', 'C', true);
$pdf->Cell(120, 15, $pdf->encodHelper('Typ chladiva:'), '1', '', '');
$pdf->SetFont('Roboto-Bold', 'B', 12);
$pdf->Cell(170, 15, $coolant,'1', '', 'C');
$pdf->SetFont('Roboto-Regular', '', 10);
$pdf->Cell(120, 15, $pdf->encodHelper('Typ oleja:'), '1', '', '');
$pdf->SetFont('Roboto-Bold', 'B', 12);
$pdf->Cell(165, 15, $_POST['oil'],'1', '1', 'C');
$pdf->SetFont('Roboto-Regular', '', 10);
$pdf->Cell(120, 15, $pdf->encodHelper('Doplnené (nové):'), '1', '', '');
$pdf->SetFont('Roboto-Bold', 'B', 12);
$pdf->Cell(170, 15, $_POST['newCoolant'].' kg', '1', '', 'C');
$pdf->SetFont('Roboto-Regular', '', 10);
$pdf->Cell(120, 15, $pdf->encodHelper('Doplnené (nový):'), '1', '', '');
$pdf->SetFont('Roboto-Bold', 'B', 12);
$pdf->Cell(165, 15, $_POST['newOil'].' kg', '1', '1', 'C');
$pdf->SetFont('Roboto-Regular', '', 10);
$pdf->Cell(120, 15, $pdf->encodHelper('Odobrané (už nepoužité):'), '1', '', '');
$pdf->SetFont('Roboto-Bold', 'B', 12);
$pdf->Cell(170, 15, $_POST['oldCoolant'].' kg', '1', '', 'C');
$pdf->SetFont('Roboto-Regular', '', 10);
$pdf->Cell(120, 15, $pdf->encodHelper('Odobrané (už nepoužitý):'), '1', '', '');
$pdf->SetFont('Roboto-Bold', 'B', 12);
$pdf->Cell(165, 15, $_POST['oldOil'].' kg', '1', '1', 'C');

$pdf->ln(10);
$pdf->SetFont('Roboto-Bold', 'B', 12);
$pdf->Cell(250, 15, $pdf->encodHelper('NÁHRADNÉ DIELY'), '1', '', 'C');
$pdf->Cell(75, 15, $pdf->encodHelper('Množstvo'), '1', '', 'C');
$pdf->Cell(250, 15, $pdf->encodHelper('Poznámka'), '1', '1', 'C');
$pdf->SetFont('Roboto-Regular', '', 10);
for($i=0; $i < count($_POST['nameSparePart']); $i++){
    $pdf->timing([$_POST['nameSparePart'][$i], $_POST['quantitySparePart'][$i], $_POST['noteSparePart'][$i]], [250, 75, 250], 15);
}

$pdf->ln(10);
$pdf->Cell(100, 30, $pdf->encodHelper('Hlavný TECHNIK:'), '1', '', 'C', true);
$pdf->Cell(150, 30, 'Anton Yuriv', '1', '', 'C');
$pdf->Cell(75, 30, '');
$pdf->MultiCell(100, 15, $pdf->encodHelper('Meno zodp. osoby zákazníka:'), '1', 'C', true);
$pdf->SetXY($pdf->GetX()+425, $pdf->GetY()-30);
$pdf->Cell(150, 30, $pdf->GetX().$pdf->GetY(), '1', '1', 'C');
$pdf->Cell(100, 100, $pdf->encodHelper('Podpis technika:'), '', '', 'C');
$pdf->Cell(150, 100, $nameOfMainTech, '');
$pdf->Image('signTech.png', 10, 600 , 400, 250);
$pdf->Cell(75, 30, '');
$pdf->Cell(100, 100, $pdf->encodHelper('Podpis zákazníka:'), '', '', 'C');
$pdf->Cell(150, 100, '', '');


$pdf->Output('reciept.pdf', 'I');
