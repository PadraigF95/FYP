var app = angular.module('GamesWebApp', ['ngRoute']);

app.config(function($routeProvider) {
    $routeProvider

    // route for the home page
        .when('/', {
            templateUrl : 'pages/home.ejs',
            controller  : 'maincontroller'
        })

        .when('/register1', {
            templateUrl : 'pages/register1.ejs',
            controller  : 'logincontroller'
        })

        .when('/login', {
            templateUrl : 'pages/login.ejs',
            controller  : 'logincontroller'
        })

        .when('/games', {
            templateUrl : 'pages/games.ejs',
            controller : 'gamecontroller'
        })

        .when('/profile', {
             templateUrl: 'pages/profile.ejs',
            controller: 'gamecontroller'
        });


});






