'use strict';

// Define the `phonecatApp` module
var phonecatApp = angular.module('phonecatApp');

// Define the `PhoneListController` controller on the `phonecatApp` module
phonecatApp.controller('PhoneListController', function PhoneListController($scope) {
  $scope.phones = [
    {
      name: 'Nexus S',
      snippet: 'Fast just got faster with Nexus S.'
    }, {
      name: 'Motorola XOOM™ with Wi-Fi',
      snippet: 'The Next, Next Generation tablet.'
    }, {
      name: 'MOTOROLA XOOM™',
      snippet: 'The Next, Next Generation tablet.'
    }
  ];
})
////////////////////////////////////////////////////////////////////////////////////////////
.controller('myModal', function($scope) {
  $scope.status = false;
  $scope.$watch('status', function() {
    if ($scope.status) {
      console.log("$watch Open");
    } else {
      console.log("$watch Close");
    }
  });
  $scope.call = function (message) {
    console.log(message);
  };
  $scope.val = {name: "Me"};
  $scope.many = function (data) {
    console.log(data);
  };
})
.directive('newModal', function() {
  return {
      restrict: 'EA',
      transclude: true,
      templateUrl: "newM.html",
      link: function ($scope, element, attrs) {
        $scope.messages = "Work";
      },
      scope: {
        onOpen: '&',
        onClose: '&close',
        Display: "=dis",
      },
      // template: "<p>"+ "{{Display}}" +"</p>" +"<div  ng-transclude>"+"</div>",

  };
})
.controller('meWatch', function($scope) {
  $scope.aVal = 0;
  // $scope.$watch('aVal', function() {
  //   if ($scope.aVal > 1) {
  //     $scope.aVal ++
  //     alert($scope.aVal);
  //   }
  // });
  $scope.applyFunction = function() {
    $scope.safeApply = function() {
      $scope.aVal++;
      alert($scope.aVal);
  };
    // $scope.$apply(function() {
      // $scope.aVal++;
      // alert($scope.aVal);
    // });
  }
})
////////////////////////////////////////////////////////////////////////////////////////////
.controller('mainController', function ($scope, $timeout) {
    $scope.log = '';
})
.controller('userController', function ($scope) {
    $scope.name = { first: 'userController' };    
})
.controller('nameController', function ($scope) {
      $scope.name.first = 'nameController';
})
.controller('hwController', function ($scope) {
    $scope.title = 'titleCntkl';
})
.directive('myModel', function () {
    return {
        restrict: 'EA',
        transclude: true,
        template: 'directive',
        link: function (scope, element, attrs, ctrl, transclude) {
            transclude(function(clone) {  
                element.append(clone); 
            });  
        },
        scope: {titlew:'@someAttr'},
    };
})
.directive('hwModel', function () {
    return {
        restrict: 'EA',
        transclude: true,
        // template: '<div class="model-block">'+'<button ng-click="showEvent()">'+
        // 'Вызов модалки'+'</button>'+'<div id="mod" class="modarl" ng-transclude>'+'</div>'+'</div>',
        templateUrl: "ind.html",
        // controller: function ($scope) {
        //     $scope.showEvent = function () {
        //        let el = document.getElementById('mod');
        //        el.style.display = "block";
        //        setTimeout(function(){
        //         el.style.display = "none";
        //        }, 3000);
        //     }
        // }
    };
});