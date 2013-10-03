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
            //--------------------------------------------------------------------------
            this.lastColour = '#30353b';
            this.bgUpdateCounter = 0;
            this.backgroundColour = '#30353b';
            this.colourTween = new Object();
        }
        //--------------------------------------------------------------------------
        /**
        */
        BackgroundGrad.prototype.setColour = function (colour) {
            this.animateBackground(colour);
        };

        /**
        */
        BackgroundGrad.prototype.resetBackground = function () {
            this.animateBackgroundToColour(this.backgroundColour);
        };

        //--------------------------------------------------------------------------
        /**
        */
        BackgroundGrad.prototype.animateBackground = function (colour) {
            this.animateBackgroundToColour(colour);
        };

        /**
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

        /**
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
            }

            this.bgUpdateCounter++;
        };

        /**
        */
        BackgroundGrad.prototype.completeBackgroundTween = function () {
            this.bgUpdateCounter = 0;
            var v = this.colourTween['color0'];
            this.lastColour = kurst.utils.NumberUtils.rgbToHex(v);

            this.getId('backgroundD').style.backgroundImage = 'radial-gradient(farthest-corner at center 180px, ' + this.lastColour + ' 0%, ' + this.backgroundColour + ' 620px)';
            this.getId('backgroundD').style.backgroundImage = '-o-radial-gradient(center 180px, farthest-corner, ' + this.lastColour + ' 0%, ' + this.backgroundColour + ' 620px)';
            this.getId('backgroundD').style.backgroundImage = '-webkit-radial-gradient(center 180px, farthest-corner, ' + this.lastColour + ' 0%, ' + this.backgroundColour + ' 620px)';
            this.getId('backgroundD').style.backgroundImage = '-webkit-gradient(radial, 180px 180px, 0, 180px 0%, 813, color-stop(0%, ' + this.lastColour + '), color-stop(620px, ' + this.backgroundColour + '))';
        };
        return BackgroundGrad;
    })(kurst.core.UIBase);
    KurstWebsite.BackgroundGrad = BackgroundGrad;
})(KurstWebsite || (KurstWebsite = {}));
/// <reference path="../../libs/maps/jquery.d.ts" />
/// <reference path="../../libs/maps/jquery.scrollTo.d.ts" />
/// <reference path="../utils/JSUtils.ts" />
var KurstWebsite;
(function (KurstWebsite) {
    var UI = (function () {
        //--------------------------------------------------------------------------
        function UI() {
            //--------------------------------------------------------------------------
            this.fullScreen = false;
            this.init();
        }
        //--------------------------------------------------------------------------
        /**
        */
        UI.prototype.init = function () {
            $('#contentArea').hide();
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

        //--------------------------------------------------------------------------
        /**
        */
        UI.prototype.launchFullScreen = function (element) {
            if (element['requestFullScreen']) {
                element['requestFullScreen']();
            } else if (element['mozRequestFullScreen']) {
                element['mozRequestFullScreen']();
            } else if (element['webkitRequestFullScreen']) {
                element['webkitRequestFullScreen']();
            }
        };

        /**
        */
        UI.prototype.cancelFullscreen = function () {
            if (document['cancelFullScreen']) {
                document['cancelFullScreen']();
            } else if (document['mozCancelFullScreen']) {
                document['mozCancelFullScreen']();
            } else if (document['webkitCancelFullScreen']) {
                document['webkitCancelFullScreen']();
            }
        };

        /**
        */
        UI.prototype.initFullScreenButton = function () {
            var controller = this;
            $('#fullScreenButton').click(function () {
                $.scrollTo('#logoContainer', 800);

                if (controller.fullScreen) {
                    if (kurst.utils.JSUtils.isMobile()) {
                        controller.cancelFullscreen();
                        $('#logoContainer').fadeIn(1000);
                        $('#fullScreenButton').attr("src", 'img/fullscreen_alt.png');
                        $('#videoContainer').css('top', '40px');
                        $('#videoContainer').width('100%');
                        $('#videoContainer').height('400px');
                        $('#videoContainer').css('top', '0px');
                        $('#contentArea').fadeIn(1000);
                        $("body").css("overflow", "visible");
                    } else {
                        $('#fullScreenButton').attr("src", 'img/fullscreen_alt.png');
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

                    $('#fullScreenButton').attr("src", 'img/fullscreen_exit_alt.png');
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

        /**
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

        /**
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
///<reference path="kurst/utils/JSonLoader.ts"/>
///<reference path="kurst/utils/GSpreadSheetLoader.ts"/>
///<reference path="kurst/utils/JSUtils.ts"/>
///<reference path="kurst/website/BackgroundGrad.ts"/>
///<reference path="kurst/website/UI.ts"/>
///<reference path="kurst/website/AGLSLDemo.ts"/>
/// <reference path="libs/maps/jquery.d.ts" />
var controller = this;

var Main;
(function (Main) {
    //--------------------------------------------------------------------------
    // Website UI
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
        ui = new KurstWebsite.UI();
        bg = new KurstWebsite.BackgroundGrad();
        AGLSLDemo = new KurstWebsite.AGLSLDemo();
        iFrame = kurst.utils.JSUtils.getId('iFRameContent');

        iFrame.src = 'http://kurst.co.uk/samples/awayts/awd_light_b/';

        // Get all .content-link classes to open into the iFrame
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

        // Back to top links
        $('.top-menuItem').click(function () {
            $.scrollTo('#logoContainer', 800);
        });

        // Get a background colour change
        setTimeout(function () {
            bg.setColour('#8b0000');
        }, 3000);
    }
    Main.start = start;
})(Main || (Main = {}));

$(document).ready(function () {
    Main.start();
});
//# sourceMappingURL=main.js.map
