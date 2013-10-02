/// <reference path="../../libs/maps/jquery.d.ts" />
/// <reference path="../../libs/maps/swfobject.d.ts" />
/// <reference path="../utils/JSUtils.ts" />

module KurstWebsite {

    export class VideoPlayer {

        //--------------------------------------------------------------------------

        static NEW_SECTION      : string = 'new_section';
        static VIDEO_COMPLETE   : string = 'videoComplete';
        static VIDEO_STARTED    : string = 'videoStarted';

        //--------------------------------------------------------------------------

        private flashVideoURI           : string        = '';                   // URL of video for flash
        private htmlVideoURI            : string        = '';                   // URL of video for HTML
        private htmlVideoFrameObj       : Object        = new Object();         // HTML video frame object ( part of interval )
        private contentHeightVideo      : string        = '750px';              // Expanded video info height
        private contentHeightNoVideo    : string        = '540px';              // Collapsed video height
        private currentSectionID        : Number        = -1;                   // ID of Current section data ( position in array )
        private divIIDCounter           : number        = 0;                    // Div counter for generating unique ID's
        private clientLogoPath          : string        = 'media/images/';      // Path to images
        private flashPlayerID           : string        = 'kurstVideoPlayer';   // SWF object ID ( HTML )
        private sendJSONFncName         : string        = 'sendJSONToPlayer';   // Flash External interface send function name

        //--------------------------------------------------------------------------

        private $                       : JQueryStatic;                         // JQuery Reference
        private container               : HTMLElement;                          // Container Div for video
        private flashEnabled            : boolean;                              // Flash Enabled Flag
        private htmlVideoIID            : number;                               // Interval ID for HTML Video loop
        private videoData               : Object[];                             // Video Data ( from google spreadsheet )
        private currentSectionData      : Object;                               // Current Section Data
        private servicesDivID           : string;                               // Current Services DIV
        private clientGroupDivID        : string;                               // Current Client DIV
        private servicesInfoDivID       : string;                               // Current Services DIV
        private callbackObj             : Object;                               // Callback object ( target )
        private callbackFnc             : Function;                             // Callback function
        private callbackData            : Object;                               // Callback Data
        private flashXQueue             : string[];                             // Queue of messages to send to flash ( once it is initialised )
        private flashXQueueTimeoutID    : number;                               // Queue Process interval ID
        private htmlVideoObject;                                                // HTML Video Object

        //--------------------------------------------------------------------------

        constructor( $ : JQueryStatic , htmlDivContainer : HTMLElement , flashVideoURI : string , htmlVideoURI : string ) {

            this.flashVideoURI  = flashVideoURI;
            this.htmlVideoURI   = htmlVideoURI;
            this.flashXQueue    = [];
            this.container      = htmlDivContainer;
            this.$              = $;

            this.init();

        }

        //--------------------------------------------------------------------------

        /*
         * Receive events from the Flash Video Player
         */
        public receiveFlashVideoEvent( event ) : void {

            switch ( event.type ){

                case 'complete' :

                    this.videoEnded();

                    break;

                case 'mouseLeave' :

                    break;

                case 'frame' :

                    this.videoFrame( event );

                    break;

                case 'pause' :

                    break;

                case 'play' :

                    this.videoStarted();

                    break;

                case 'bufferLoaded' :

                    break;
            }
        }
        /*
         * Set data ( from google docs spread sheet )
         */
        public setData( vd :  Object[] ) : void {

            this.videoData = vd;

        }
        /*
         * Set event callbacks for the video object
         */
        public setCallback( obj : Object , fnc : Function ) : void {

            this.callbackObj = obj;
            this.callbackFnc = fnc;
        }
        /*
         * Send JSON Data to flash ( to reduce the number of calls to Google Docs )
         * flash will time out after 5 seconds and try and loads it if this fails
         */
        public sendJsonDataToFlash( obj : string ) : void {

            var fObject : Object = this.getFlashMovie();

            if ( fObject ) {

                if ( fObject.hasOwnProperty( this.sendJSONFncName )){

                    fObject[ this.sendJSONFncName ]( obj );

                } else {

                    clearInterval( this.flashXQueueTimeoutID );

                    this.flashXQueue.push( obj );

                    var controller : VideoPlayer = this;
                    this.flashXQueueTimeoutID = setInterval( function () {

                        controller.processXQeue();

                    } , 100 );
                }

            }

        }

