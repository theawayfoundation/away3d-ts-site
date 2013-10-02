<?php

    include 'classes/GsSpreadSheet.php';

    //--------------------------------------------------------------------------

    $gsData = new GsSpreadSheet();
    $gsData->loadURI( 'k2013code/data/data.json' );

    //--------------------------------------------------------------------------

    $data = $gsData->getData();

    for ($i = 0; $i < count( $data ); ++$i) {

        $rec = $data[ $i ];// . '<br>';

        echo( '          <div class="services-group">'. "\n");
        echo( '               <div class="services-content-title">' . $rec[ 'sectionname' ] . '</div>'. "\n");
        echo( '               <div class="services-content-clients">' . $rec[ 'clients' ] . '</div>'. "\n");
        echo( '               <div class="services-content-info">' . $rec[ 'info' ] . '</div>'. "\n");
        echo( '               <div class="services-content-list">' . $rec[ 'services' ] . '</div>'. "\n");
        echo( '          </div>' . "\n");

    }

?>