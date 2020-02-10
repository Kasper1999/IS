let b = {
    val: 0
}

angular.
module('vs')
.controller('vsController', function($scope, $timeout) {
    $scope.a = 10;
    // var tiem1 = $timeout(function(){
    //     $scope.a ++;
    //     alert($scope.a + " $timeout");
    // }, 1000);
    // var tiem2 = setTimeout(function(){
    //     // $scope.$apply(function() {
    //         $scope.a ++;
    //         alert($scope.a + " setTimeout");
    //     // });
    // }, 3000);
    $scope.justClick = {
        s: b.val
    }
    $scope.angClick = 0;
    $scope.checkFunction = function(val) {
        // alert($scope.justClick +" "+ b.val);
        b.val = val;
        // $scope.justClick.s ++;
        // alert($scope.justClick +" "+ b.val);
      };
  })
.directive('vsModul', function () {
    return {
        restrict: 'E',
        transclude: true,
        templateUrl: 'vs.html',
        scope: {
            vsJustClick: "=just",
            vsAustClick: "=ang",
        }
    }
})
.controller('QuestionController', 
    function QuestionController($scope, $http){
        $http({method: 'GET', url: 'question.json'}).
            then(function success(response) {
                $scope.question=response.data.question;
        });
        $scope.voteUp = function (answer){
            answer.rate++;
        };
        $scope.voteDown = function (answer){
            answer.rate--;
        };
    }
);

function myFunction() {
    b.val ++;
    console.log("a "+ b.val);
};

function getUsers() {
    return new Promise(function (resolve, reject) {
        let xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function (state) {
            if (xhr.readyState == XMLHttpRequest.DONE) {
                console.log(xhr);
                resolve(JSON.parse(xhr.response))
            }
        }
        xhr.open("GET", '/getusers');
        xhr.send();
    })
};

function UseXhr() {
    getUsers().then(function (data) {
        for (let key in data) {
            console.log(data[key]);
        }
    });
}
    