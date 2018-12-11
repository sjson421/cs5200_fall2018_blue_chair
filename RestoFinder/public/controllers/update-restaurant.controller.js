(function () {
    angular
        .module("RestoFinder")
        .controller("UpdateRestaurantController", function ($rootScope, $scope, $window, $routeParams, RestaurantService) {
            $scope.prices = [
                "$", "$$", "$$$", "$$$$", "$$$$$"
            ];

            let id = $routeParams.restaurantId;
            RestaurantService.getRestaurant(id)
                .then(function(response) {
                    restaurant = response.data[0];
                    $scope.name = restaurant.name;
                    if (restaurant.location) {
                        $scope.address = restaurant.location.address1;
                        $scope.address2 = restaurant.location.address2;
                        $scope.city = restaurant.location.city;
                        $scope.state = restaurant.location.state;
                        $scope.zip = restaurant.location.zip_code;
                        $scope.country = restaurant.location.country;
                    }
                    $scope.phone = restaurant.phone;
                    $scope.price = restaurant.price;
                });

            $scope.update = function () {
                var restaurant = {
                    name: $scope.name,
                    location: {
                        address1: $scope.address,
                        address2: $scope.address2,
                        city: $scope.city,
                        state: $scope.state,
                        zip_code: $scope.zip,
                        country: $scope.country
                    },
                    phone: $scope.phone,
                    price: $scope.price
                };
                RestaurantService.updateRestaurant(restaurant)
                    .then(function (response) {
                        alert("Restaurant update successful!");
                        $window.location.href = '/';
                    }, function (err) {
                        alert("There has been an error in restaurant update! " + err);
                    });
            };
        });
})();
