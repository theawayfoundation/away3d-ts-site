///<reference path="../libs/stagegl-extensions.next.d.ts" />
/*
SkyBox example in Away3d
Demonstrates:
How to use a CubeTexture to create a SkyBox object.
How to apply a CubeTexture to a material as an environment map.
Code by Rob Bateman
rob@infiniteturtles.co.uk
http://www.infiniteturtles.co.uk
This code is distributed under the MIT License
Copyright (c) The Away Foundation http://www.theawayfoundation.org
Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the “Software”), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:
The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.
THE SOFTWARE IS PROVIDED “AS IS”, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
*/
var examples;
(function (examples) {
    var View = away.containers.View;

    var Skybox = away.entities.Skybox;
    var LoaderEvent = away.events.LoaderEvent;
    var Vector3D = away.geom.Vector3D;
    var AssetLibrary = away.library.AssetLibrary;
    var AssetLoaderContext = away.library.AssetLoaderContext;
    var EffectEnvMapMethod = away.materials.EffectEnvMapMethod;
    var SkyboxMaterial = away.materials.SkyboxMaterial;
    var TriangleMethodMaterial = away.materials.TriangleMethodMaterial;
    var URLRequest = away.net.URLRequest;
    var PrimitiveTorusPrefab = away.prefabs.PrimitiveTorusPrefab;
    var PerspectiveProjection = away.projections.PerspectiveProjection;
    var DefaultRenderer = away.render.DefaultRenderer;

    var RequestAnimationFrame = away.utils.RequestAnimationFrame;

    var Basic_SkyBox = (function () {
        /**
        * Constructor
        */
        function Basic_SkyBox() {
            this._time = 0;
            this.init();
        }
        /**
        * Global initialise function
        */
        Basic_SkyBox.prototype.init = function () {
            this.initEngine();
            this.initMaterials();
            this.initObjects();
            this.initListeners();
        };

        /**
        * Initialise the engine
        */
        Basic_SkyBox.prototype.initEngine = function () {
            //setup the view
            this._view = new View(new DefaultRenderer());

            //setup the camera
            this._view.camera.z = -600;
            this._view.camera.y = 0;
            this._view.camera.lookAt(new Vector3D());
            this._view.camera.projection = new PerspectiveProjection(90);
            this._view.backgroundColor = 0xFFFF00;
            this._mouseX = window.innerWidth / 2;
        };

        /**
        * Initialise the materials
        */
        Basic_SkyBox.prototype.initMaterials = function () {
            //setup the torus material
            this._torusMaterial = new TriangleMethodMaterial(0xFFFFFF, 1);
            this._torusMaterial.specular = 0.5;
            this._torusMaterial.ambient = 0.25;
            this._torusMaterial.color = 0x111199;
            this._torusMaterial.ambient = 1;
        };

        /**
        * Initialise the scene objects
        */
        Basic_SkyBox.prototype.initObjects = function () {
            this._torus = new PrimitiveTorusPrefab(150, 60, 40, 20).getNewObject();
            this._torus.material = this._torusMaterial;
            this._view.scene.addChild(this._torus);
        };

        /**
        * Initialise the listeners
        */
        Basic_SkyBox.prototype.initListeners = function () {
            var _this = this;
            document.onmousemove = function (event) {
                return _this.onMouseMove(event);
            };

            window.onresize = function (event) {
                return _this.onResize(event);
            };

            this.onResize();

            this._timer = new RequestAnimationFrame(this.onEnterFrame, this);
            this._timer.start();

            AssetLibrary.addEventListener(LoaderEvent.RESOURCE_COMPLETE, function (event) {
                return _this.onResourceComplete(event);
            });

            //setup the url map for textures in the cubemap file
            var assetLoaderContext = new AssetLoaderContext();
            assetLoaderContext.dependencyBaseUrl = "assets/skybox/";

            //environment texture
            AssetLibrary.load(new URLRequest("assets/skybox/snow_texture.cube"), assetLoaderContext);
        };

        /**
        * Navigation and render loop
        */
        Basic_SkyBox.prototype.onEnterFrame = function (dt) {
            this._torus.rotationX += 2;
            this._torus.rotationY += 1;

            this._view.camera.transform.position = new away.geom.Vector3D();
            this._view.camera.rotationY += 0.5 * (this._mouseX - window.innerWidth / 2) / 800;
            this._view.camera.transform.moveBackward(600);
            this._view.render();
        };

        /**
        * Listener function for resource complete event on asset library
        */
        Basic_SkyBox.prototype.onResourceComplete = function (event) {
            switch (event.url) {
                case 'assets/skybox/snow_texture.cube':
                    this._cubeTexture = event.assets[0];

                    this._skyBox = new Skybox(new SkyboxMaterial(this._cubeTexture));
                    this._view.scene.addChild(this._skyBox);

                    this._torusMaterial.addEffectMethod(new EffectEnvMapMethod(this._cubeTexture, 1));

                    break;
            }
        };

        /**
        * Mouse move listener for navigation
        */
        Basic_SkyBox.prototype.onMouseMove = function (event) {
            this._mouseX = event.clientX;
            this._mouseY = event.clientY;
        };

        /**
        * window listener for resize events
        */
        Basic_SkyBox.prototype.onResize = function (event) {
            if (typeof event === "undefined") { event = null; }
            this._view.y = 0;
            this._view.x = 0;
            this._view.width = window.innerWidth;
            this._view.height = window.innerHeight;
        };
        return Basic_SkyBox;
    })();
    examples.Basic_SkyBox = Basic_SkyBox;
})(examples || (examples = {}));

window.onload = function () {
    new examples.Basic_SkyBox();
};
//# sourceMappingURL=Basic_Skybox.js.map
