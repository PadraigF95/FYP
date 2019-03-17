var app = angular.module('GamesWebApp', ['ngRoute']);

app.config(function($routeProvider) {
    $routeProvider

    // route for the home page
        .when('/', {
            templateUrl : 'pages/index.ejs',
            controller  : 'maincontroller'
        })

        .when('/games_details', {
            templateUrl : 'pages/games_details.ejs',
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
            controller : 'gamescontroller'
        })

        .when('/profile', {
             templateUrl: 'pages/profile.ejs',
            controller: 'gamescontroller'
        })

        .when('/settings', {
        templateUrl: 'pages/settings.ejs',
        controller: 'gamescontroller'
         })

        .when('/forgot1', {
            templateUrl: 'pages/forgot1.ejs',
            controller: 'gamescontroller'
        })
        .when('/reset', {
            templateUrl: 'pages/reset.ejs',
            controller: 'gamescontroller'
        })
        .when('/games/:id', {
            templateUrl: 'pages/games/_id.ejs',
            controller: 'gamescontroller'
        })
        .when('/news', {
            templateUrl: 'pages/news',
            controller: 'gamescontroller'
        })




});