        //--------------------------------------------------------------------------

        /*
         * Initialise the video player
         */
        private init() : void {

            this.flashEnabled = kurst.utils.JSUtils.isFlashEnabled();
            this.callbackData = new Object();

            if ( this.flashEnabled ) {

                this.initFlashVideoPlayer();

            } else {

               this.initHTMLVideoPlayer();

            }

            $( '#clientList' ).css( 'visibility' , 'visible' );
            $( '#servicesList' ).css( 'visibility' , 'visible' );
            $( '#servicesDesc' ).css( 'visibility' , 'visible' );
            $( '#' + this.container.id ).css('height', this.contentHeightNoVideo );

        }
        /*
         * Show section info depending which part of the video is player ( clients / services / info )
         */
        private showSection ( sectionData )  : void {

            if( Number( sectionData.id ) != this.currentSectionID ) {

                this.showClientList( sectionData );
                this.showServicesList( sectionData );
                this.showServicesInfo( sectionData );
                this.sendCallback( KurstWebsite.VideoPlayer.NEW_SECTION , sectionData );

            }

        }
        /*
         * Send a callback message ( defined in setCallback )
         */
        private sendCallback( type : string , obj ? : Object ) : void {

            if ( this.callbackFnc ){

                this.callbackData['type'] = type;

                if ( obj ) {

                    this.callbackData['data'] = obj;

                }

                this.callbackFnc.apply( this.callbackObj , [ this.callbackData ] );

            }

        }

        //--FLASH-VIDEO-----------------------------------------------------------------------

        /*
         * Initialise the Flash Video
         */
        private initFlashVideoPlayer() : void {

            var flashvars : IFlashVars = {

                debug:'false',
                video_uri: this.flashVideoURI ,
                proxy_uri: 'k2013code/php/dataProxy.php',
                js_callback: 'htmlVideoEvent'

            };

            var params = {

                wmode: 'direct',
                scale: 'noscale',
                menu: 'false',
                allowscriptaccess:'always',
                allowFullScreen: 'true',
                bgcolor:"30353b"

            };

            var attributes = {

                id: 'kurstVideoPlayer',
                name: 'kurstVideoPlayer'

            };

            swfobject.embedSWF( 'media/swf/KurstVideoPlayer.swf' , 'videoPlayer' , '960' , '540' , '11.0.0' , '' , flashvars , params , attributes , null );

        }
        /*
         * Process Queued data to send to the Flash object ( namely GS data / JSON )
         */
        private processXQeue () : void {

            if ( this.flashXQueue.length == 0 ) {

                clearInterval( this.flashXQueueTimeoutID );

            }

            var fObject : Object = this.getFlashMovie();

            if ( fObject ) {

                if ( fObject.hasOwnProperty( this.sendJSONFncName )){

                    clearInterval( this.flashXQueueTimeoutID );

                    for ( var c = 0 ; c < this.flashXQueue.length ;c ++ ) {

                        fObject['sendToPlayer']( this.flashXQueue.pop() );

                    }
                }

            }

        }
        /*
         * Get a reference to the flash swf object
         */
        private getFlashMovie() : Object {

            //if ( navigator.appName.indexOf("Microsoft") != -1 )
            if ( kurst.utils.JSUtils.isIE() ) {

                return window[ this.flashPlayerID ];

            } else {

                return document[ this.flashPlayerID ];

            }

        }

        //--HTML-VIDEO-----------------------------------------------------------------------

