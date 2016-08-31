'use strict';

var WordsApp = angular.module('WordsApp', ['ui.router']);

var dictionary = ['apple', 'banana', 'pear', 'mango', 'pineapple'];

WordsApp.config(['$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {
  $urlRouterProvider.otherwise('/');
  $stateProvider
    .state('play', {
      url: '/',
      templateUrl: './views/play.html',
      controller: 'AppController'
    })
    .state('highscores', {
      url: '/highscores',
      templateUrl: './views/highscores.html',
      controller: 'HighscoreController'
    })
}]);

WordsApp.factory('Config', function() {
  return {
    userScores: []
  };
});

WordsApp.factory('WordsAppService', function(Config, $http) {
  return {
    saveGame: function() {
      localStorage.setItem('wordGame', JSON.stringify(Config.userScores));
    },
    loadGame: function() {
      return (JSON.parse(localStorage.getItem('wordGame')));
    }
  };
});

WordsApp.controller('AppController', function($scope, $http, WordsAppService, Config) {
  $scope.dictionary = dictionary;

  Config.userScores = WordsAppService.loadGame() || [];

  $scope.checkWord = function() {
    $scope.message = "";
    $scope.error = "";
    var proba = _.filter(Config.userScores, function(item){ return item.word === $scope.inputWord; });
    if(proba.length === 0){
      if(_.indexOf($scope.dictionary,$scope.inputWord) > -1) {
        $scope.score = countScore().length;
        saveScores();
        $scope.message = "You've got " + $scope.score + " points!";
        $scope.inputWord = '';
        return $scope.score;
      }
      $scope.score = 0;
      $scope.error = 'Sorry, the "' + $scope.inputWord + '" word is not in the list.';
    }
    else {
      $scope.score = 0;
      $scope.error = 'Sorry, the "' + $scope.inputWord + '" word is already on the list.';
    }
    $scope.inputWord = '';
  }

  function countScore() {
    var lettersList = $scope.inputWord.split('');
    var uniqueLettersList = [];
    _.each(lettersList, function(letter) {
      if(_.indexOf(uniqueLettersList,letter) === -1) {
        uniqueLettersList.push(letter);
      }
    });
    return uniqueLettersList;
  }

  function saveScores() {
    Config.userScores.push({word:$scope.inputWord, score:$scope.score});
    WordsAppService.saveGame();
  }

});

WordsApp.controller('HighscoreController', function (Config, $scope) {
  $scope.getHighscores = function(){
    return Config.userScores;
  }
});
