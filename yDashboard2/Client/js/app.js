'use strict';

var app = angular.module('dashboardApp', [
    'ngRoute',
    'dashboardControllers'
]).config(['$routeProvider',
  function ($routeProvider) {
      $routeProvider.
        when('/year', {
            templateUrl: '/client/templates/year.html',
            controller: 'YearCtrl'
        }).
        when('/country', {
            templateUrl: '/client/templates/country.html',
            controller: 'CountryCtrl'
        }).
        when('/athlete', {
            templateUrl: '/client/templates/athlete.html',
            controller: 'AthleteCtrl'
        }).
        otherwise({
            templateUrl: '/client/templates/index.html'
        });
  }]);

var dashboardControllers = angular.module('dashboardControllers', ['googlechart']);
//Global google chart options for all charts
dashboardControllers.value("genericOptions", {
    isStacked: true,
    width: "100%",
    height: 500,
    fill: 20,
    displayExactValues: true,
    chartArea: {
        left: "10%",
        top: "8%",
        height: "75%",
        width: "100%"
    },
    vAxis: {
        title: "",
        gridlines: {
            count: 10
        }
    },
    hAxis: {
        title: ""
    },
    allowHtml: true
});

dashboardControllers.controller("MainCtrl", function ($rootScope, $scope) {
    angular.element('#routeError').removeClass('weak-hide');
    $rootScope.$on("$routeChangeSuccess",
        function (event, current, previous, rejection) {
            $scope.routeChangeError = false;
        });
    $rootScope.$on("$routeChangeError",
        function (event, current, previous, rejection) {
            $scope.routeChangeError = true;
        });
});

dashboardControllers.controller("YearCtrl", [
    '$http', '$scope', 'genericOptions', function ($http, $scope, genericOptions) {

        //Initialize the google chart object
        $scope.chartObject = {};
        $scope.chartObject.type = "ColumnChart";
        $scope.chartObject.options = angular.copy(genericOptions);
        $scope.chartObject.options.hAxis.title = "Country";
        $scope.chartObject.options.vAxis.title = "Medals";
        $scope.chartObject.data = {
            cols: [
                { id: "c", label: "Country", type: "string" },
                { id: "b", label: "Bronze", type: "number" },
                { id: "s", label: "Silver", type: "number" },
                { id: "g", label: "Gold", type: "number" }
            ],
            rows: null
        };

        //Event handler when selecting a year
        $scope.onYearChange = function () {
            $scope.loadComplete = false;
            $http.get('/api/medalrecords/years/' + $scope.year)
                .success(function (data, status) {
                    $scope.status = status;
                    $scope.chartObject.data.rows = data;
                    $scope.chartObject.options.title = "Medal distribution for year " + $scope.year;
                    $scope.loadComplete = true;
                })
                .error(function (data, status) {
                    $scope.data = data || "Request failed";
                    $scope.status = status;
                    $scope.loadComplete = true;
                    $scope.$parent.routeChangeError = true;
                });
        };

        //Initialize the View by Year page
        $http.get('/api/medalrecords/years/year-only')
            .success(function (data, status) {
                $scope.years = data.Years;
                if (data.Years.length > 0) {
                    $scope.year = data.InitialYear;
                    $scope.chartObject.data.rows = data.InitialYearMedalRecords;
                    $scope.chartObject.options.title = "Medal distribution for year " + $scope.year;
                }
                $scope.loadComplete = true;
            })
            .error(function (data, status) {
                $scope.data = data || "Request failed";
                $scope.status = status;
                $scope.$parent.routeChangeError = true;
            });
    }
]);

