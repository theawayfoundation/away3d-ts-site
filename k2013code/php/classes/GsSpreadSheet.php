<?php


class GsSpreadSheet {

    //------------------------------------------------------------

    private $data       = array();
    private $raw_json   = '';

    //------------------------------------------------------------

    /*
     *
     */
    public function loadSpreadSheet( $id /* string */ ) {

        $uri = 'https://spreadsheets.google.com/feeds/list/' . $id . '/od6/public/values?alt=json';
        $this->loadURI( $uri );

    }
    /*
     *
     */
    public function loadURI( $uri /* string */ ) {

        $this->raw_json     = file_get_contents( $uri );
        $json_decoded       = json_decode( $this->raw_json , true );

        foreach ($json_decoded['feed']['entry'] as $j => $entry) {

            $record           = array();

            foreach ( $entry as $k => $v ) {

                if ( strpos( $k ,'gsx$' ) !== false ) {

                    foreach ($v as $sect => $t) {

                        $key            = str_replace( "gsx$" , "" , $k );
                        $record[ $key ] = $t;

                    }

                }

            }

            array_push( $this->data, $record );

        }

    }
    /*
     *
     */
    public function getJSON() {

        return $this->raw_json;

    }
    /*
     *
     */
    public function getData() {

        return $this->data;

    }

}


?>

