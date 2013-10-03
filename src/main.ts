///<reference path="kurst/utils/JSonLoader.ts"/>
///<reference path="kurst/utils/GSpreadSheetLoader.ts"/>
///<reference path="kurst/utils/JSUtils.ts"/>
///<reference path="kurst/website/BackgroundGrad.ts"/>
///<reference path="kurst/website/UI.ts"/>
///<reference path="kurst/website/AGLSLDemo.ts"/>
/// <reference path="libs/maps/jquery.d.ts" />

var controller = this;

module Main {

    //--------------------------------------------------------------------------
    // Website UI

    var ui              : KurstWebsite.UI;                                                  // Site UI
    var bg              : KurstWebsite.BackgroundGrad;                                      // Background Gradient
    var iFrame          : HTMLIFrameElement;                                                // IFrame
    var AGLSLDemo       : KurstWebsite.AGLSLDemo;                                           // AGLSL Demo
    var colours         : string[] = ['#8b0000', '#019601', '#010192', '#008b8b', '#8e008e', '#bbbb00'];

    //--------------------------------------------------------------------------

    /*
     * Entry Point init and start the website components
     */
    export function start() {

        ui                  = new KurstWebsite.UI( );
        bg                  = new KurstWebsite.BackgroundGrad( );
        AGLSLDemo           = new KurstWebsite.AGLSLDemo();
        iFrame              = <HTMLIFrameElement> kurst.utils.JSUtils.getId( 'iFRameContent' );

        iFrame.src = 'http://kurst.co.uk/samples/awayts/awd_light_b/';

	    // Get all .content-link classes to open into the iFrame
        var links = $('.content-link').click(function( event ){

            event.preventDefault();

            iFrame.src = $(this).attr('uri');

            $.scrollTo( '#logoContainer' , 800 );

            bg.setColour( colours[Math.floor(Math.random()*colours.length)] );

        });

	    // Replace all href's in .content-link to be anchors ( as they load their content in iFrames )
        for ( var ind in links ) {

            var div = links[ind];
            var uri = $( div ).attr( 'href' );

            $( div ).attr( 'href' , '#' );

        }

	    // Back to top links
        $( '.top-menuItem' ).click( function (){
            $.scrollTo( '#logoContainer' , 800 );
        });

	    // Get a background colour change
        setTimeout( function () {
            bg.setColour( '#8b0000' );
        } , 3000 );

    }

}

$( document ).ready( function (){

    Main.start();

});
