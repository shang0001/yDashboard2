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
            redirectTo: '/client/app.html'
        });
  }]);

var dashboardControllers = angular.module('dashboardControllers', ['googlechart']);
dashboardControllers.controller("YearCtrl", [
    '$http', '$scope', function ($http, $scope) {
        $scope.year = 2004;
        $scope.chartObject = {};

        // $routeParams.chartType == BarChart or PieChart or ColumnChart...
        $scope.chartObject.type = "ColumnChart";
        $scope.chartObject.options = {
            "isStacked": "true",
            "width": 800,
            "height": 600,
            "fill": 20,
            "displayExactValues": true,
            "vAxis": {
                "title": "",
                "gridlines": {
                    "count": 10
                }
            },
            "hAxis": {
                "title": "Country"
            },
            "allowHtml": true
        }

        $scope.onYearChange = function () {
            $scope.loadComplete = false;
            $http.get('/api/medalrecords/' + $scope.year)
                .success(function (data, status) {
                    $scope.status = status;
                    $scope.chartObject.data = {
                        "cols": [
                            { id: "y", label: "Year", type: "string" },
                            { id: "b", label: "Bronze", type: "number" },
                            { id: "s", label: "Silver", type: "number" },
                            { id: "g", label: "Gold", type: "number" }
                        ],
                        "rows": data
                    };

                    $scope.chartObject.options.title = "Medal distribution for year " + $scope.year;
                    $scope.loadComplete = true;
                })
                .error(function (data, status) {
                    $scope.data = data || "Request failed";
                    $scope.status = status;
                });
        };

        $scope.onYearChange();
    }
]);

dashboardControllers.controller("CountryCtrl", [
    '$http', '$scope', function ($http, $scope) {
        $scope.country = 'China';
        $scope.chartObject = {};

        // $routeParams.chartType == BarChart or PieChart or ColumnChart...
        $scope.chartObject.type = "ColumnChart";
        $scope.chartObject.options = {
            "isStacked": "true",
            "width": 800,
            "height": 600,
            "fill": 20,
            "displayExactValues": true,
            "vAxis": {
                "title": "",
                "gridlines": {
                    "count": 10
                }
            },
            "hAxis": {
                "title": "Sport"
            },
            "allowHtml": true
        }

        $scope.onCountryChange = function () {
            $scope.loadComplete = false;
            $http.get('/api/medalrecords/' + $scope.country)
                .success(function (data, status) {
                    $scope.status = status;
                    $scope.chartObject.data = {
                        "cols": [
                            { id: "sp", label: "Sport", type: "string" },
                            { id: "b", label: "Bronze", type: "number" },
                            { id: "s", label: "Silver", type: "number" },
                            { id: "g", label: "Gold", type: "number" }
                        ],
                        "rows": data
                    };

                    $scope.chartObject.options.title = "Medal distribution for " + $scope.country;
                    $scope.loadComplete = true;
                })
                .error(function (data, status) {
                    $scope.data = data || "Request failed";
                    $scope.status = status;
                });
        };


        $scope.hideGold = false;
        $scope.hideSilver = false;
        $scope.hideBronze = false;
        $scope.selectionChange = function () {
            var columns = [];
            columns.push(0);
            if (!$scope.hideBronze) {
                columns.push(1);
            }
            if (!$scope.hideSilver) {
                columns.push(2);
            }
            if (!$scope.hideGold) {
                columns.push(3);
            }
            $scope.chartObject.view = { columns: columns };
        }

        $scope.onCountryChange();
    }
]);

dashboardControllers.controller("AthleteCtrl", [
    '$http', '$scope', function ($http, $scope) {
        $scope.loadComplete = true;
        $scope.chartObject = {};
        $scope.chartObject.type = "Table";
        $scope.chartObject.options = {
            "isStacked": "true",
            "width": 400,
            "height": 200,
            "fill": 20,
            "displayExactValues": true,
            "vAxis": {
                "title": "",
                "gridlines": {
                    "count": 10
                }
            },
            "hAxis": {
                "title": "Year"
            },
            "allowHtml": true
        }

        $scope.onNameChange = function (athlete) {
            $scope.selectedAthlete = athlete;
            $scope.loadComplete = false;
            $http.get('/api/athletes/' + athlete.Name)
                .success(function (data, status) {
                    $scope.status = status;
                    $scope.chartObject.data = {
                        "cols": [
                            { id: "y", label: "Year", type: "string" },
                            { id: "b", label: "Bronze", type: "number" },
                            { id: "s", label: "Silver", type: "number" },
                            { id: "g", label: "Gold", type: "number" }
                        ],
                        "rows": data
                    };

                    $scope.chartObject.options.title = "Medal records for " + athlete.Name + ", sport: " + athlete.Sport;
                    $scope.loadComplete = true;
                })
                .error(function (data, status) {
                    $scope.data = data || "Request failed";
                    $scope.status = status;
                });
        }

        $http.get('/api/athletes')
            .success(function (data, status) {
                $scope.status = status;
                $scope.athletes = data;
            })
            .error(function (data, status) {
                $scope.data = data || "Request failed";
                $scope.status = status;
            });
    }
]);