var kurst;
(function (kurst) {
    (function (utils) {
        var JSonLoader = (function () {
            //--------------------------------------------------------------------------
            function JSonLoader() {
                this.loader = new XMLHttpRequest();
            }
            //--------------------------------------------------------------------------
            /*
            * Load a JSON data file
            */
            JSonLoader.prototype.loadJson = function (uri) {
                if (!this.loader) {
                    this.loader = new XMLHttpRequest();
                }

                var controller = this;

                this.loader.open('GET', uri, true);
                this.loader.onload = function (event) {
                    controller.onLoadComplete(event);
                };
                this.loader.onerror = function (event) {
                    controller.onLoadError(event);
                };
                this.loader.responseType = 'text';
                this.loader.send();
            };

            /*
            * Get JSON data
            */
            JSonLoader.prototype.getData = function () {
                return this.jsonData;
            };

            /*
            * Get RAW JSON string
            */
            JSonLoader.prototype.getJSONString = function () {
                return this.jsonString;
            };

            /*
            * Set Callback
            */
            JSonLoader.prototype.setLoadCallback = function (target, loadedCallback, loadErrorCallback) {
                this.target = target;
                this.loadedCallback = loadedCallback;
                this.loadErrorCallback = loadErrorCallback;
            };

            //--------------------------------------------------------------------------
            /*
            * Data load completed
            */
            JSonLoader.prototype.onLoadComplete = function (event) {
                var xhr = event['currentTarget'];
                this.jsonData = JSON.parse(xhr.responseText);
                this.jsonString = xhr.responseText;

                if (this.loadedCallback) {
                    this.loadedCallback.apply(this.target);
                }
            };

            /*
            * Data load error
            */
            JSonLoader.prototype.onLoadError = function (event) {
                var xhr = event['currentTarget'];
                xhr.abort();

                if (this.loadErrorCallback) {
                    this.loadErrorCallback.apply(this.target);
                }
            };
            return JSonLoader;
        })();
        utils.JSonLoader = JSonLoader;
    })(kurst.utils || (kurst.utils = {}));
    var utils = kurst.utils;
})(kurst || (kurst = {}));
var kurst;
(function (kurst) {
    /// <reference path="JSonLoader.ts" />
    (function (utils) {
        var GSpreadSheetLoader = (function () {
            //--------------------------------------------------------------------------
            function GSpreadSheetLoader() {
                this.jsLoader = new kurst.utils.JSonLoader();
                this.jsLoader.setLoadCallback(this, this.jsonLoaded, this.jsonLoadError);
            }
            //--------------------------------------------------------------------------
            /*
            * Load a Public Google Docs Spreadsheet
            */
            GSpreadSheetLoader.prototype.loadSpreadSheet = function (id) {
                this.jsLoader.loadJson('https://spreadsheets.google.com/feeds/list/' + id + '/od6/public/values?alt=json');
            };

            /*
            * Set callback for loaded / error messages
            */
            GSpreadSheetLoader.prototype.setLoadCallback = function (target, loadedCallback, loadErrorCallback) {
                this.target = target;
                this.loadedCallback = loadedCallback;
                this.loadErrorCallback = loadErrorCallback;
            };

            /*
            * get parsed Google Spreadsheet data
            */
            GSpreadSheetLoader.prototype.getData = function () {
                return this.gSheetData;
            };

            /*
            * get parsed Header for Google Spreadsheet
            */
            GSpreadSheetLoader.prototype.getHead = function () {
                return this.gSheetHead;
            };

            /*
            * get Raw JSON
            */
            GSpreadSheetLoader.prototype.getJSONString = function () {
                return this.jsLoader.getJSONString();
            };

            //--------------------------------------------------------------------------
            /*
            * Parse the google docs Spreadsheet JSON
            */
            GSpreadSheetLoader.prototype.parseData = function (data) {
                //--------------------------------------------------------------
                this.gSheetHead = [];
                this.gSheetData = [];

                //--------------------------------------------------------------
                var jsonRowData = data['feed']['entry'];
                var firstObj = jsonRowData[0];
                var dataPrefix = 'gsx$';
                var rowData;
                var colName;
                var row;

                for (var rowDataKey in firstObj) {
                    if (rowDataKey.indexOf(dataPrefix) != -1) {
                        this.gSheetHead.push(rowDataKey.slice(dataPrefix.length, rowDataKey.length));
                    }
                }

                for (var c = 0; c < jsonRowData.length; c++) {
                    rowData = jsonRowData[c];
                    row = new Object();

                    for (var d = 0; d < this.gSheetHead.length; d++) {
                        colName = this.gSheetHead[d];
                        row[colName] = rowData[dataPrefix + colName].$t;
                    }

                    this.gSheetData.push(row);
                }
            };

            /*
            * JSON loaded callback
            */
            GSpreadSheetLoader.prototype.jsonLoaded = function () {
                this.jsonData = this.jsLoader.getData();

                this.parseData(this.jsonData);

                if (this.loadedCallback) {
                    this.loadedCallback.apply(this.target);
                }
            };

            /*
            * JSON load error callback
            */
            GSpreadSheetLoader.prototype.jsonLoadError = function () {
                if (this.loadErrorCallback) {
                    this.loadErrorCallback.apply(this.target);
                }
            };
            return GSpreadSheetLoader;
        })();
        utils.GSpreadSheetLoader = GSpreadSheetLoader;
    })(kurst.utils || (kurst.utils = {}));
    var utils = kurst.utils;
})(kurst || (kurst = {}));
var kurst;
(function (kurst) {
    /// <reference path="../../libs/maps/jquery.d.ts" />
    /// <reference path="../../libs/maps/ax.d.ts" />
    /*
    * Author: Karim Beyrouti ( karim@kurst.co.uk )
    */
    (function (utils) {
        var JSUtils = (function () {
            function JSUtils() {
            }
            JSUtils.isAndroid = //--------------------------------------------------------------------------
            // Mobile
            function () {
                return navigator.userAgent.match(/Android/i) ? true : false;
            };

            JSUtils.isBlackBerry = function () {
                return navigator.userAgent.match(/BlackBerry/i) ? true : false;
            };

            JSUtils.isIOS = function () {
                return navigator.userAgent.match(/iPhone|iPad|iPod/i) ? true : false;
            };

            JSUtils.isWindowsMob = function () {
                return navigator.userAgent.match(/IEMobile/i) ? true : false;
            };
            JSUtils.isMobile = function () {
                return (JSUtils.isAndroid() || JSUtils.isBlackBerry() || JSUtils.isIOS() || JSUtils.isWindowsMob());
            };

            JSUtils.getId = //--------------------------------------------------------------------------
            // Selection
            /*
            */
            function (id) {
                return document.getElementById(id);
            };

            JSUtils.getClass = /*
            */
            function (className) {
                return document.getElementsByClassName(className);
            };

            JSUtils.getElementsByClassNme = /*
            */
            function (theClass) {
                var classElms = new Array();
                var node = document;

                var i = 0;

                if (node.getElementsByClassName) {
                    var tempEls = node.getElementsByClassName(theClass);

                    for (i = 0; i < tempEls.length; i++) {
                        classElms.push(tempEls[i]);
                    }
                } else {
                    var getclass = new RegExp('\\b' + theClass + '\\b');
                    var elems = node.getElementsByTagName('*');

                    for (i = 0; i < elems.length; i++) {
                        var classes = elems[i]['className'];

                        if (getclass.test(classes)) {
                            classElms.push(elems[i]);
                        }
                    }
                }

                return classElms;
            };

            JSUtils.getQueryParams = /*
            */
            function (qs) {
                qs = qs.split("+").join(" ");

                var params = {}, tokens, re = /[?&]?([^=]+)=([^&]*)/g;

                while (tokens = re.exec(qs)) {
                    params[decodeURIComponent(tokens[1])] = decodeURIComponent(tokens[2]);
                }

                return params;
            };

            JSUtils.isFireFox = //--------------------------------------------------------------------------
            // Desktop
            /*
            */
            function () {
                return (navigator.userAgent.search("Firefox") != -1);
            };

            JSUtils.isIE = /*
            */
            function () {
                return (navigator.appVersion.indexOf("MSIE") != -1);
            };

            JSUtils.getIEVersion = /*
            */
            function () {
                if (JSUtils.isIE()) {
                    return parseFloat(navigator.appVersion.split("MSIE")[1]);
                }

                return -1;
            };

            JSUtils.isFlashEnabled = /*
            */
            function () {
                if (JSUtils.isIE()) {
                    var version = JSUtils.getIEVersion();

                    if (version > 8) {
                        return (window['ActiveXObject'] && (new ActiveXObject("ShockwaveFlash.ShockwaveFlash")) != false);
                    } else {
                        try  {
                            var aXObj = new ActiveXObject('ShockwaveFlash.ShockwaveFlash');

                            if (aXObj) {
                                return true;
                            }

                            return false;
                        } catch (ex) {
                            return false;
                        }
                    }

                    return false;
                } else {
                    return ((typeof navigator.plugins != "undefined" && typeof navigator.plugins["Shockwave Flash"] == "object") != false);
                }
            };
            return JSUtils;
        })();
        utils.JSUtils = JSUtils;
    })(kurst.utils || (kurst.utils = {}));
    var utils = kurst.utils;
})(kurst || (kurst = {}));
var kurst;
(function (kurst) {
    /// <reference path="../../libs/maps/jquery.d.ts" />
    (function (utils) {
        var NumberUtils = (function () {
            function NumberUtils() {
            }
            NumberUtils.rgbToHex = //--------------------------------------------------------------------------
            /*
            */
            function (rgb) {
                var rgbRegex = /^rgb\(\s*(-?\d+)(%?)\s*,\s*(-?\d+)(%?)\s*,\s*(-?\d+)(%?)\s*\)$/;
                var result, r, g, b, hex = "";

                if ((result = rgbRegex['exec'](rgb))) {
                    r = kurst.utils.NumberUtils.componentFromStr(result[1], result[2]);
                    g = kurst.utils.NumberUtils.componentFromStr(result[3], result[4]);
                    b = kurst.utils.NumberUtils.componentFromStr(result[5], result[6]);

                    hex = "#" + (0x1000000 + (r << 16) + (g << 8) + b).toString(16).slice(1);
                }
                return hex;
            };

            NumberUtils.componentFromStr = /*
            */
            function (numStr, percent) {
                var num = Math.max(0, parseInt(numStr, 10));
                return percent ? Math.floor(255 * Math.min(100, num) / 100) : Math.min(255, num);
            };
            return NumberUtils;
        })();
        utils.NumberUtils = NumberUtils;
    })(kurst.utils || (kurst.utils = {}));
    var utils = kurst.utils;
})(kurst || (kurst = {}));
var kurst;
(function (kurst) {
    // https://github.com/mrdoob/eventdispatcher.js/
    (function (event) {
        var credits = (function () {
            function credits() {
                this.creds = 'mr.doob / https://github.com/mrdoob/eventdispatcher.js/';
            }
            return credits;
        })();

        var EventDispatcher = (function () {
            function EventDispatcher() {
                //--------------------------------------------------------------------------
                this.listeners = new Array();
            }
            //--------------------------------------------------------------------------
            /*
            */
            EventDispatcher.prototype.addEventListener = function (type, listener) {
                if (this.listeners[type] === undefined) {
                    this.listeners[type] = new Array();
                }

                if (this.listeners[type].indexOf(listener) === -1) {
                    this.listeners[type].push(listener);
                }
            };

            /*
            */
            EventDispatcher.prototype.removeEventListener = function (type, listener) {
                var index = this.listeners[type].indexOf(listener);

                if (index !== -1) {
                    this.listeners[type].splice(index, 1);
                }
            };

            /*
            */
            EventDispatcher.prototype.dispatchEvent = function (event) {
                var listenerArray = this.listeners[event.type];

                if (listenerArray !== undefined) {
                    this.lFncLength = listenerArray.length;
                    event.target = this;

                    for (var i = 0, l = this.lFncLength; i < l; i++) {
                        listenerArray[i].call(this, event);
                    }
                }
            };
            return EventDispatcher;
        })();
        event.EventDispatcher = EventDispatcher;

        //--------------------------------------------------------------------------
        var Event = (function () {
            function Event(type) {
                this.type = type;
            }
            return Event;
        })();
        event.Event = Event;
    })(kurst.event || (kurst.event = {}));
    var event = kurst.event;
})(kurst || (kurst = {}));
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var kurst;
(function (kurst) {
    ///<reference path="../events/EventDispatcher.ts"/>
    (function (core) {
        var UIBase = (function (_super) {
            __extends(UIBase, _super);
            //--------------------------------------------------------------------------
            //--------------------------------------------------------------------------
            function UIBase() {
                _super.call(this);
            }
            //--------------------------------------------------------------------------
            /*
            */
            UIBase.prototype.getId = function (id) {
                return document.getElementById(id);
            };

            /*
            */
            UIBase.prototype.getClass = function (className) {
                return document.getElementsByClassName(className);
            };

            /*
            */
            UIBase.prototype.getElementsByClassNme = function (theClass) {
                var classElms = new Array();
                var node = document;

                var i = 0;

                if (node.getElementsByClassName) {
                    var tempEls = node.getElementsByClassName(theClass);

                    for (i = 0; i < tempEls.length; i++) {
                        classElms.push(tempEls[i]);
                    }
                } else {
                    var getclass = new RegExp('\\b' + theClass + '\\b');
                    var elems = node.getElementsByTagName('*');

                    for (i = 0; i < elems.length; i++) {
                        var classes = elems[i]['className'];

                        if (getclass.test(classes)) {
                            classElms.push(elems[i]);
                        }
                    }
                }

                return classElms;
            };
            return UIBase;
        })(kurst.event.EventDispatcher);
        core.UIBase = UIBase;
    })(kurst.core || (kurst.core = {}));
    var core = kurst.core;
})(kurst || (kurst = {}));
/// <reference path="../../libs/maps/tweenlite.d.ts" />
/// <reference path="../../libs/maps/jquery.d.ts" />
/// <reference path="../utils/NumberUtils.ts" />
/// <reference path="../core/UIBase.ts" />
var KurstWebsite;
(function (KurstWebsite) {
    var BackgroundGrad = (function (_super) {
        __extends(BackgroundGrad, _super);
        //--------------------------------------------------------------------------
        function BackgroundGrad() {
            _super.call(this);
            this.lastColour = '#30353b';
            this.bgUpdateCounter = 0;
            this.backgroundColour = '#30353b';

            //this.$ = $;
            this.colourTween = new Object();
        }
        //--------------------------------------------------------------------------
        /*
        */
        BackgroundGrad.prototype.setColour = function (colour) {
            this.animateBackground(colour);
        };

        /*
        */
        BackgroundGrad.prototype.resetBackground = function () {
            this.animateBackgroundToColour(this.backgroundColour);
        };

        //--------------------------------------------------------------------------
        /*
        */
        BackgroundGrad.prototype.animateBackground = function (colour) {
            this.animateBackgroundToColour(colour);
        };

        /*
        */
        BackgroundGrad.prototype.animateBackgroundToColour = function (colour) {
            if (this.lastColour != null) {
                this.colourTween['color0'] = this.lastColour;
            }

            TweenLite.killTweensOf(this.colourTween);

            var controller = this;
            TweenLite.to(this.colourTween, 6, { colorProps: { color0: colour }, onUpdate: function () {
                    controller.updateBackgroundTween();
                }, onComplete: function () {
                    controller.completeBackgroundTween();
                } });

            this.bgUpdateCounter = 0;
        };

        /*
        */
        BackgroundGrad.prototype.updateBackgroundTween = function () {
            if (this.bgUpdateCounter % 10 == 0) {
                this.bgUpdateCounter = 0;
                var v = this.colourTween['color0'];
                this.lastColour = kurst.utils.NumberUtils.rgbToHex(v);

                this.getId('backgroundD').style.backgroundImage = 'radial-gradient(farthest-corner at center 180px, ' + this.lastColour + ' 0%, ' + this.backgroundColour + ' 620px)';
                this.getId('backgroundD').style.backgroundImage = '-o-radial-gradient(center 180px, farthest-corner, ' + this.lastColour + ' 0%, ' + this.backgroundColour + ' 620px)';
                this.getId('backgroundD').style.backgroundImage = '-webkit-radial-gradient(center 180px, farthest-corner, ' + this.lastColour + ' 0%, ' + this.backgroundColour + ' 620px)';
                this.getId('backgroundD').style.backgroundImage = '-webkit-gradient(radial, 180px 180px, 0, 180px 0%, 813, color-stop(0%, ' + this.lastColour + '), color-stop(620px, ' + this.backgroundColour + '))';
                /*
                $( '#backgroundD' ).css('backgroundImage','radial-gradient(farthest-corner at center 180px, ' + this.lastColour + ' 0%, ' + this.backgroundColour + ' 620px)' );
                $( '#backgroundD' ).css('backgroundImage','-o-radial-gradient(center 180px, farthest-corner, ' + this.lastColour + ' 0%, ' + this.backgroundColour + ' 620px)' );
                $( '#backgroundD' ).css('backgroundImage','-webkit-radial-gradient(center 180px, farthest-corner, ' + this.lastColour + ' 0%, '+this.backgroundColour + ' 620px)' );
                $( '#backgroundD' ).css('backgroundImage','-webkit-gradient(radial, 180px 180px, 0, 180px 0%, 813, color-stop(0%, '+ this.lastColour + '), color-stop(620px, ' + this.backgroundColour + '))' );
                */
            }

            this.bgUpdateCounter++;
        };

        /*
        */
        BackgroundGrad.prototype.completeBackgroundTween = function () {
            this.bgUpdateCounter = 0;
            var v = this.colourTween['color0'];
            this.lastColour = kurst.utils.NumberUtils.rgbToHex(v);

            this.getId('backgroundD').style.backgroundImage = 'radial-gradient(farthest-corner at center 180px, ' + this.lastColour + ' 0%, ' + this.backgroundColour + ' 620px)';
            this.getId('backgroundD').style.backgroundImage = '-o-radial-gradient(center 180px, farthest-corner, ' + this.lastColour + ' 0%, ' + this.backgroundColour + ' 620px)';
            this.getId('backgroundD').style.backgroundImage = '-webkit-radial-gradient(center 180px, farthest-corner, ' + this.lastColour + ' 0%, ' + this.backgroundColour + ' 620px)';
            this.getId('backgroundD').style.backgroundImage = '-webkit-gradient(radial, 180px 180px, 0, 180px 0%, 813, color-stop(0%, ' + this.lastColour + '), color-stop(620px, ' + this.backgroundColour + '))';
            /*
            $( '#backgroundD' ).css('backgroundImage','radial-gradient(farthest-corner at center 180px, ' + this.lastColour + ' 0%, ' + this.backgroundColour + ' 620px)' );
            $( '#backgroundD' ).css('backgroundImage','-o-radial-gradient(center 180px, farthest-corner, ' + this.lastColour + ' 0%, ' + this.backgroundColour + ' 620px)' );
            $( '#backgroundD' ).css('backgroundImage','-webkit-radial-gradient(center 180px, farthest-corner, ' + this.lastColour + ' 0%, '+this.backgroundColour + ' 620px)' );
            $( '#backgroundD' ).css('backgroundImage','-webkit-gradient(radial, 180px 180px, 0, 180px 0%, 813, color-stop(0%, '+ this.lastColour + '), color-stop(620px, ' + this.backgroundColour + '))' );
            */
        };
        return BackgroundGrad;
    })(kurst.core.UIBase);
    KurstWebsite.BackgroundGrad = BackgroundGrad;
})(KurstWebsite || (KurstWebsite = {}));
/// <reference path="../../libs/maps/jquery.d.ts" />
/// <reference path="../../libs/maps/swfobject.d.ts" />
/// <reference path="../utils/JSUtils.ts" />
var KurstWebsite;
(function (KurstWebsite) {
    var VideoPlayer = (function () {
        //--------------------------------------------------------------------------
        function VideoPlayer($, htmlDivContainer, flashVideoURI, htmlVideoURI) {
            //--------------------------------------------------------------------------
            this.flashVideoURI = '';
            this.htmlVideoURI = '';
            this.htmlVideoFrameObj = new Object();
            this.contentHeightVideo = '750px';
            this.contentHeightNoVideo = '540px';
            this.currentSectionID = -1;
            this.divIIDCounter = 0;
            this.clientLogoPath = 'media/images/';
            this.flashPlayerID = 'kurstVideoPlayer';
            this.sendJSONFncName = 'sendJSONToPlayer';
            this.flashVideoURI = flashVideoURI;
            this.htmlVideoURI = htmlVideoURI;
            this.flashXQueue = [];
            this.container = htmlDivContainer;
            this.$ = $;

            this.init();
        }
        //--------------------------------------------------------------------------
        /*
        * Receive events from the Flash Video Player
        */
        VideoPlayer.prototype.receiveFlashVideoEvent = function (event) {
            switch (event.type) {
                case 'complete':
                    this.videoEnded();

                    break;

                case 'mouseLeave':
                    break;

                case 'frame':
                    this.videoFrame(event);

                    break;

                case 'pause':
                    break;

                case 'play':
                    this.videoStarted();

                    break;

                case 'bufferLoaded':
                    break;
            }
        };

        /*
        * Set data ( from google docs spread sheet )
        */
        VideoPlayer.prototype.setData = function (vd) {
            this.videoData = vd;
        };

        /*
        * Set event callbacks for the video object
        */
        VideoPlayer.prototype.setCallback = function (obj, fnc) {
            this.callbackObj = obj;
            this.callbackFnc = fnc;
        };

        /*
        * Send JSON Data to flash ( to reduce the number of calls to Google Docs )
        * flash will time out after 5 seconds and try and loads it if this fails
        */
        VideoPlayer.prototype.sendJsonDataToFlash = function (obj) {
            var fObject = this.getFlashMovie();

            if (fObject) {
                if (fObject.hasOwnProperty(this.sendJSONFncName)) {
                    fObject[this.sendJSONFncName](obj);
                } else {
                    clearInterval(this.flashXQueueTimeoutID);

                    this.flashXQueue.push(obj);

                    var controller = this;
                    this.flashXQueueTimeoutID = setInterval(function () {
                        controller.processXQeue();
                    }, 100);
                }
            }
        };

        //--------------------------------------------------------------------------
        /*
        * Initialise the video player
        */
        VideoPlayer.prototype.init = function () {
            this.flashEnabled = kurst.utils.JSUtils.isFlashEnabled();
            this.callbackData = new Object();

            if (this.flashEnabled) {
                this.initFlashVideoPlayer();
            } else {
                this.initHTMLVideoPlayer();
            }

            $('#clientList').css('visibility', 'visible');
            $('#servicesList').css('visibility', 'visible');
            $('#servicesDesc').css('visibility', 'visible');
            $('#' + this.container.id).css('height', this.contentHeightNoVideo);
        };

        /*
        * Show section info depending which part of the video is player ( clients / services / info )
        */
        VideoPlayer.prototype.showSection = function (sectionData) {
            if (Number(sectionData.id) != this.currentSectionID) {
                this.showClientList(sectionData);
                this.showServicesList(sectionData);
                this.showServicesInfo(sectionData);
                this.sendCallback(KurstWebsite.VideoPlayer.NEW_SECTION, sectionData);
            }
        };

        /*
        * Send a callback message ( defined in setCallback )
        */
        VideoPlayer.prototype.sendCallback = function (type, obj) {
            if (this.callbackFnc) {
                this.callbackData['type'] = type;

                if (obj) {
                    this.callbackData['data'] = obj;
                }

                this.callbackFnc.apply(this.callbackObj, [this.callbackData]);
            }
        };

        //--FLASH-VIDEO-----------------------------------------------------------------------
        /*
        * Initialise the Flash Video
        */
        VideoPlayer.prototype.initFlashVideoPlayer = function () {
            var flashvars = {
                debug: 'false',
                video_uri: this.flashVideoURI,
                proxy_uri: 'k2013code/php/dataProxy.php',
                js_callback: 'htmlVideoEvent'
            };

            var params = {
                wmode: 'direct',
                scale: 'noscale',
                menu: 'false',
                allowscriptaccess: 'always',
                allowFullScreen: 'true',
                bgcolor: "30353b"
            };

            var attributes = {
                id: 'kurstVideoPlayer',
                name: 'kurstVideoPlayer'
            };

            swfobject.embedSWF('media/swf/KurstVideoPlayer.swf', 'videoPlayer', '960', '540', '11.0.0', '', flashvars, params, attributes, null);
        };

        /*
        * Process Queued data to send to the Flash object ( namely GS data / JSON )
        */
        VideoPlayer.prototype.processXQeue = function () {
            if (this.flashXQueue.length == 0) {
                clearInterval(this.flashXQueueTimeoutID);
            }

            var fObject = this.getFlashMovie();

            if (fObject) {
                if (fObject.hasOwnProperty(this.sendJSONFncName)) {
                    clearInterval(this.flashXQueueTimeoutID);

                    for (var c = 0; c < this.flashXQueue.length; c++) {
                        fObject['sendToPlayer'](this.flashXQueue.pop());
                    }
                }
            }
        };

        /*
        * Get a reference to the flash swf object
        */
        VideoPlayer.prototype.getFlashMovie = function () {
            if (kurst.utils.JSUtils.isIE()) {
                return window[this.flashPlayerID];
            } else {
                return document[this.flashPlayerID];
            }
        };

        //--HTML-VIDEO-----------------------------------------------------------------------
        /*
        * Initialise the HTML Video
        */
        VideoPlayer.prototype.initHTMLVideoPlayer = function () {
            var videoHTML = '<video controls width="960" height="540" id="htmlVideo">';
            videoHTML += '     <source src="' + this.htmlVideoURI + '" type="video/mp4" />';
            videoHTML += '</video>';

            $('#videoPlayer').css('visibility', 'visible');
            $('#videoPlayer').append(videoHTML);

            this.htmlVideoObject = $("#htmlVideo").get(0);

            var controller = this;

            this.htmlVideoObject.addEventListener("playing", function (event) {
                controller.htmlVideoEvent(event);
            }, false);
            this.htmlVideoObject.addEventListener("play", function (event) {
                controller.htmlVideoEvent(event);
            }, false);
            this.htmlVideoObject.addEventListener("pause", function (event) {
                controller.htmlVideoEvent(event);
            }, false);
            this.htmlVideoObject.addEventListener("ended", function (event) {
                controller.htmlVideoEvent(event);
            }, false);
            this.htmlVideoObject.addEventListener("timeupdate", function (event) {
                controller.htmlVideoEvent(event);
            }, false);
        };

        /*
        * HTML video frame loop
        */
        VideoPlayer.prototype.htmlVideoInterval = function () {
            this.htmlVideoFrameObj['currentFrame'] = Math.round(this.htmlVideoObject.currentTime * 25);
            this.videoFrame(this.htmlVideoFrameObj);
        };

        /*
        * HTML video event handler
        */
        VideoPlayer.prototype.htmlVideoEvent = function (event) {
            switch (event.type) {
                case 'playing':
                    break;

                case 'play':
                    this.videoStarted();

                    break;

                case 'timeupdate':
                    break;

                case 'ended':
                    this.videoEnded();

                    break;

                case 'pause':
                    break;
            }
        };

        //--VIDEO------------------------------------------------------------------------
        /*
        * Video Frame handler
        */
        VideoPlayer.prototype.videoFrame = function (frameData) {
            var currentFrame = parseInt(frameData.currentFrame);
            var gsDataLength = this.videoData.length;

            var obj;
            var startTime;
            var endTime;

            for (var c = 0; c < gsDataLength; c++) {
                obj = this.videoData[c];
                startTime = parseInt(obj.sectionstart);
                endTime = parseInt(obj.sectionend);

                if (currentFrame != 0) {
                    if (currentFrame >= startTime && currentFrame <= endTime) {
                        if (this.currentSectionID != obj['id']) {
                            this.currentSectionData = obj;
                            this.showSection(this.currentSectionData);
                            this.currentSectionID = obj['id'];
                        }
                    }
                }
            }
        };

        /*
        * Show the dynamic content area / expand the video player
        */
        VideoPlayer.prototype.showDynamicVideoContent = function (flag) {
            if (flag) {
                if (!this.flashEnabled) {
                    var controller = this;
                    this.htmlVideoIID = setInterval(function () {
                        controller.htmlVideoInterval();
                    }, 33);
                }

                $('#' + this.container.id).animate({
                    height: this.contentHeightVideo
                }, 500, 'easeOutQuad', function () {
                });
            } else {
                if (!this.flashEnabled) {
                    clearInterval(this.htmlVideoIID);
                }

                this.$('#videoContainer').animate({
                    height: this.contentHeightNoVideo
                }, 1000, 'easeOutQuad');
            }
        };

        /*
        * Video ended functions
        */
        VideoPlayer.prototype.videoEnded = function () {
            this.showDynamicVideoContent(false);
            this.sendCallback(KurstWebsite.VideoPlayer.VIDEO_COMPLETE);
        };

        /*
        * Video started functions
        */
        VideoPlayer.prototype.videoStarted = function () {
            this.showDynamicVideoContent(true);
            this.sendCallback(KurstWebsite.VideoPlayer.VIDEO_STARTED);
        };

        //-- Client List------------------------------------------------------------------
        /*
        */
        VideoPlayer.prototype.showClientList = function (sectionData) {
            if (this.clientGroupDivID != null) {
                var myID = this.clientGroupDivID;
                var controller = this;

                $('#' + this.clientGroupDivID).animate({ left: '960px' }, {
                    duration: 500,
                    easing: 'easeInOutQuad',
                    complete: function () {
                        $('#' + myID).remove();
                        controller['showNewClientList'](sectionData);
                    }
                });
            } else {
                this.showNewClientList(sectionData);
            }
        };

        /*
        */
        VideoPlayer.prototype.showNewClientList = function (sectionData) {
            var clientDivHTML;
            var clientLogoID;
            var client = '';
            var imagePath = '';
            var imageTag = '';
            var clients = sectionData.clients.split(',');
            var clientLogoPrefix = 'clientLogoID_';
            var clientGroupID = 'ClientGroup_' + (this.divIIDCounter++);
            var clientGroupHTML = "<div class='clientGroup' id='" + clientGroupID + "'></div>";

            this.clientGroupDivID = clientGroupID;

            $('#clientList').append(clientGroupHTML);
            $('#' + clientGroupID).css('left', '-960px');
            $('#' + clientGroupID).animate({ left: '0px' }, { duration: 1000, easing: 'easeOutQuad' });

            for (var c = 0; c < clients.length; c++) {
                client = clients[c];

                if (client.indexOf('.png') != -1) {
                    imagePath = this.clientLogoPath + client;
                    imageTag = "<img src='" + imagePath + "'>";

                    clientLogoID = clientLogoPrefix + (this.divIIDCounter++);
                    clientDivHTML = "<div class='clientLogoContainer' id='" + clientLogoID + "'><div class='clientLogo'>" + imageTag + "</div></div>";

                    $('#' + clientGroupID).append(clientDivHTML);
                } else {
                    clientLogoID = clientLogoPrefix + (this.divIIDCounter++);
                    clientDivHTML = "<div class='clientLogoContainer' id='" + clientLogoID + "'><div class='clientLogo'>" + client + "</div></div>";

                    $('#' + clientGroupID).append(clientDivHTML);
                }
            }
        };

        //--Services List------------------------------------------------------------------
        /*
        */
        VideoPlayer.prototype.showServicesList = function (sectionData) {
            if (this.servicesDivID != null) {
                var myID = this.servicesDivID;
                var controller = this;

                $('#' + this.servicesDivID).animate({ left: '960px' }, {
                    duration: 500,
                    easing: 'easeInOutQuad',
                    complete: function () {
                        $('#' + myID).remove();
                        controller['showNewServicesList'](sectionData);
                    }
                });
            } else {
                this.showNewServicesList(sectionData);
            }
        };

        /*
        */
        VideoPlayer.prototype.showNewServicesList = function (sectionData) {
            var servicesDivIDPrefix = 'servicesList_';
            var servicesID = servicesDivIDPrefix + (this.divIIDCounter++);
            var servicesHTML = "<div class='servicesInfo' id='" + servicesID + "'>" + sectionData.services + "</div>";

            $('#servicesList').append(servicesHTML);

            $('#' + servicesID).css('left', '-960px');
            $('#' + servicesID).delay(100).animate({ left: '0px' }, { duration: 1000, easing: 'easeOutQuad' });

            this.servicesDivID = servicesID;
        };

        //--Services Info------------------------------------------------------------------
        /*
        */
        VideoPlayer.prototype.showServicesInfo = function (sectionData) {
            if (this.servicesInfoDivID != null) {
                var myIDInfo = this.servicesInfoDivID;
                var controller = this;

                $('#' + this.servicesInfoDivID).fadeOut('slow', function () {
                    $('#' + myIDInfo).remove();
                    controller['showNewServicesInfo'](sectionData);
                });
            } else {
                this.showNewServicesInfo(sectionData);
            }
        };

        /*
        */
        VideoPlayer.prototype.showNewServicesInfo = function (sectionData) {
            var servicesDivIDPrefix = 'servicesListInfo_';
            var servicesInfoID = servicesDivIDPrefix + (this.divIIDCounter++);
            var servicesInfoHTML = "<div class='servicesDescContent' id='" + servicesInfoID + "'>" + sectionData.info + "</div>";

            $('#servicesDesc').append(servicesInfoHTML);
            $('#' + servicesInfoID).hide();
            $('#' + servicesInfoID).delay(600).fadeIn(1000);

            this.servicesInfoDivID = servicesInfoID;
        };
        VideoPlayer.NEW_SECTION = 'new_section';
        VideoPlayer.VIDEO_COMPLETE = 'videoComplete';
        VideoPlayer.VIDEO_STARTED = 'videoStarted';
        return VideoPlayer;
    })();
    KurstWebsite.VideoPlayer = VideoPlayer;
})(KurstWebsite || (KurstWebsite = {}));
/// <reference path="../../libs/maps/jquery.d.ts" />
/// <reference path="../../libs/maps/jquery.scrollTo.d.ts" />
/// <reference path="../utils/JSUtils.ts" />
var KurstWebsite;
(function (KurstWebsite) {
    var UI = (function () {
        //--------------------------------------------------------------------------
        function UI($) {
            this.expanded = false;
            this.fullScreen = false;
            this.$ = $;
            this.init();
        }
        //--------------------------------------------------------------------------
        /*
        */
        UI.prototype.init = function () {
            $('#contentArea').hide();

            //$('#contentArea').css( 'top' , '580px' );
            $('#logoContainer').css('height', '0px');

            $('#logoContainer').delay(1000).animate({
                height: '120px'
            }, 1000, 'easeOutQuad');

            $('#navigation').hide();
            $('#navigation').delay(1000).fadeIn(2000);

            this.showStaticContent(1000);
            this.initLinks();

            this.initFullScreenButton();
        };

        /*
        */
        UI.prototype.expandContent = function (flag) {
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
        };

        //--------------------------------------------------------------------------
        UI.prototype.launchFullScreen = function (element) {
            if (element['requestFullScreen']) {
                element['requestFullScreen']();
            } else if (element['mozRequestFullScreen']) {
                element['mozRequestFullScreen']();
            } else if (element['webkitRequestFullScreen']) {
                element['webkitRequestFullScreen']();
            }
        };

        UI.prototype.cancelFullscreen = function () {
            if (document['cancelFullScreen']) {
                document['cancelFullScreen']();
            } else if (document['mozCancelFullScreen']) {
                document['mozCancelFullScreen']();
            } else if (document['webkitCancelFullScreen']) {
                document['webkitCancelFullScreen']();
            }
        };

        UI.prototype.initFullScreenButton = function () {
            var controller = this;
            $('#fullScreenButton').click(function () {
                $.scrollTo('#logoContainer', 800);

                if (controller.fullScreen) {
                    if (kurst.utils.JSUtils.isMobile()) {
                        controller.cancelFullscreen();
                        $('#logoContainer').fadeIn(1000);

                        $('#fullScreenButton').attr("src", 'media/images/fullscreen_alt.png');

                        $('#videoContainer').css('top', '40px');
                        $('#videoContainer').width('100%');
                        $('#videoContainer').height('400px');
                        $('#videoContainer').css('top', '0px');

                        $('#contentArea').fadeIn(1000);
                        $("body").css("overflow", "visible");
                    } else {
                        $('#fullScreenButton').attr("src", 'media/images/fullscreen_alt.png');

                        $('#videoContainer').width('960px');
                        $('#videoContainer').height('560px');
                        $('#videoContainer').css('top', '40px');
                        $('#videoContainer').css('left', '50%');
                        $('#videoContainer').css('margin-left', '-480px');

                        $('#iFRameContent').width('960px');
                        $('#iFRameContent').height('560px');
                        $('#contentArea').fadeIn(1000);
                        $("body").css("overflow", "visible");
                    }

                    controller.fullScreen = false;
                } else {
                    if (kurst.utils.JSUtils.isMobile()) {
                        controller.launchFullScreen(document.documentElement);
                        $('#logoContainer').fadeOut(250);
                    }

                    $('#fullScreenButton').attr("src", 'media/images/fullscreen_exit_alt.png');

                    $('#videoContainer').width('100%');
                    $('#videoContainer').height('100%');
                    $('#videoContainer').css('top', '0px');
                    $('#videoContainer').css('left', '0px');
                    $('#videoContainer').css('margin-left', '0px');

                    $('#iFRameContent').width('100%');
                    $('#iFRameContent').height('100%');

                    $('#contentArea').fadeOut(250);
                    $("body").css("overflow", "hidden");

                    controller.fullScreen = true;
                }
            });
        };

        /*
        */
        UI.prototype.initLinks = function () {
            $('#aboutUs-menuItem').click(function () {
                $.scrollTo('#aboutUs-content', 800);
            });

            $('#contactUs-menuItem').click(function () {
                $.scrollTo('#contactUs-content', 800);
            });

            $('#aboutTop').click(function () {
                $.scrollTo('#logoContainer', 800);
            });

            $('#contactTop').click(function () {
                $.scrollTo('#logoContainer', 800);
            });
        };

        /*
        */
        UI.prototype.showStaticContent = function (delayTime) {
            $('#contentArea').delay(delayTime).fadeIn(1000);
        };
        return UI;
    })();
    KurstWebsite.UI = UI;
})(KurstWebsite || (KurstWebsite = {}));
/// <reference path="../../libs/Away3D.next.d.ts" />
/// <reference path="../../libs/maps/jquery.d.ts" />
var KurstWebsite;
(function (KurstWebsite) {
    var AGLSLDemo = (function () {
        function AGLSLDemo() {
            var _this = this;
            $("#compile").click(function () {
                return _this.clickBtn();
            });
        }
        AGLSLDemo.prototype.clickBtn = function () {
            console.log('clickButton');

            var vssource = $("#txt_in").val();
            var agalMiniAssembler = new aglsl.assembler.AGALMiniAssembler();

            agalMiniAssembler.assemble(vssource);
            ;

            var data = agalMiniAssembler.r['fragment'].data;
            var tokenizer = new aglsl.AGALTokenizer();
            var description = tokenizer.decribeAGALByteArray(data);
            var parser = new aglsl.AGLSLParser();
            var frag = parser.parse(description);

            var datavertex = agalMiniAssembler.r['vertex'].data;
            var descriptionvertex = tokenizer.decribeAGALByteArray(datavertex);
            var vert = parser.parse(descriptionvertex);

            $("#txt_out").val(frag + '\n' + '----------------------------------------------' + '\n' + vert);
        };
        return AGLSLDemo;
    })();
    KurstWebsite.AGLSLDemo = AGLSLDemo;
})(KurstWebsite || (KurstWebsite = {}));
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

