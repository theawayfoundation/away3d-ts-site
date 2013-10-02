<?php

include 'classes/GsSpreadSheet.php';


//--------------------------------------------------------------------------

$gsData = new GsSpreadSheet();
$gsData->loadSpreadSheet( '0AixRtmEdizGcdGNPZlZ5TFd1YWdkVnczX1JlSnNfVFE' );


//https://spreadsheets.google.com/feeds/list/0AixRtmEdizGcdGNPZlZ5TFd1YWdkVnczX1JlSnNfVFE/od6/public/values?alt=json
//--------------------------------------------------------------------------

$data = $gsData->getData();

for ($i = 0; $i < count( $data ); ++$i) {

    $rec = $data[ $i ];// . '<br>';

    print '-----------------------------------' .'<br>';

    foreach ($rec as $key => $val) {

        print "$key = $val" . '<br>';

    }

}

print '-------------------------------------------------------------------------------------------------------------------------------------------- <br>' ;

print $gsData->getJSON();


?>