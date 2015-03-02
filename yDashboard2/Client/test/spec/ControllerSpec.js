describe("YearCtrl", function () {
    var scope, ctrl, $httpBackend;

    beforeEach(module('dashboardControllers'));
    beforeEach(inject(function (_$httpBackend_, $rootScope, $controller) {
        $httpBackend = _$httpBackend_;
        $httpBackend.expectGET('/api/medalrecords/years/year-only').
            respond(
            {
                "Years": [2012, 2010],
                "InitialYear": 2012,
                "InitialYearMedalRecords": [
                    { "c": [{ "v": "Canada" }, { "v": 1 }, { "v": 0 }, { "v": 0 }] },
                    { "c": [{ "v": "United States" }, { "v": 0 }, { "v": 0 }, { "v": 1 }] },
                    { "c": [{ "v": "China" }, { "v": 3 }, { "v": 17 }, { "v": 1 }] }]
            });

        scope = $rootScope.$new();
        ctrl = $controller('YearCtrl', { $scope: scope });
    }));

    it('should set the event handler function for changing year', function () {
        expect(scope.onYearChange).not.toBeUndefined();
    });

    describe("onYearChange", function () {

        it('should correctly update chart data rows when changing year event', function () {
            $httpBackend.flush();

            $httpBackend.expectGET('/api/medalrecords/years/2008').
            respond(
            [
                { "c": [{ "v": "Canada" }, { "v": 1 }, { "v": 0 }, { "v": 0 }] },
                { "c": [{ "v": "United States" }, { "v": 1 }, { "v": 1 }, { "v": 0 }] },
                { "c": [{ "v": "China" }, { "v": 31 }, { "v": 0 }, { "v": 20 }] }
            ]);
            scope.year = 2008;
            scope.onYearChange();
            $httpBackend.flush();

            expect(scope.chartObject.data.rows).toEqual([
                    { "c": [{ "v": "Canada" }, { "v": 1 }, { "v": 0 }, { "v": 0 }] },
                    { "c": [{ "v": "United States" }, { "v": 1 }, { "v": 1 }, { "v": 0 }] },
                    { "c": [{ "v": "China" }, { "v": 31 }, { "v": 0 }, { "v": 20 }] }
            ]);
            expect(scope.chartObject.options.title).toEqual("Medal distribution for year 2008");
        });
    });

    it('should create "years" model with 2 year items fetched from xhr', function () {
        expect(scope.years).toBeUndefined();
        $httpBackend.flush();

        expect(scope.years).toEqual([2012, 2010]);
    });

    it('should set the default value of year model', function () {
        $httpBackend.flush();
        expect(scope.year).toBe(2012);
    });

    it('should set the title of chartObject model', function () {
        $httpBackend.flush();
        expect(scope.chartObject).not.toBeUndefined();
        expect(scope.chartObject.options.title).toEqual("Medal distribution for year 2012");
    });

    it('should set the chart columns of chartObject model', function () {
        expect(scope.chartObject).not.toBeUndefined();
        expect(scope.chartObject.data).toEqual({
            cols: [
                { id: "c", label: "Country", type: "string" },
                { id: "b", label: "Bronze", type: "number" },
                { id: "s", label: "Silver", type: "number" },
                { id: "g", label: "Gold", type: "number" }
            ],
            rows: null
        });
    });

    it('should set the intial chart rows of chartObject model', function () {
        $httpBackend.flush();
        expect(scope.chartObject).not.toBeUndefined();
        expect(scope.chartObject.data.rows).toEqual([
                    { "c": [{ "v": "Canada" }, { "v": 1 }, { "v": 0 }, { "v": 0 }] },
                    { "c": [{ "v": "United States" }, { "v": 0 }, { "v": 0 }, { "v": 1 }] },
                    { "c": [{ "v": "China" }, { "v": 3 }, { "v": 17 }, { "v": 1 }] }]);
    });
});

