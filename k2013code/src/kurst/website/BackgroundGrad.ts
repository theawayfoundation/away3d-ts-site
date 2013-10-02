/// <reference path="../../libs/maps/tweenlite.d.ts" />
/// <reference path="../../libs/maps/jquery.d.ts" />
/// <reference path="../utils/NumberUtils.ts" />
/// <reference path="../core/UIBase.ts" />

module KurstWebsite {

    export class BackgroundGrad extends kurst.core.UIBase {

        //--------------------------------------------------------------------------

        private $                   : JQueryStatic;
        private lastColour          : string = '#30353b';
        private colourTween         : Object;
        private bgUpdateCounter     : number = 0;
        private backgroundColour    : string = '#30353b';            // Default background colour

        //--------------------------------------------------------------------------

        constructor( ){//$ : JQueryStatic  ) {

            super();
            //this.$ = $;
            this.colourTween = new Object();

        }

        //--------------------------------------------------------------------------

        /*
         */
        public setColour( colour: string ) : void {

            this.animateBackground( colour );

        }
        /*
         */
        public resetBackground() : void {

            this.animateBackgroundToColour( this.backgroundColour );

        }

        //--------------------------------------------------------------------------

        /*
         */
        private animateBackground( colour ) : void {

            this.animateBackgroundToColour( colour );

        }
        /*
         */
        private animateBackgroundToColour( colour ) : void {

            if ( this.lastColour != null ) {

                this.colourTween['color0'] = this.lastColour;

            }

            TweenLite.killTweensOf( this.colourTween );

            var controller : BackgroundGrad = this;
            TweenLite.to( this.colourTween, 6 , { colorProps : { color0:colour }, onUpdate : function () {controller.updateBackgroundTween(); } , onComplete : function () {controller.completeBackgroundTween(); } });

            this.bgUpdateCounter    = 0;

        }
        /*
         */
        private updateBackgroundTween() : void {

            if ( this.bgUpdateCounter % 10 == 0 ) { // Optimisation

                this.bgUpdateCounter    = 0;
                var v                   = this.colourTween['color0'];
                this.lastColour         = kurst.utils.NumberUtils.rgbToHex( v );

                this.getId('backgroundD').style.backgroundImage = 'radial-gradient(farthest-corner at center 180px, ' + this.lastColour + ' 0%, ' + this.backgroundColour + ' 620px)';
                this.getId('backgroundD').style.backgroundImage = '-o-radial-gradient(center 180px, farthest-corner, ' + this.lastColour + ' 0%, ' + this.backgroundColour + ' 620px)'
                this.getId('backgroundD').style.backgroundImage = '-webkit-radial-gradient(center 180px, farthest-corner, ' + this.lastColour + ' 0%, '+this.backgroundColour + ' 620px)'
                this.getId('backgroundD').style.backgroundImage = '-webkit-gradient(radial, 180px 180px, 0, 180px 0%, 813, color-stop(0%, '+ this.lastColour + '), color-stop(620px, ' + this.backgroundColour + '))' ;//

                /*
                $( '#backgroundD' ).css('backgroundImage','radial-gradient(farthest-corner at center 180px, ' + this.lastColour + ' 0%, ' + this.backgroundColour + ' 620px)' );
                $( '#backgroundD' ).css('backgroundImage','-o-radial-gradient(center 180px, farthest-corner, ' + this.lastColour + ' 0%, ' + this.backgroundColour + ' 620px)' );
                $( '#backgroundD' ).css('backgroundImage','-webkit-radial-gradient(center 180px, farthest-corner, ' + this.lastColour + ' 0%, '+this.backgroundColour + ' 620px)' );
                $( '#backgroundD' ).css('backgroundImage','-webkit-gradient(radial, 180px 180px, 0, 180px 0%, 813, color-stop(0%, '+ this.lastColour + '), color-stop(620px, ' + this.backgroundColour + '))' );
                */

            }

            this.bgUpdateCounter++;

        }
        /*
         */
        private completeBackgroundTween() : void{

            this.bgUpdateCounter    = 0;
            var v                   = this.colourTween['color0'];
            this.lastColour         = kurst.utils.NumberUtils.rgbToHex( v );

            this.getId('backgroundD').style.backgroundImage = 'radial-gradient(farthest-corner at center 180px, ' + this.lastColour + ' 0%, ' + this.backgroundColour + ' 620px)';
            this.getId('backgroundD').style.backgroundImage = '-o-radial-gradient(center 180px, farthest-corner, ' + this.lastColour + ' 0%, ' + this.backgroundColour + ' 620px)'
            this.getId('backgroundD').style.backgroundImage = '-webkit-radial-gradient(center 180px, farthest-corner, ' + this.lastColour + ' 0%, '+this.backgroundColour + ' 620px)'
            this.getId('backgroundD').style.backgroundImage = '-webkit-gradient(radial, 180px 180px, 0, 180px 0%, 813, color-stop(0%, '+ this.lastColour + '), color-stop(620px, ' + this.backgroundColour + '))' ;//

            /*
            $( '#backgroundD' ).css('backgroundImage','radial-gradient(farthest-corner at center 180px, ' + this.lastColour + ' 0%, ' + this.backgroundColour + ' 620px)' );
            $( '#backgroundD' ).css('backgroundImage','-o-radial-gradient(center 180px, farthest-corner, ' + this.lastColour + ' 0%, ' + this.backgroundColour + ' 620px)' );
            $( '#backgroundD' ).css('backgroundImage','-webkit-radial-gradient(center 180px, farthest-corner, ' + this.lastColour + ' 0%, '+this.backgroundColour + ' 620px)' );
            $( '#backgroundD' ).css('backgroundImage','-webkit-gradient(radial, 180px 180px, 0, 180px 0%, 813, color-stop(0%, '+ this.lastColour + '), color-stop(620px, ' + this.backgroundColour + '))' );
            */
        }
    }
}

