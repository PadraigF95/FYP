var app = angular.module('GamesWebApp', ['ngRoute']);

app.config(function($routeProvider) {
    $routeProvider

    // route for the home page
        .when('/', {
            templateUrl : 'views/index.ejs',
            controller  : 'maincontroller'
        })

        .when('/games', {
            templateUrl : 'views/games.ejs',
            controller  : 'gamescontroller'
        })

        .when('/games1', {
            templateUrl : 'views/games1/_id.ejs',
            controller  : 'gamescontroller'
        })

        .when('/findgames', {
            templateUrl : 'views/findgames',
            controller  : 'gamescontroller'
        })

        .when('/games_details', {
            templateUrl : 'pages/games_details.ejs',
            controller  : 'maincontroller'
        })



        .when('/register1', {
            templateUrl : 'views/register1.ejs',
            controller  : 'logincontroller'
        })

        .when('/login', {
            templateUrl : 'views/login.ejs',
            controller  : 'logincontroller'
        })



        .when('/profile', {
             templateUrl: 'views/profile.ejs',
            controller: 'gamescontroller'
        })

        .when('/favourites', {
            templateUrl: 'views/favourites.ejs',
            controller: 'favourites'
        })

        .when('/settings', {
        templateUrl: 'views/settings.ejs',
        controller: 'gamescontroller'
         })

        .when('/forgot1', {
            templateUrl: 'views/forgot1.ejs',
            controller: 'gamescontroller'
        })
        .when('/reset', {
            templateUrl: 'views/reset.ejs',
            controller: 'gamescontroller'
        })
        .when('/games1/:id', {
            templateUrl: 'pages/games1/_id.ejs',
            controller: 'gamescontroller'
        })





});






