(function () {
    angular
        .module("RestoFinder")
        .controller("AdminController", function ($rootScope, $scope, UserService, ReviewService, RestaurantService, LoginService) {

            var loggedUser = JSON.parse(LoginService.getCookieData());
            $scope.userType = loggedUser.userType;

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
            ReviewService.getAllReviews()
                .then(function(response) {
                    $scope.reviews = response.data;
                });
            RestaurantService.getAllRestaurants()
                .then(function(response) {
                    $scope.restaurants = response.data;
                });

            $scope.removeUser = function removeUser(id, index) {
                UserService.removeUser(id)
                    .then(function(response) {
                        $scope.users.splice(index, 1)
                    },function(err) {
                        alert("There has been an error in removing the user.\nError: " + err.message)
                    });
            }
            $scope.removeReview = function removeReview(id, index) {
                ReviewService.removeReview(id)
                    .then(function(response) {
                        $scope.reviews.splice(index, 1)
                    },function(err) {
                        alert("There has been an error in removing the review.\nError: " + err.message)
                    });
            }
            $scope.removeRestaurant = function removeRestaurant(id, index) {
                RestaurantService.removeRestaurant(id)
                    .then(function(response) {
                        $scope.restaurants.splice(index, 1)
                    },function(err) {
                        alert("There has been an error in removing the restaurant.\nError: " + err.message)
                    });
            }
        });
})();