describe("CountryCtrl", function () {
    var scope, ctrl, $httpBackend;

    beforeEach(module('dashboardControllers'));
    beforeEach(inject(function (_$httpBackend_, $rootScope, $controller) {
        $httpBackend = _$httpBackend_;
        $httpBackend.expectGET('/api/medalrecords/countries/country-only').
            respond(
            {
                "Countries": [
                    { "label": "Canada", "value": "Canada" },
                    { "label": "United States", "value": "United States" },
                    { "label": "China", "value": "China" }],
                "InitialCountryIndex": 0,
                "InitialCountryMedalRecords": [
                    { "c": [{ "v": 2008 }, { "v": 10 }, { "v": 13 }, { "v": 11 }] },
                    { "c": [{ "v": 2010 }, { "v": 8 }, { "v": 15 }, { "v": 67 }] },
                    { "c": [{ "v": 2012 }, { "v": 33 }, { "v": 21 }, { "v": 1 }] }]
            }
            );

        scope = $rootScope.$new();
        ctrl = $controller('CountryCtrl', { $scope: scope });
    }));

    it('should set the event handler function for changing country', function () {
        expect(scope.onCountryChange).not.toBeUndefined();
    });

    describe("onCountryChange", function () {

        it('should correctly update chart data rows when changing country', function () {
            $httpBackend.flush();

            $httpBackend.expectGET('/api/medalrecords/countries/Canada').
            respond(
            [
                { "c": [{ "v": 2000 }, { "v": 23 }, { "v": 4 }, { "v": 4 }] },
                { "c": [{ "v": 2002 }, { "v": 15 }, { "v": 7 }, { "v": 52 }] },
                { "c": [{ "v": 2004 }, { "v": 4 }, { "v": 10 }, { "v": 3 }] },
                { "c": [{ "v": 2006 }, { "v": 11 }, { "v": 28 }, { "v": 30 }] },
                { "c": [{ "v": 2008 }, { "v": 10 }, { "v": 13 }, { "v": 11 }] },
                { "c": [{ "v": 2010 }, { "v": 8 }, { "v": 15 }, { "v": 67 }] },
                { "c": [{ "v": 2012 }, { "v": 33 }, { "v": 21 }, { "v": 1 }] }
            ]);
            scope.country = {label: "Canada", value: "Canada"};
            scope.onCountryChange();
            $httpBackend.flush();

            expect(scope.chartObject.data.rows).toEqual([
                { "c": [{ "v": 2000 }, { "v": 23 }, { "v": 4 }, { "v": 4 }] },
                { "c": [{ "v": 2002 }, { "v": 15 }, { "v": 7 }, { "v": 52 }] },
                { "c": [{ "v": 2004 }, { "v": 4 }, { "v": 10 }, { "v": 3 }] },
                { "c": [{ "v": 2006 }, { "v": 11 }, { "v": 28 }, { "v": 30 }] },
                { "c": [{ "v": 2008 }, { "v": 10 }, { "v": 13 }, { "v": 11 }] },
                { "c": [{ "v": 2010 }, { "v": 8 }, { "v": 15 }, { "v": 67 }] },
                { "c": [{ "v": 2012 }, { "v": 33 }, { "v": 21 }, { "v": 1 }] }
            ]);
            expect(scope.chartObject.options.title).toEqual("Medal distribution for Canada");
        });
    });

    it('should set the event handler function for selecting a chart block', function () {
        expect(scope.onCellSelected).not.toBeUndefined();
    });

    describe("onCellSelected", function() {

        it('should correctly update chart data rows when selecting a chart block', function() {
            $httpBackend.flush();

            $httpBackend.expectGET('/api/medalrecords/countries/China/2008/Gold').
                respond(
                [
                    { "c": [{ "v": "Archery" }, { "v": 1 }] },
                    { "c": [{ "v": "Badminton" }, { "v": 4 }] },
                    { "c": [{ "v": "Boxing" }, { "v": 2 }] }
                ]);

            scope.country = { label: "China", value: "China" };
            scope.chartObject = {
                data: {
                    rows: [
                        {
                            c: [
                                {
                                    v: 2008
                                }
                            ]
                        }
                    ],
                    cols: [{label: "Gold"}]
                }
            };
       
            scope.onCellSelected({ row:0, column:0 });
            $httpBackend.flush();

            expect(scope.detailChartObject).not.toBeUndefined();
            expect(scope.detailChartObject.data.rows).toEqual([
                { "c": [{ "v": "Archery" }, { "v": 1 }] },
                { "c": [{ "v": "Badminton" }, { "v": 4 }] },
                { "c": [{ "v": "Boxing" }, { "v": 2 }] }
            ]);
            expect(scope.detailChartObject.options.title).toEqual("Gold medal distribution for China at year 2008");
        });
    });

    it('should create "countries" model with 3 countries fetched from xhr', function () {
        expect(scope.countries).toBeUndefined();
        $httpBackend.flush();

        expect(scope.countries).toEqual([
            { "label": "Canada", "value": "Canada" },
            { "label": "United States", "value": "United States" },
            { "label": "China", "value": "China" }]);
    });

    it('should set the default value of country model', function () {
        $httpBackend.flush();
        expect(scope.country.value).toEqual("Canada");
    });

    it('should set the title of chartObject model', function () {
        $httpBackend.flush();
        expect(scope.chartObject).not.toBeUndefined();
        expect(scope.chartObject.options.title).toEqual("Medal distribution for Canada");
    });

    it('should set the chart columns of chartObject model', function () {
        expect(scope.chartObject).not.toBeUndefined();
        expect(scope.chartObject.data.cols).toEqual([
                { id: "y", label: "Year", type: "string" },
                { id: "b", label: "Bronze", type: "number" },
                { id: "s", label: "Silver", type: "number" },
                { id: "g", label: "Gold", type: "number" }
            ]);
    });

    it('should set the intial chart rows of chartObject model', function () {
        $httpBackend.flush();
        expect(scope.chartObject).not.toBeUndefined();
        expect(scope.chartObject.data.rows).toEqual([
                    { "c": [{ "v": 2008 }, { "v": 10 }, { "v": 13 }, { "v": 11 }] },
                    { "c": [{ "v": 2010 }, { "v": 8 }, { "v": 15 }, { "v": 67 }] },
                    { "c": [{ "v": 2012 }, { "v": 33 }, { "v": 21 }, { "v": 1 }] }]);
    });
});

