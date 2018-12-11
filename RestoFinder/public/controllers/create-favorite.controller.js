(function () {
    angular
        .module("RestoFinder")
        .controller("CreateFavoriteController", function ($rootScope, $scope, $window, $routeParams, RestaurantService, UserService) {
            const userId = $routeParams.userId;

            UserService.getUser(userId)
                .then(function (response) {
                    $scope.username = response.data.user.username;
                });
            RestaurantService.getAllRestaurants()
                .then(function(response) {
                    $scope.allRestaurants = response.data;
                });

            $scope.createFavorite = function () {
                const string = $scope.restaurant;
                const res = string.split(" ");
                const restaurantId = res[1];
                UserService.createFavorite(userId, restaurantId)
                    .then(
                        function (response) {
                            alert("Favorite successfully created!")
                        },
                        function (err) {
                            console.log(err);
                        }
                    )
            };
        });
})();
