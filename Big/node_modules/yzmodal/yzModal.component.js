
angular.
module('yzModal').
directive('yzModal', function () {
    return {
        restrict: 'E',
        transclude: true,
        scope:{
            header:'@',
            btnText:'@'
        },
        templateUrl: '../yzModal.template.html',
        link: function (scope, element, attrs, ctrl, transclude) {
            transclude(scope, function (clone, scope) {

            });
        }
    }
});