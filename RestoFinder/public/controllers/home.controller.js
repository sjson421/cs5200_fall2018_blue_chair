(function () {
    angular
        .module("RestoFinder")
        .controller("HomeController", function ($rootScope, $scope, $http) {
            $scope.testvar = "Angular Working";
            var data = "http://localhost:5000/api/restaurant";

            $http.get(data)
                .then(function (response) {
                    alert(response);
                }, function (err) {
                    alert("error code " + err.status);
                });
        });
})();
