/// <reference path="JSonLoader.ts" />

module kurst.utils {

    export class GSpreadSheetLoader{

        //--------------------------------------------------------------------------

        private jsLoader                : kurst.utils.JSonLoader;
        private loadedCallback          : Function;
        private loadErrorCallback       : Function;
        private jsonData                : Object;
        private target                  : Object;
        private gSheetHead              : Object[];
        private gSheetData              : Object[];

        //--------------------------------------------------------------------------

        constructor() {

            this.jsLoader = new kurst.utils.JSonLoader( );
            this.jsLoader.setLoadCallback( this , this.jsonLoaded , this.jsonLoadError );

        }

        //--------------------------------------------------------------------------

        /*
         * Load a Public Google Docs Spreadsheet
         */
        public loadSpreadSheet( id : string ) : void {

            this.jsLoader.loadJson( 'https://spreadsheets.google.com/feeds/list/'+ id +'/od6/public/values?alt=json' );

        }
        /*
         * Set callback for loaded / error messages
         */
        public setLoadCallback( target : Object , loadedCallback : Function , loadErrorCallback ? : Function ) : void {

            this.target                 = target;
            this.loadedCallback         = loadedCallback;
            this.loadErrorCallback      = loadErrorCallback;

        }
        /*
         * get parsed Google Spreadsheet data
         */
        public getData() : Object[] {

            return this.gSheetData;

        }
        /*
         * get parsed Header for Google Spreadsheet
         */
        public getHead() : Object[] {

            return this.gSheetHead;

        }
        /*
         * get Raw JSON
         */
        public getJSONString() : string {

            return this.jsLoader.getJSONString();

        }

        //--------------------------------------------------------------------------

        /*
         * Parse the google docs Spreadsheet JSON
         */
        private parseData ( data : Object ) : void {

            //--------------------------------------------------------------

            this.gSheetHead = [];
            this.gSheetData = [];

            //--------------------------------------------------------------

            var jsonRowData : Array	= data['feed']['entry'];  /* Array */
            var firstObj    = jsonRowData[0];   /* Object */
            var dataPrefix  = 'gsx$';           /* string */
            var rowData;
            var colName;
            var row;

            // TABLE HEAD --------------------------------------------------

            for ( var rowDataKey in firstObj ){

                if ( rowDataKey.indexOf( dataPrefix ) != -1 ) {

                    this.gSheetHead.push( rowDataKey.slice( dataPrefix.length , rowDataKey.length ) );

                }

            }

            // TABLE DATA --------------------------------------------------

            for ( var c = 0 ; c < jsonRowData.length ; c++ ) {

                rowData 	= jsonRowData[c];
                row 		= new Object();
/**/
                for ( var d = 0 ; d < this.gSheetHead.length ; d++ ){

                    colName 		= this.gSheetHead[ d ];
                    row[ colName ] 	=  rowData[ dataPrefix + colName ].$t;

                }

                this.gSheetData.push( row );

            }

        }
        /*
         * JSON loaded callback
         */
        private jsonLoaded() : void {

            this.jsonData = this.jsLoader.getData();

            this.parseData( this.jsonData );

            if ( this.loadedCallback ){

                this.loadedCallback.apply( this.target );

            }

        }
        /*
         * JSON load error callback
         */
        private jsonLoadError() : void {

            if ( this.loadErrorCallback ){

                this.loadErrorCallback.apply( this.target );

            }
        }
    }
}



