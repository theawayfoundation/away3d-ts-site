/// <reference path="../../libs/maps/jquery.d.ts" />
/// <reference path="../../libs/maps/jquery.scrollTo.d.ts" />
/// <reference path="../utils/JSUtils.ts" />

module KurstWebsite {

    export class UI {

        //--------------------------------------------------------------------------

        private $           : JQueryStatic;
        private expanded    : boolean = false;
        private fullScreen  : boolean = false;

        //--------------------------------------------------------------------------

        constructor( $ : JQueryStatic  ) {

            this.$ = $;
            this.init();

        }

        //--------------------------------------------------------------------------

        /*
         */
        public init() {

            $('#contentArea').hide();
            //$('#contentArea').css( 'top' , '580px' );

            $( '#logoContainer' ).css('height','0px');

            $( '#logoContainer' ).delay( 1000 ).animate(  {
                height : '120px'
            } , 1000 , 'easeOutQuad' );

            $( '#navigation').hide();
            $( '#navigation' ).delay( 1000 ).fadeIn( 2000 );

            this.showStaticContent( 1000 );
            this.initLinks();

            this.initFullScreenButton();


        }
        /*
         */
        public expandContent( flag : Boolean ) : void {

            /*
            if ( flag ) {

                this.expanded = true;

                $( '#contentArea' ).animate({
                    top: '800px'
                } , 500 , 'easeOutQuad' );

            } else {

                this.expanded = false;

                $( '#contentArea' ).animate({
                    top: '580px'
                } , 1000 , 'easeOutQuad' );

            }
            */
        }

        //--------------------------------------------------------------------------

        private launchFullScreen(element : Element ) {

            if(element['requestFullScreen']) {
                element['requestFullScreen']();
            } else if(element['mozRequestFullScreen']) {
                element['mozRequestFullScreen']();
            } else if(element['webkitRequestFullScreen']) {
                element['webkitRequestFullScreen']();
            }
        }

        private cancelFullscreen() {
            if(document['cancelFullScreen']) {
                document['cancelFullScreen']();
            } else if(document['mozCancelFullScreen']) {
                document['mozCancelFullScreen']();
            } else if(document['webkitCancelFullScreen']) {
                document['webkitCancelFullScreen']();
            }
        }

        private initFullScreenButton(){

            var controller : UI = this;
            $( '#fullScreenButton' ).click( function (){

                $.scrollTo( '#logoContainer' , 800 );

                if ( controller.fullScreen )
                {

                    if ( kurst.utils.JSUtils.isMobile() )
                    {
                        controller.cancelFullscreen();
                        $( '#logoContainer' ).fadeIn( 1000 );

                        $( '#fullScreenButton').attr("src" , 'media/images/fullscreen_alt.png' );

                        $('#videoContainer').css( 'top' , '40px' );
                        $( '#videoContainer').width( '100%' );
                        $( '#videoContainer').height( '400px' );
                        $('#videoContainer').css( 'top' , '0px' );

                        $( '#contentArea' ).fadeIn( 1000 );
                        $("body").css("overflow", "visible");

                    }
                    else
                    {

                        $( '#fullScreenButton').attr("src" , 'media/images/fullscreen_alt.png' );

                        $( '#videoContainer' ).width( '960px' );
                        $( '#videoContainer' ).height( '560px' );
                        $( '#videoContainer' ).css( 'top' , '40px' );
                        $( '#videoContainer' ).css( 'left' , '50%' );
                        $( '#videoContainer' ).css( 'margin-left' , '-480px' );

                        $( '#iFRameContent' ).width( '960px' );
                        $( '#iFRameContent' ).height( '560px' );
                        $( '#contentArea' ).fadeIn( 1000 );
                        $("body").css("overflow", "visible");

                    }



                    controller.fullScreen = false;
                } else {

                    if ( kurst.utils.JSUtils.isMobile() )
                    {
                        controller.launchFullScreen(document.documentElement);
                        $( '#logoContainer' ).fadeOut( 250 );
                    }

                    $( '#fullScreenButton').attr("src" , 'media/images/fullscreen_exit_alt.png' );

                    $( '#videoContainer').width( '100%' );
                    $( '#videoContainer').height( '100%' );
                    $( '#videoContainer').css( 'top' , '0px' );
                    $( '#videoContainer').css( 'left' , '0px' );
                    $( '#videoContainer').css( 'margin-left' , '0px' );

                    $( '#iFRameContent').width( '100%' );
                    $( '#iFRameContent').height( '100%' );

                    $( '#contentArea' ).fadeOut( 250 );
                    $("body").css("overflow", "hidden");

                    controller.fullScreen = true;

                }



            });


        }
        /*
         */
        private initLinks(){

            $( '#aboutUs-menuItem' ).click( function (){
                $.scrollTo( '#aboutUs-content', 800 );
            });

            $( '#contactUs-menuItem' ).click( function (){
                $.scrollTo( '#contactUs-content', 800 );

            });

            $( '#aboutTop' ).click( function (){
                $.scrollTo( '#logoContainer' , 800 );
            });

            $( '#contactTop' ).click( function (){
                $.scrollTo( '#logoContainer' , 800 );
            });

        }
        /*
         */
        private showStaticContent( delayTime ) {

            $( '#contentArea' ).delay( delayTime ).fadeIn( 1000 );

        }
    }
}