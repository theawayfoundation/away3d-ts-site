<?php

    $raw_json = file_get_contents( 'https://spreadsheets.google.com/feeds/list/0AixRtmEdizGcdGNPZlZ5TFd1YWdkVnczX1JlSnNfVFE/od6/public/values?alt=json' );

    $fp = fopen('data.json', 'w');
    fwrite($fp, $raw_json);
    fclose($fp);

?>