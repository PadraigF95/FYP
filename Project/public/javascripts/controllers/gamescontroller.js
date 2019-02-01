var app = angular.module('GamesWebApp');

app.controller('gamescontroller', ['$scope', function($scope) {
    // create a message to display in our view
    $scope.message = 'Games!';

}
]);