var Main;
(function (Main) {
    //--------------------------------------------------------------------------
    // Data
    var gsData;

    //--------------------------------------------------------------------------
    // Website UI
    var videoPlayer;
    var ui;
    var bg;
    var iFrame;
    var AGLSLDemo;

    var colours = ['#8b0000', '#019601', '#010192', '#008b8b', '#8e008e', '#bbbb00'];

    //--------------------------------------------------------------------------
    /*
    * Entry Point init and start the website components
    */
    function start() {
        ui = new KurstWebsite.UI($);
        bg = new KurstWebsite.BackgroundGrad();
        AGLSLDemo = new KurstWebsite.AGLSLDemo();

        iFrame = kurst.utils.JSUtils.getId('iFRameContent');

        iFrame.src = 'http://kurst.co.uk/samples/awayts/awd_light_b/';

        var links = $('.content-link').click(function (event) {
            event.preventDefault();

            iFrame.src = $(this).attr('uri');

            $.scrollTo('#logoContainer', 800);

            bg.setColour(colours[Math.floor(Math.random() * colours.length)]);
        });

        for (var ind in links) {
            var div = links[ind];
            var uri = $(div).attr('href');

            $(div).attr('href', '#');
        }

        $('.top-menuItem').click(function () {
            $.scrollTo('#logoContainer', 800);
        });

        setTimeout(function () {
            bg.setColour('#8b0000');
        }, 3000);
        //console.log( links );
    }
    Main.start = start;

    /*
    * Callback - Google Spreadsheet data load error
    */
    function gsLoadError() {
    }
})(Main || (Main = {}));

$(document).ready(function () {
    Main.start();
    console.log('start2');
});
//# sourceMappingURL=main.js.map
