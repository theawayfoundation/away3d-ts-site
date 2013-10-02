module kurst.utils {

    export class JSonLoader{

        //--------------------------------------------------------------------------

        private loader              : XMLHttpRequest;
        private loadedCallback      : Function;
        private loadErrorCallback   : Function;
        private target              : Object;
        private jsonData            : Object;
        private jsonString          : string;

        //--------------------------------------------------------------------------

        constructor( ) {

            this.loader                 = new XMLHttpRequest();

        }

        //--------------------------------------------------------------------------

        /*
         * Load a JSON data file
         */
        public loadJson( uri : string ) : void {

            if ( ! this.loader ) {

                this.loader = new XMLHttpRequest();

            }

            var controller : JSonLoader = this;

            this.loader.open( 'GET' , uri , true );
            this.loader.onload  = function ( event ) { controller.onLoadComplete( event ); }
            this.loader.onerror = function ( event ) { controller.onLoadError( event ); }
            this.loader.responseType = 'text';
            this.loader.send();

        }
        /*
         * Get JSON data
         */
        public getData() : Object {

            return this.jsonData;

        }
        /*
         * Get RAW JSON string
         */
        public getJSONString() : string {

            return this.jsonString;

        }
        /*
         * Set Callback
         */
        public setLoadCallback( target : Object , loadedCallback : Function , loadErrorCallback ? : Function ) : void {

            this.target                 = target;
            this.loadedCallback         = loadedCallback;
            this.loadErrorCallback      = loadErrorCallback;

        }

        //--------------------------------------------------------------------------

        /*
         * Data load completed
         */
        private onLoadComplete( event ) {

            var xhr : XMLHttpRequest    = event['currentTarget'];
            this.jsonData               = JSON.parse( xhr.responseText );
            this.jsonString             = xhr.responseText;

            if ( this.loadedCallback ){

                this.loadedCallback.apply( this.target );

            }

        }
        /*
         * Data load error
         */
        private onLoadError( event ) {

            var xhr : XMLHttpRequest = event['currentTarget'];
                xhr.abort();

            if ( this.loadErrorCallback ){

                this.loadErrorCallback.apply( this.target );

            }

        }

    }

}

