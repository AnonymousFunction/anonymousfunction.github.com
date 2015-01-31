var af = af || angular.module("af", ["ngRoute"]);

af.config(function($routeProvider){
	$routeProvider.
     	when('/', {templateUrl:'views/home.html'}).
      	when('/games', {templateUrl:'views/games.html'}).
      	when('/about', {templateUrl:'views/about.html'}).
      	otherwise({redirectTo:'/'});
});

af.controller("MainController", function($scope){
	console.log("loaded");
});