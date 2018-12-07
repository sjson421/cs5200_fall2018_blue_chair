(function () {
    angular
        .module("RestoFinder")
        .controller("HomeController", function ($rootScope, $scope, $http, $location) {
            $scope.testvar = "Angular Working";
            var data = "http://localhost:5000/api/restaurant";
            $scope.search = "";
            $http.get(data)
                .then(function (response) {
                }, function (err) {
                });

            $scope.getSearchResults = function(){
                $rootScope.search = $scope.search;
                $location.url("/search");         
            }
        });
})();
