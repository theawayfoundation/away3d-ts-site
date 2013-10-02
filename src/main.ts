// ------------------------------------------------------------------------------------------------------------------------------------------------------
// --sourcemap $ProjectFileDir$/away_showcase_ts/k2013code/src/main.ts --out $ProjectFileDir$/away_showcase_ts/k2013code/js/main.js
// ------------------------------------------------------------------------------------------------------------------------------------------------------

///<reference path="kurst/utils/JSonLoader.ts"/>
///<reference path="kurst/utils/GSpreadSheetLoader.ts"/>
///<reference path="kurst/utils/JSUtils.ts"/>
///<reference path="kurst/website/BackgroundGrad.ts"/>
///<reference path="kurst/website/VideoPlayer.ts"/>
///<reference path="kurst/website/UI.ts"/>
///<reference path="kurst/website/AGLSLDemo.ts"/>
/// <reference path="libs/maps/jquery.d.ts" />

var controller = this;

module Main {

    //--------------------------------------------------------------------------
    // Data

    var gsData      : kurst.utils.GSpreadSheetLoader;                                       // Google Docs Spreadsheet loader

    //--------------------------------------------------------------------------
    // Website UI

    var videoPlayer     : KurstWebsite.VideoPlayer;                                         // Video Player
    var ui              : KurstWebsite.UI;                                                  // Site UI
    var bg              : KurstWebsite.BackgroundGrad;                                      // Background Gradient
    var iFrame          : HTMLIFrameElement;
    var AGLSLDemo       : KurstWebsite.AGLSLDemo;

    var colours         : string[] = ['#8b0000', '#019601', '#010192', '#008b8b', '#8e008e', '#bbbb00'];
    //--------------------------------------------------------------------------

    /*
     * Entry Point init and start the website components
     */
    export function start() {

        ui                  = new KurstWebsite.UI( $ );
        bg                  = new KurstWebsite.BackgroundGrad( );
        AGLSLDemo           = new KurstWebsite.AGLSLDemo();

        iFrame              = <HTMLIFrameElement> kurst.utils.JSUtils.getId( 'iFRameContent' );

        iFrame.src = 'http://kurst.co.uk/samples/awayts/awd_light_b/';//'test.html';


        var links = $('.content-link').click(function( event ){

            event.preventDefault();

            iFrame.src = $(this).attr('uri');

            $.scrollTo( '#logoContainer' , 800 );

            bg.setColour( colours[Math.floor(Math.random()*colours.length)] );

        });

        for ( var ind in links ) {

            var div = links[ind];
            var uri = $( div ).attr( 'href' );

            $( div ).attr( 'href' , '#' );

        }

        $( '.top-menuItem' ).click( function (){
            $.scrollTo( '#logoContainer' , 800 );
        });

        setTimeout( function () {
            bg.setColour( '#8b0000' );
        } , 3000 );

        //console.log( links );

    }
    /*
     * Callback - Google Spreadsheet data load error
     */
    function gsLoadError(){

    }

}

$( document ).ready( function (){

    Main.start();
    console.log( 'start2');

});
