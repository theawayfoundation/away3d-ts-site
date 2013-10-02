/// <reference path="../../libs/maps/jquery.d.ts" />
/// <reference path="../../libs/maps/ax.d.ts" />

/*
 * Author: Karim Beyrouti ( karim@kurst.co.uk )
 */

module kurst.utils {

    export class JSUtils{

        //--------------------------------------------------------------------------
        // Mobile

        static isAndroid () : boolean {
            return navigator.userAgent.match(/Android/i) ? true : false;
        }

        static isBlackBerry() : boolean{
            return navigator.userAgent.match(/BlackBerry/i) ? true : false;
        }

        static isIOS() : boolean{
            return navigator.userAgent.match(/iPhone|iPad|iPod/i) ? true : false;
        }

        static  isWindowsMob() : boolean {
            return navigator.userAgent.match(/IEMobile/i) ? true : false;
        }
        static isMobile() : boolean {
            return (JSUtils.isAndroid() || JSUtils.isBlackBerry() || JSUtils.isIOS() || JSUtils.isWindowsMob());
        }

        //--------------------------------------------------------------------------
        // Selection

        /*
         */
        static getId(id : string ) : HTMLElement {

            return document.getElementById( id );

        }
        /*
         */
        static getClass( className : string ) : NodeList {

            return document.getElementsByClassName( className );

        }
        /*
         */
        static getElementsByClassNme( theClass : string ) : Node[] {

            var classElms   : Node[] = new Array<Node>();
            var node        : Document = document;

            var i = 0

            if ( node.getElementsByClassName ) { // check if it's natively available

                var tempEls = node.getElementsByClassName(theClass);

                for ( i = 0 ; i < tempEls.length ; i++) {

                    classElms.push(tempEls[i]);

                }

            } else {  // if a native implementation is not available, use a custom one

                var getclass    : RegExp    = new RegExp('\\b'+theClass+'\\b');
                var elems       : NodeList  = node.getElementsByTagName('*');

                for ( i = 0; i < elems.length; i++) {

                    var classes = elems[i]['className'];

                    if ( getclass.test( classes )) {

                        classElms.push(elems[i]);

                    }

                }
            }

            return classElms;

        }
        /*
         */
        static getQueryParams( qs ) : Object {

            qs = qs.split("+").join(" ");

            var params = {}, tokens,
                re = /[?&]?([^=]+)=([^&]*)/g;

            while (tokens = re.exec(qs)) {
                params[decodeURIComponent(tokens[1])] = decodeURIComponent(tokens[2]);
            }

            return params;
        }

        //--------------------------------------------------------------------------
        // Desktop

        /*
         */
        static isFireFox() : boolean{

            return ( navigator.userAgent.search("Firefox") != -1 );


        }
        /*
         */
        static isIE() : boolean{

            return ( navigator.appVersion.indexOf("MSIE") != -1 );


        }
        /*
         */
        static getIEVersion() : number {

            if ( JSUtils.isIE() ){

                return parseFloat( navigator.appVersion.split( "MSIE" )[1] );

            }

            return -1;

        }
        /*
         */
        static isFlashEnabled() : boolean {

            if( JSUtils.isIE() ) {

                var version : number = JSUtils.getIEVersion();

                if ( version > 8 ) {

                    return ( window['ActiveXObject'] && ( new ActiveXObject("ShockwaveFlash.ShockwaveFlash") ) != false );

                } else {

                    try {

                        var aXObj = new ActiveXObject( 'ShockwaveFlash.ShockwaveFlash' );

                        if ( aXObj ){

                            return true;

                        }

                        return false;

                    } catch ( ex ) {

                        return false;

                    }

                }

                return false;

            } else {

                return ((typeof navigator.plugins != "undefined" && typeof navigator.plugins["Shockwave Flash"] == "object")  != false );

            }

        }

    }

}

