var app = angular.module('filt', []);

angular.
  module('filt').
  filter('checkFilter', function() {
    return function(input) {
      return input ? input + '\u2713' : input + '\u2718';
    };
  })
  .filter('newFilter', function() {
    return function(content) {
        return content*content;
    };
  });