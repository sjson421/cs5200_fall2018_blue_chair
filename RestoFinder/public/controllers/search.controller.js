(function () {
    angular
        .module("RestoFinder")
        .controller("SearchController", function ($rootScope, $scope, $http) {
            var data = "http://localhost:5000/api/restaurant";

            $http.get(data)
                .then(function (response) {
                    alert(response);
                }, function (err) {
                    alert('failure getting data');
                });
        });
})();
