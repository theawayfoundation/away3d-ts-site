/// <reference path="../../libs/Away3D.next.d.ts" />
/// <reference path="../../libs/maps/jquery.d.ts" />

module KurstWebsite {

    export class AGLSLDemo
    {


        constructor()
        {

            $("#compile").click( () => this.clickBtn());

        }


        private clickBtn( )
        {

            console.log('clickButton');

            var vssource:string = $("#txt_in").val();
            var agalMiniAssembler: aglsl.assembler.AGALMiniAssembler = new aglsl.assembler.AGALMiniAssembler( );

            agalMiniAssembler.assemble( vssource ) ;;


            var data:away.utils.ByteArray = agalMiniAssembler.r['fragment'].data;
            var tokenizer:aglsl.AGALTokenizer = new aglsl.AGALTokenizer();
            var description:aglsl.Description = tokenizer.decribeAGALByteArray( data );
            var parser:aglsl.AGLSLParser = new aglsl.AGLSLParser();
            var frag : string = parser.parse( description );

            var datavertex:away.utils.ByteArray = agalMiniAssembler.r['vertex'].data;
            var descriptionvertex:aglsl.Description = tokenizer.decribeAGALByteArray( datavertex );
            var vert : string = parser.parse( descriptionvertex );


            $("#txt_out").val(  frag + '\n' + '----------------------------------------------' + '\n' +  vert );

        }


    }

}