describe("AthleteCtrl", function () {
    var scope, ctrl, $httpBackend;

    beforeEach(module('dashboardControllers'));
    beforeEach(inject(function (_$httpBackend_, $rootScope, $controller) {
        $httpBackend = _$httpBackend_;
        $httpBackend.expectGET('/api/athletes').
            respond(
            [
                { "Name": "Sun Yang", "Sport": "Swimming", "MedalRecords": null },
                { "Name": "Michael Phelps", "Sport": "Swimming", "MedalRecords": null },
                { "Name": "Óscar Salazar", "Sport": "Taekwondo", "MedalRecords": null },
                { "Name": "Sigfús Sigurðsson", "Sport": "Handball", "MedalRecords": null },
                { "Name": "Zina Lunina", "Sport": "Rhythmic Gymnastics", "MedalRecords": null }
            ]);

        scope = $rootScope.$new();
        ctrl = $controller('AthleteCtrl', { $scope: scope });
    }));

    it('should set the event handler function for selecting an athlete', function () {
        expect(scope.onNameChange).not.toBeUndefined();
    });

    describe("onNameChange", function () {

        it('should correctly update chart data rows when selecting an athlete', function () {
            $httpBackend.flush();

            $httpBackend.expectGET('/api/athletes/' + encodeURIComponent('Kaillie Humphries')).
            respond(
            [
                { "c": [{ "v": 2010 }, { "v": 1 }, { "v": 0 }, { "v": 0 }] }
            ]);
            
            scope.onNameChange({ Name: 'Kaillie Humphries', Sport: 'Bobsleigh' });
            $httpBackend.flush();

            expect(scope.chartObject.data.rows).toEqual([
                { "c": [{ "v": 2010 }, { "v": 1 }, { "v": 0 }, { "v": 0 }] }
            ]);
            expect(scope.chartObject.options.title).toEqual("Medal records for Kaillie Humphries, sport: Bobsleigh");
        });
    });

    it('should create "athletes" model with 5 athletes fetched from xhr', function () {
        expect(scope.athletes).toBeUndefined();
        $httpBackend.flush();

        expect(scope.athletes).toEqual([
                { "Name": "Sun Yang", "Sport": "Swimming", "MedalRecords": null },
                { "Name": "Michael Phelps", "Sport": "Swimming", "MedalRecords": null },
                { "Name": "Óscar Salazar", "Sport": "Taekwondo", "MedalRecords": null },
                { "Name": "Sigfús Sigurðsson", "Sport": "Handball", "MedalRecords": null },
                { "Name": "Zina Lunina", "Sport": "Rhythmic Gymnastics", "MedalRecords": null }
        ]);
    });

    it('should set the chart columns of chartObject model', function () {
        expect(scope.chartObject).not.toBeUndefined();
        expect(scope.chartObject.data.cols).toEqual( [
                { id: "y", label: "Year", type: "string" },
                { id: "g", label: "Gold", type: "number" },
                { id: "s", label: "Silver", type: "number" },
                { id: "b", label: "Bronze", type: "number" }
        ]);
    });

    ////demonstrates use of expected exceptions
    //describe("#resume", function () {
    //    it("should throw an exception if song is already playing", function () {
    //        player.play(song);

    //        expect(function () {
    //            player.resume();
    //        }).toThrowError("song is already playing");
    //    });
    //});
});