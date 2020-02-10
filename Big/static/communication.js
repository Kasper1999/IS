var app = angular.module('communication', [])

app.service('nameStorage', function () {
    this.name = {
        first: 'Alice',
        last: 'Green',
        fullName: ''
    };
   
    // just to inimitate sevice change    
    // var self = this;   
    // setTimeout(function () {
    //     self.name.first = 'Bob';
    // });
})
.component('firctComponentService', {
    templateUrl: "firctComponent.html",
    bindings: {
        text: '@' 
    },
    controller: function userController($scope, nameStorage) {    
        $scope.name = nameStorage.name;
        nameStorage.name.fullName = nameStorage.name.first + " " + nameStorage.name.last;

        $scope.$watch('[name.first, name.last]', function() {
            nameStorage.name.fullName = nameStorage.name.first + " " + nameStorage.name.last;
        });

        $scope.double = function() {
            // nameStorage.name.first = nameStorage.name.first + " " + nameStorage.name.first;
            // nameStorage.name.last = nameStorage.name.last + " " + nameStorage.name.last;
            nameStorage.name.fullName = nameStorage.name.fullName + " " + nameStorage.name.first + " " + nameStorage.name.last;
        }
        $scope.back = function() {
            nameStorage.name.first = "Alice";
            nameStorage.name.last = "Green";
            nameStorage.name.fullName = nameStorage.name.first + " " + nameStorage.name.last;
        }
    }
})
.component('lastComponentService', {
    templateUrl: "lastComponent.html",
    controller: function userController($scope, nameStorage) {    
        $scope.name = nameStorage.name;

        // $scope.fullName = nameStorage.name.first + " " + nameStorage.name.last;
        // $scope.$watch('name.first', function() {
        //     $scope.fullName = nameStorage.name.first + " " + nameStorage.name.last;
        // });
    }
});

app.component('firctComponentEvent', {
    templateUrl: "firctComponentClick.html",
    bindings: {
        text: '@' 
    },
    controller: function userController($rootScope, $scope) {
        $scope.plus = function() {
            $rootScope.$emit('rootScope:emit', 'Еще больше ');
        }
    }
})
.component('lastComponentEvent', {
    templateUrl: "lastComponentClick.html",
    controller: function userController($rootScope, $scope) {  
        $scope.human = "Нас много ";  
        $rootScope.$on('rootScope:emit', function (event, data) {
            $scope.human =  $scope.human + data;
        });
    }
});



// app.controller('ParentCtrl', function ParentCtrl ($scope) {
// $scope.$on('rootScope:broadcast', function (event, data) {
//   console.log("ParentCtrl" + data); // 'Some data'
// });
// })
// .controller('SiblingOneCtrl', function SiblingOneCtrl ($rootScope) {
// $rootScope.$on('rootScope:emit', function (event, data) {
//   console.log("SiblingOneCtrl"+data); // 'Emit!'
// });
// $rootScope.$on('rootScope:broadcast', function (event, data) {
//   console.log("SiblingOneCtrl"+data); // 'Broadcast!'
// });
// })
// .controller('SiblingTwoCtrl', function SiblingTwoCtrl ($rootScope) {
//   $rootScope.$on('rootScope:emit', function (event, data) {
//     console.log("SiblingTwoCtrl"+data); // 'Emit!'
//   });
//  $rootScope.$on('rootScope:broadcast', function (event, data) {
//     console.log("SiblingTwoCtrl"+data); // 'Broadcast!'
//   });
// })
// .controller('ChildCtrl', function ChildCtrl ($rootScope) {
//   $rootScope.$emit('rootScope:emit', 'Emit!'); // $rootScope.$on
//   $rootScope.$broadcast('rootScope:broadcast', 'Broadcast'); // $rootScope.$on && $scope.$on
// });     


// app.service('nStorage', function () {
//     var _name = 'Bob';
//     return {
//         setName: function (name) {
//             _name = name;
//         },
//         getName: function () {
//             console.log("s");
//             return _name;
//         }
//     }
// })
// .component('firctComponentClick', {
//     templateUrl: "firctComponentClick.html",
//     bindings: {
//         text: '@' 
//     },
//     controller: function userController($scope, nStorage) {  
//         $scope.name = "as"  
//         $scope.newN = function() {
//             nStorage.setName('Alice'); 
//             $scope.name = nStorage.getName();
//         //     let el = document.createElement('p')
//         //     el.innerHTML =  $scope.name;
//         //    document.querySelectorAll(".communicat-component")[3].appendChild(el);
//         }
//     }
// })
// .component('lastComponentClick', {
//     templateUrl: "lastComponentClick.html",
//     controller: function userController($scope, nStorage, $timeout) {    
//         $scope.name = nStorage.getName();
//         $scope.$watch('name', function() {
            
//               console.log($scope.name);
            
//           });
//         var tiem1 = $timeout(function(){
//             $scope.name = nStorage.getName();
//             alert($scope.name + " $timeout");
//         }, 10000);
        
//     }
// });
