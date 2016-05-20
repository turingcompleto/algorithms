var app = angular.module('fausto', ['ngRoute', 'ngAnimate']);

app.config(function ($routeProvider) {
    $routeProvider.when('/', {
            templateUrl: 'inicio.html',
            controller: 'inicioController'
        })
        .when('/kruskal', {
            templateUrl: 'kruskal.html',
            controller: 'kruskalController'
        })
    .when('/fd', {
            templateUrl: 'fd.html',
            controller: 'fdController'
        })
    .when('/dij', {
            templateUrl: 'dij.html',
            controller: 'dijController'
        });
});

app.controller('inicioController', function ($scope) {
    $scope.name('Inicio');
    $scope.pageClass = "inicio";
});

app.controller('kruskalController', function ($scope) {
    $scope.name('kruskal');
    $scope.pageClass = "kruskal";
});

app.controller('fdController', function ($scope) {
    $scope.name('fd');
    $scope.pageClass = "fd";
});

app.controller('dijController', function ($scope) {
    $scope.name('dij');
    $scope.pageClass = "dij";
});