        /*
         * Initialise the HTML Video
         */
        private initHTMLVideoPlayer() : void {

            var videoHTML : String  = '<video controls width="960" height="540" id="htmlVideo">';
                videoHTML          += '     <source src="' + this.htmlVideoURI + '" type="video/mp4" />';
                videoHTML          += '</video>';

            $('#videoPlayer').css('visibility' , 'visible');
            $('#videoPlayer').append( videoHTML );

            this.htmlVideoObject = $("#htmlVideo").get(0);

            var controller = this;

            this.htmlVideoObject.addEventListener( "playing",      function( event ){controller.htmlVideoEvent( event );}, false);
            this.htmlVideoObject.addEventListener( "play",         function( event ){controller.htmlVideoEvent( event );}, false);
            this.htmlVideoObject.addEventListener( "pause",        function( event ){controller.htmlVideoEvent( event );}, false);
            this.htmlVideoObject.addEventListener( "ended",        function( event ){controller.htmlVideoEvent( event );}, false);
            this.htmlVideoObject.addEventListener( "timeupdate",   function( event ){controller.htmlVideoEvent( event );}, false);

        }
        /*
         * HTML video frame loop
         */
        private htmlVideoInterval( ) : void {

            this.htmlVideoFrameObj['currentFrame'] = Math.round( this.htmlVideoObject.currentTime * 25 );
            this.videoFrame( this.htmlVideoFrameObj );

        }
        /*
         * HTML video event handler
         */
        private htmlVideoEvent( event ) : void {

            switch ( event.type ){

                case 'playing' :

                    break;

                case 'play' :

                    this.videoStarted();

                    break;

                case 'timeupdate' :

                    break;


                case 'ended' :

                    this.videoEnded();

                    break;

                case 'pause' :

                    break;


            }

        }

        //--VIDEO------------------------------------------------------------------------

        /*
         * Video Frame handler
         */
        private videoFrame( frameData ) : void {

            var currentFrame    = parseInt( frameData.currentFrame );
            var gsDataLength    = this.videoData.length;

            var obj;
            var startTime;
            var endTime;

            for ( var c = 0 ; c < gsDataLength ; c ++ ) {

                obj         = this.videoData[c];
                startTime   = parseInt( obj.sectionstart );
                endTime     = parseInt( obj.sectionend );

                if ( currentFrame != 0 ) {

                    if ( currentFrame >= startTime && currentFrame <=  endTime ) {

                        if ( this.currentSectionID != obj['id'] ){

                            this.currentSectionData  = obj;
                            this.showSection( this.currentSectionData );
                            this.currentSectionID    = obj['id'];

                        }
                    }
                }
            }
        }
        /*
         * Show the dynamic content area / expand the video player
         */
        private showDynamicVideoContent( flag : Boolean ) : void {

            if ( flag ) {

                if ( ! this.flashEnabled ) {

                    var controller : VideoPlayer = this;
                    this.htmlVideoIID = setInterval( function () {

                        controller.htmlVideoInterval(  );

                    } , 33 );

                }

                $( '#' + this.container.id ).animate({
                    height:  this.contentHeightVideo
                } , 500 , 'easeOutQuad' , function (){} );

            } else {

                if ( !  this.flashEnabled  ) {

                    clearInterval( this.htmlVideoIID );

                }

                this.$( '#videoContainer' ).animate({
                    height: this.contentHeightNoVideo
                } , 1000 , 'easeOutQuad' );

            }

        }
        /*
         * Video ended functions
         */
        private videoEnded() : void {

            this.showDynamicVideoContent( false );
            this.sendCallback( KurstWebsite.VideoPlayer.VIDEO_COMPLETE );

        }
        /*
         * Video started functions
         */
        private videoStarted() : void {

            this.showDynamicVideoContent( true );
            this.sendCallback( KurstWebsite.VideoPlayer.VIDEO_STARTED );

        }

        //-- Client List------------------------------------------------------------------