dashboardControllers.controller("CountryCtrl", [
    '$http', '$scope', 'genericOptions', function ($http, $scope, genericOptions) {

        //Initialize the google chart object
        $scope.chartObject = {};
        $scope.chartObject.type = "BarChart";
        $scope.chartObject.options = angular.copy(genericOptions);
        $scope.chartObject.options.hAxis.title = "Year";
        $scope.chartObject.options.vAxis.title = "Medals";
        $scope.chartObject.data = {
            "cols": [
                { id: "y", label: "Year", type: "string" },
                { id: "b", label: "Bronze", type: "number" },
                { id: "s", label: "Silver", type: "number" },
                { id: "g", label: "Gold", type: "number" }
            ],
            "rows": null
        }

        //Event handler when selecting a block on the chart
        $scope.onCellSelected = function(selectedItem) {
            var col = selectedItem.column;
            var row = selectedItem.row;
            var selectedYear = $scope.chartObject.data.rows[row].c[0].v;
            var selectedMedal = $scope.chartObject.data.cols[col].label;
          
            $http.get('/api/medalrecords/countries/' + $scope.country.value + '/' + selectedYear + '/' + selectedMedal)
                .success(function (data, status) {
                    $scope.status = status;
                    $scope.detailChartObject = {};
                    $scope.detailChartObject.type = "PieChart";
                    $scope.detailChartObject.options = angular.copy(genericOptions);
                    $scope.detailChartObject.options.hAxis.title = "Sport";
                    $scope.detailChartObject.options.vAxis.title = "Number";
                    $scope.detailChartObject.data = {
                        "cols": [
                            { id: "s", label: "Sport", type: "string" },
                            { id: "n", label: "Number", type: "number" }
                        ],
                        "rows": data
                    };

                    $scope.detailChartObject.options.title = selectedMedal + " medal distribution for " + $scope.country.value + " at year " + selectedYear;
                })
                .error(function (data, status) {
                    $scope.data = data || "Request failed";
                    $scope.status = status;
                    $scope.detailChartObject = null;
                    $scope.$parent.routeChangeError = true;
                });
        }

        //Event handler when selecting a country
        $scope.onCountryChange = function () {
            $scope.loadComplete = false;
            $http.get('/api/medalrecords/countries/' + $scope.country.value)
                .success(function (data, status) {
                    $scope.status = status;
                    $scope.chartObject.data.rows = data;

                    $scope.chartObject.options.title = "Medal distribution for " + $scope.country.value;
                    $scope.loadComplete = true;
                    $scope.detailChartObject = null;
                })
                .error(function (data, status) {
                    $scope.data = data || "Request failed";
                    $scope.status = status;
                    $scope.loadComplete = true;
                    $scope.$parent.routeChangeError = true;
                });
        };

        //Initialize the View by Country page
        $http.get('/api/medalrecords/countries/country-only')
            .success(function (data, status) {
                $scope.status = status;
                $scope.countries = data.Countries;
                if (data.Countries.length > 0) {
                    $scope.country = data.Countries[data.InitialCountryIndex];
                    $scope.chartObject.data.rows = data.InitialCountryMedalRecords;
                    $scope.chartObject.options.title = "Medal distribution for " + $scope.country.value;
                }
                $scope.loadComplete = true;
            })
            .error(function (data, status) {
                $scope.data = data || "Request failed";
                $scope.status = status;
                $scope.loadComplete = true;
            });
    }
]);

dashboardControllers.controller("AthleteCtrl", [
    '$http', '$scope', 'genericOptions', function ($http, $scope, genericOptions) {
        $scope.loadComplete = true;

        //Initialize the google chart object
        $scope.chartObject = {};
        $scope.chartObject.type = "Table";
        $scope.chartObject.options = angular.copy(genericOptions);
        $scope.chartObject.options.width = 400;
        $scope.chartObject.options.hAxis.title = "Year";
        $scope.chartObject.options.vAxis.title = "Medals";
        $scope.chartObject.data = {
            "cols": [
                { id: "y", label: "Year", type: "string" },
                { id: "g", label: "Gold", type: "number" },
                { id: "s", label: "Silver", type: "number" },
                { id: "b", label: "Bronze", type: "number" }
            ],
            "rows": null
        };

        //Event handler when selecting an athlete
        $scope.onNameChange = function (athlete) {
            $scope.selectedAthlete = athlete;
            $scope.loadComplete = false;

            $http.get('/api/athletes/' + encodeURIComponent(athlete.Name))
                .success(function (data, status) {
                    $scope.status = status;
                    $scope.chartObject.data.rows = data;
                    $scope.chartObject.options.title = "Medal records for " + athlete.Name + ", sport: " + athlete.Sport;
                    $scope.loadComplete = true;
                })
                .error(function (data, status) {
                    $scope.data = data || "Request failed";
                    $scope.status = status;
                    $scope.loadComplete = true;
                    $scope.$parent.routeChangeError = true;
                });
        }

        //Initialize the View by Athlete page
        $http.get('/api/athletes')
            .success(function (data, status) {
                $scope.status = status;
                $scope.athletes = data;
            })
            .error(function (data, status) {
                $scope.data = data || "Request failed";
                $scope.status = status;
                $scope.$parent.routeChangeError = true;
            });
    }
]);