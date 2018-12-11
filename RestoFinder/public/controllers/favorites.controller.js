(function () {
    angular
        .module("RestoFinder")
        .controller("FavoritesController", function ($rootScope, $scope, $routeParams, UserService, RestaurantService, LoginService, $q) {
            const userId = $routeParams.userId;
            $scope.userId = userId;
            UserService.getUser(userId)
                .then(function (response) {
                    console.log(response.data);
                    $scope.username = response.data.user.username;
                });
            UserService.getFavorites(userId)
                .then(function (response) {
                    populateRestaurants = [];
                    $q.all(
                        extractRestaurants(
                            response.data,
                            populateRestaurants
                        )
                    ).then(
                        function(response) {
                            $scope.favorites = angular.copy(populateRestaurants);
                        },
                        function(err) {
                            console.log(err);
                        }
                    );
                })
            $scope.removeFavorite = function removeFavorite(favId, index) {
                UserService.deleteFavorite(userId, favId)
                    .then(function (response) {
                        $scope.favorites.splice(index, 1)
                    }, function (err) {
                        alert("There has been an error in removing the favorite.\nError: " + err.data)
                    });
            }

            function extractRestaurants(restaurantsArray, populatedRestaurants) {
                promises = [];
                for (restaurant of restaurantsArray) {
                    let promise = RestaurantService.getRestaurant(restaurant);
                    promise.then(
                        function(response) {
                            populatedRestaurants.push(response.data);
                        },
                        function(err) {
                            console.log(err);
                        }
                    );
                    promises.push(promise);
                }
                return promises;
            }
        });
})();