        /*
         */
        private showClientList( sectionData ) : void {

            if ( this.clientGroupDivID != null ) {

                var myID        = this.clientGroupDivID;
                var controller  = this;

                $( '#' + this.clientGroupDivID ).animate(
                    {   left: '960px' },
                    {   duration: 500,
                        easing: 'easeInOutQuad',
                        complete: function() {

                            $( '#' + myID ).remove();
                            controller['showNewClientList']( sectionData );

                        }
                    }
                );

            } else {

                this.showNewClientList( sectionData );

            }

        }
        /*
         */
        private showNewClientList( sectionData ) : void {

            var clientDivHTML;
            var clientLogoID;
            var client              = '';
            var imagePath           = '';
            var imageTag            = '';
            var clients             = sectionData.clients.split( ',');
            var clientLogoPrefix    = 'clientLogoID_';
            var clientGroupID       = 'ClientGroup_' + ( this.divIIDCounter++ );
            var clientGroupHTML     = "<div class='clientGroup' id='" + clientGroupID + "'></div>";

            this.clientGroupDivID   = clientGroupID;

            $('#clientList').append( clientGroupHTML );
            $( '#' + clientGroupID ).css( 'left' , '-960px' );
            $( '#' + clientGroupID ).animate(
                { left: '0px'},
                { duration: 1000,easing: 'easeOutQuad'}
            );

            for ( var c = 0  ; c < clients.length ; c ++ ){

                client              = clients[c];

                if ( client.indexOf( '.png') != -1 ) {

                    imagePath           = this.clientLogoPath + client;
                    imageTag            = "<img src='"+imagePath+"'>";

                    clientLogoID        = clientLogoPrefix + ( this.divIIDCounter ++ );
                    clientDivHTML       = "<div class='clientLogoContainer' id='" + clientLogoID  + "'><div class='clientLogo'>"+ imageTag + "</div></div>";

                    $( '#' + clientGroupID ).append( clientDivHTML );

                } else {

                    clientLogoID        = clientLogoPrefix + ( this.divIIDCounter ++ );
                    clientDivHTML       = "<div class='clientLogoContainer' id='" + clientLogoID  + "'><div class='clientLogo'>"+ client + "</div></div>";

                    $( '#' + clientGroupID ).append( clientDivHTML );

                }

            }

        }

        //--Services List------------------------------------------------------------------

        /*
         */
        private showServicesList( sectionData ) : void {

            if ( this.servicesDivID != null ){

                var myID        = this.servicesDivID;
                var controller  = this;

                $( '#' + this.servicesDivID ).animate (
                    { left: '960px'},
                    {   duration: 500,
                        easing: 'easeInOutQuad',
                        complete: function() {
                            $('#' + myID ).remove();
                            controller['showNewServicesList']( sectionData );
                        }
                    }
                );

            } else {

                this.showNewServicesList( sectionData );

            }

        }
        /*
         */
        private showNewServicesList( sectionData ) : void {

            var servicesDivIDPrefix = 'servicesList_';
            var servicesID          = servicesDivIDPrefix + ( this.divIIDCounter ++ );
            var servicesHTML        = "<div class='servicesInfo' id='" + servicesID + "'>"+ sectionData.services + "</div>";

            $('#servicesList').append( servicesHTML );

            $( '#' + servicesID ).css( 'left' , '-960px' );
            $( '#' + servicesID ).delay( 100 ).animate(
                { left: '0px'},
                { duration: 1000,easing: 'easeOutQuad'}
            );

            this.servicesDivID = servicesID;

        }

        //--Services Info------------------------------------------------------------------

        /*
         */
        private showServicesInfo( sectionData ) : void {

            if ( this.servicesInfoDivID != null ) {

                var myIDInfo    = this.servicesInfoDivID;
                var controller  = this;

                $('#' + this.servicesInfoDivID ).fadeOut( 'slow' , function() {

                    $('#' + myIDInfo ).remove();
                    controller['showNewServicesInfo']( sectionData );

                });

            } else {

                this.showNewServicesInfo( sectionData );

            }

        }
        /*
         */
        private showNewServicesInfo( sectionData ) : void {

            var servicesDivIDPrefix = 'servicesListInfo_';
            var servicesInfoID      = servicesDivIDPrefix + ( this.divIIDCounter ++ );
            var servicesInfoHTML    = "<div class='servicesDescContent' id='" + servicesInfoID + "'>"+ sectionData.info + "</div>";

            $( '#servicesDesc').append( servicesInfoHTML );
            $( '#' + servicesInfoID ).hide( );
            $( '#' + servicesInfoID ).delay( 600 ).fadeIn( 1000 );

            this.servicesInfoDivID = servicesInfoID;
        }

    }

}
