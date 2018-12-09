(function () {
    angular
        .module("RestoFinder")
        .controller("AdminController", function ($rootScope, $scope, UserService) {
            $scope.isVisibleUsers = false;
            $scope.showHideUsers = function () {
                $scope.isVisibleUsers = $scope.isVisibleUsers ? false : true;
            };

            $scope.isVisibleReviews = false;
            $scope.showHideReviews = function () {
                $scope.isVisibleReviews = $scope.isVisibleReviews ? false : true;
            };

            $scope.isVisibleRestaurants = false;
            $scope.showHideRestaurants = function () {
                $scope.isVisibleRestaurants = $scope.isVisibleRestaurants ? false : true;
            };

            UserService.getAllUsers()
                .then(function(response) {
                    $scope.users = response.data;
                });
        });
})();
