var scores = scores || angular.module("scores", []);

scores.config(function ( $httpProvider) {
    delete $httpProvider.defaults.headers.common['X-Requested-With'];
});

scores.controller("MainController", function($scope, $http){
//    $http.get("http://fcast.n7.espncdn.com/FastcastService/pubsub/profiles/12000/topic/scoreboard-football-nfl/message/10273/checkpoint").then(function(res){
    $http.get("scores.json").then(function(res){
        $scope.games = res.data.events;
        console.log("$scope.games", $scope.games);
    });

});


