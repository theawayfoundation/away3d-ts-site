declare module away {
    class AppHarness {
        private tests;
        private dropDown;
        private previousBtn;
        private nextBtn;
        private sourceBtn;
        private testIframe;
        private srcIframe;
        private counter;
        private sourceVisible;
        private loadDefault;
        constructor();
        /**
        *
        * Load a test
        *
        * @param classPath - Module and Class path of test
        * @param js Path to JavaScript file
        * @param ts Path to Typescript file ( not yet used - reserved for future show source )
        */
        public load(classPath: string, js: string, ts: string): void;
        /**
        *
        * Add a test to the AppHarness
        *
        * @param name Name of test
        * @param classPath - Module and Class path of test
        * @param js Path to JavaScript file
        * @param ts Path to Typescript file ( not yet used - reserved for future show source )
        */
        public addTest(name: string, classpath: string, js: string, ts: string): void;
        /**
        *
        * Add a separator to the menu
        *
        * @param name
        */
        public addSeperator(name?: string): void;
        /**
        *
        * Start the application harness
        *
        */
        public start(): void;
        private loadFromURL();
        /**
        *
        */
        private initInterface();
        /**
        *
        */
        private initFrameSet();
        /**
        *
        * Selectnext / previous menu item
        *
        * @param direction
        */
        private nagigateBy(direction?);
        /**
        *
        * Navigate to a section
        *
        * @param testData
        */
        private navigateToSection(testData);
        private toggleSource();
        private createSourceViewHTML(url);
        /**
        *
        * Util function - get Element by ID
        *
        * @param id
        * @returns {HTMLElement}
        */
        private getId(id);
        /**
        *
        * Dropbox event handler
        *
        * @param e
        */
        private dropDownChange(e);
    }
    class AppFrame {
        private classPath;
        private jsPath;
        constructor();
        /**
        *
        * Load a JavaScript file
        *
        * @param url - URL of JavaScript file
        */
        private loadJS(url);
        /**
        *
        * Event Handler for loaded JavaScript files
        *
        */
        private jsLoaded();
    }
    class Utils {
        /**
        *
        * Utility function - Parse a Query formatted string
        *
        * @param qs
        * @returns {{}}
        */
        static getQueryParams(qs): Object;
    }
}
