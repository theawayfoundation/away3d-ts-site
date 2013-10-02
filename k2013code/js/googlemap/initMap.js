$( document ).ready( function (){

    var map;
    var address                 = 'Drysdale Street, Hoxton, London, N1 6ND';

    function initMap() {

        $( '#contact-map' ).hide( );

        geocoder = new google.maps.Geocoder();

        var myOptions = {
            zoom: 16,
            mapTypeControl: true,
            navigationControl: true,
            mapTypeId: google.maps.MapTypeId.ROADMAP
        };

        map = new google.maps.Map( document.getElementById( 'contact-map' ), myOptions);

        if (geocoder) {

            geocoder.geocode( { 'address': address} , function( results , status ) {

                if ( status == google.maps.GeocoderStatus.OK ) {

                    if ( status != google.maps.GeocoderStatus.ZERO_RESULTS ) {

                        var marker = new google.maps.Marker( {
                            position: results[0].geometry.location,
                            map: map,
                            title: address
                        } );

                        map.setCenter( results[0].geometry.location );

                        setTimeout(function() {

                            $( '#contact-map' ).fadeIn( 'slow' );
                            google.maps.event.trigger( map , 'resize' );
                            map.setCenter( results[0].geometry.location );

                            //map.setZoom( 10 );

                        }, 2000);



                    }

                }

            });
        }

    }

    initMap();



});