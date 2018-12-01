
(function () {
    angular
        .module("RestoFinder")
        .controller("HomeController", function ($rootScope, $scope, $http) {
            $scope.testvar = "Angular Working";
            var data = "/restaurant";

            $http.get(data)
                .then(function (response) {
                    alert(response.data);
                },function (response) {
                    alert('failure');
                });
        });
})();
  