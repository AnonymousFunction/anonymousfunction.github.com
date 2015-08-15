var scores = scores || angular.module("scores", []);

scores.config(function ( $httpProvider) {
    delete $httpProvider.defaults.headers.common['X-Requested-With'];
});

scores.controller("MainController", function($scope, $http){
//    $http.get("http://sports.espn.go.com/nfl/bottomline/scores").then(function(res){
//    $http.get("http://www.nfl.com/liveupdate/scorestrip/ss.xml").then(function(res){});
//    $http.get("http://api.espn.com/v1/sports/football/nfl").then(function(res){});
    $http.get("http://fcast.k2.espncdn.com/FastcastService/pubsub/profiles/12000/topic/scoreboard-football-nfl/message/9493/checkpoint").then(function(res){
        $scope.games = res.data.events;
        console.log("$scope.games", $scope.games);
    });

});


