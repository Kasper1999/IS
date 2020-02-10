var app = angular.module('plunker', []);

// app.config(['$compileProvider', function ($compileProvider) {
//   // disable debug info
//   $compileProvider.debugInfoEnabled(false);
// }]);

app.directive('tabset', function() {
    return {
      restrict: 'E',
      transclude: true,
      scope: {},
      controller: [ "$scope", function($scope) {
        var panes = $scope.panes = [];
 
        $scope.select = function(pane) {
          angular.forEach(panes, function(pane) {
            pane.selected = false;
          });
          // console.log($scope);
          // console.log(pane);
          pane.selected = true;
        }
 
        this.addPane = function(pane) {
          if (panes.length == 0) $scope.select(pane);
          panes.push(pane);
        }

        $scope.showMessage = function(tab, message) {
          console.log(tab + " " + message);
        }
      }],
      template:
        '<div class="tabbable">' +
          '<ul class="nav nav-tabs">' +
            '<li ng-repeat="pane in panes" ng-class="{active:pane.selected}">'+
              '<button class="tab" href="" ng-click="select(pane)">{{pane.title}}</button >' +
            '</li>' +
          '</ul>' +
          '<div class="tab-content" ng-transclude></div>' +
        '</div>',
      replace: true
    };
  });
  app.directive('tab', function() {
    return {
      require: '^tabset',
      restrict: 'E',
      transclude: true,
      scope: { 
        title: '@',
        // onActiv: '&',
        // onDeactiv: '&' 
      },
      link: function(scope, element, attrs, tabsCtrl) {
        // console.log("tabsCtrl ");
        // console.log(tabsCtrl);
        tabsCtrl.addPane(scope);
        // scope.$watch('status', function() {
        //   if ($scope.status) {
        //     console.log("$watch Open");
        //   } else {
        //     console.log("$watch Close");
        //   }
        // });
      },
      template:
        '<div class="tab-pane" ng-class="{active: selected}" ng-transclude>' +
        '</div>',
      replace: true
    };
  })
