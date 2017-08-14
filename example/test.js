var testApp = angular.module('testApp', ['anguSlide']);

testApp.controller('exampleCtrl', function($scope, $http) {

    $http({url:'test.json'}).then(function(response) {
        $scope.textArea = JSON.stringify(response.data);
    });


    $scope.slideConfig = {
        autoPlay: true,
        startingSlide: 1,
        animationTime: 1000,
        intervalTime: 3000,
    };


    $scope.slideConfigVertical = {
        autoPlay: true,
        startingSlide: 1,
        animationTime: 1000,
        intervalTime: 3000,
        slideDirection: 'vertical'
    };

    $scope.startSlideshow = function() {
        $scope.slideData = JSON.parse($scope.textArea);
        console.log($scope.slideData);
    }


});
