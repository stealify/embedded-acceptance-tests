
steal(function () {

    return function (Route, Helpers, App) {

        steal.import("routertest", 
                    "domtest", 
                    "toolstest", 
                    "contacttest",
                    "logintest").then(function (modules) {
            var routerTest = modules[0],
                    domTest = modules[1],
                    toolsTest = modules[2],
                    contacttest = modules[3],
                    logintest = modules[4],
                    mainContainer = "#main_container";


            describe("Application test suite - AppTest", function () {

                beforeAll(function () {
                    /* Important!
                     * Make sure the div container is added to the Karma page
                     */
                    if (!$(mainContainer).length) {
                        $("body").append('<div id="main_container"><div class="loading-page"></div></div>');
                    }

                    spyOn(Route.data, 'index').and.callThrough();
                    spyOn(Route.data, 'dispatch').and.callThrough();

                }, 10000);
                
                afterEach(function () {
                    //Get rid of nasty warning message from can-events. Because of Firefox handled with template, see app.js
//                    $("#tools thead tr td input").each(function () {
//                        this.disabled = false;
//                    });
                    $(mainContainer).empty();
                    //if (!$(mainContainer).length) {
                        $(mainContainer).append('<div class="loading-page"></div>');
                    //}
                });

                afterAll(function () {

                    $(mainContainer).remove();

                }, 5000);

                it("Is Welcome Page Loaded", function (done) {
                    /*  
                     * Loading Welcome page.
                     */
                    Route.data.attr("base", "true");
                    Route.data.attr("selector", mainContainer);
                    Route.data.attr("home", "");
                    Route.data.attr("home", "#!");
                    new Promise(function (resolve, reject) {

                        Helpers.isResolved(resolve, reject, "container", 0);

                    });
                    //Waiting for page to load.
                    new Promise(function (resolve, reject) {

                        Helpers.isResolved(resolve, reject, "container", 0);

                    }).catch(function (rejected) {

                        fail("The Welcome Page did not load within limited time: " + rejected);

                    }).then(function (resolved) {

                        if (resolved) {
                            expect(Route.data.index).toHaveBeenCalled();
                            expect(Route.data.index.calls.count()).toEqual(1);
                            expect(App.controllers["Start"]).not.toBeUndefined();
                            expect($(mainContainer).children().length > 1).toBe(true);

                            domTest("index");
                        }

                        done();

                    });

                });

                it("Is Tools Table Loaded", function (done) {
                    /* Letting the Router load the appropriate page.
                     * The hash change event should load the resource.
                     */

                    Route.data.attr("controller", "table");
                    Route.data.attr("action", "tools");

                    new Promise(function (resolve, reject) {

                        Helpers.isResolved(resolve, reject, "container", 0);

                    }).catch(function (rejected) {

                        fail("The Tools Page did not load within limited time: " + rejected);

                    }).then(function (resolved) {

                        if (resolved) {
                            expect(App.controllers["Table"]).not.toBeUndefined();
                            expect($(mainContainer).children().length > 1).toBe(true);

                            domTest("tools");
                        }

                        done();

                    });

                });

                routerTest(Route, "table", "tools", null);

                it("Is Pdf Loaded", function (done) {

                    Route.data.attr("controller", "pdf");
                    Route.data.attr("action", "test");

                    new Promise(function (resolve, reject) {
                        //Pdf overlays the container so we need to check if content.length > 0
                        $(mainContainer).empty();
                        Helpers.isResolved(resolve, reject, "container", 0, 0);

                    }).catch(function (rejected) {

                        fail("The Pdf Page did not load within limited time: " + rejected);

                    }).then(function (resolved) {

                        if (resolved) {
                            expect(Route.data.dispatch.calls.count()).toEqual(2);
                            expect(App.controllers["Pdf"]).not.toBeUndefined();
                            expect($(mainContainer).children().length > 0).toBe(true);

                            domTest("pdf");
                        }

                        done();

                    });
                });

                routerTest(Route, "pdf", "test", null);
                
                //Spec to test if page data changes on select change event.
                toolsTest(Route, Helpers);
                
                //Form Validation
                contacttest(Route, Helpers);
                //Verify modal form
                logintest();
                
                if (testOnly) {
                    it("Testing only", function () {

                        fail("Testing only, build will not proceed");
                        
                    });
                }
            });
        });
    };
});
