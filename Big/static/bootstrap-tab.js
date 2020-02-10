angular.module('tab', ['ui.bootstrap'])
    .controller('TabsDemoCtrl', TabsController)
    .directive('sepecialTab', SpecialTab);

function TabsController($scope, $window) {
    $scope.tabs = [{
        title: 'Dynamic Title 1',
        content: 'Dynamic content 1'
    }, {
        title: 'Dynamic Title 2',
        content: 'Dynamic content 2',
        disabled: true
    }];

    $scope.alertMe = function () {
        setTimeout(function () {
            $window.alert('You\'ve selected the alert tab!');
        });
    };

    $scope.thirdTabCallback = function () {
        $scope.test = 'I\'m the third tab callback';

        $scope.clickme = function () {
            $window.alert('third tab only function');
        };
    };
}

function SpecialTab() {
    return {
        restrict: 'A',
        controller: function ($scope) {
            console.log('Special tab ctrl, runs on start.');
            $scope.hello = 'hello from special tab controller';
        }
    }
}
