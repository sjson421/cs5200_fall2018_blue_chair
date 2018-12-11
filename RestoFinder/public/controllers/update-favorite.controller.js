(function () {
    angular
        .module("RestoFinder")
        .controller("UpdateFavoriteController", function ($rootScope, $scope, $window, $routeParams, RestaurantService, UserService) {
            const userId = $routeParams.userId;
            const temp = $routeParams.restaurantId;

            UserService.getUser(userId)
                .then(function (response) {
                    $scope.username = response.data.user.username;
                });
            RestaurantService.getAllRestaurants()
                .then(function(response) {
                    $scope.allRestaurants = response.data;
                });

            $scope.updateFavorite = function () {
                const string = $scope.restaurant;
                const res = string.split(" ");
                const restaurantId = res[1];
                console.log(temp);
                console.log(restaurantId);
                UserService.updateFavorite(userId, restaurantId, temp)
                    .then(
                        function (response) {
                            alert("Favorite successfully updated!")
                        },
                        function (err) {
                            console.log(err);
                        }
                    )
            };
        });
})();
