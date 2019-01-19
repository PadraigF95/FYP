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
            templateUrl : 'view/games.ejs',
            controller : 'gamescontroller'
        })

        .when('/profile', {
             templateUrl: 'pages/profile.ejs',
            controller: 'gamescontroller'
        })

        .when('/settings', {
        templateUrl: 'pages/settings.ejs',
        controller: 'gamescontroller'
         });


});






