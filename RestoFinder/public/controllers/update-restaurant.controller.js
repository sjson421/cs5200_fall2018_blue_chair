(function () {
    angular
        .module("RestoFinder")
        .controller("UpdateRestaurantController", function ($rootScope, $scope, $window, $routeParams, RestaurantService) {
            $scope.prices = [
                "$", "$$", "$$$", "$$$$", "$$$$$"
            ];

            let id = $routeParams.restaurantId;
            RestaurantService.getRestaurant(id)
                .then(function (response) {
                    restaurant = response.data[0];
                    $scope.id = restaurant.id;
                    $scope.name = restaurant.name;
                    $scope.is_claimed = restaurant.is_claimed;
                    if (restaurant.location) {
                        $scope.address = restaurant.location.address1;
                        $scope.address2 = restaurant.location.address2;
                        $scope.city = restaurant.location.city;
                        $scope.state = restaurant.location.state;
                        $scope.zip = restaurant.location.zip_code;
                        $scope.country = restaurant.location.country;
                        $scope.display_address = restaurant.location.display_address;
                        $scope.cross_streets = restaurant.location.cross_streets;
                    }
                    $scope.phone = restaurant.phone;
                    $scope.url = restaurant.url;
                    $scope.price = restaurant.price;
                    $scope.rating = restaurant.rating;
                    $scope.review_count = restaurant.review_count;
                    $scope.is_closed = restaurant.is_closed;
                    $scope.image_url = restaurant.image_url;
                    $scope.hours = restaurant.hours;
                    $scope.photos = restaurant.photos;
                    $scope.categories = restaurant.categories;
                });

            $scope.update = function () {
                var restaurant = {
                    id: $scope.id,
                    name: $scope.name,
                    is_claimed: $scope.is_claimed,
                    location: {
                        address1: $scope.address,
                        address2: $scope.address2,
                        city: $scope.city,
                        state: $scope.state,
                        zip_code: $scope.zip,
                        country: $scope.country,
                        display_address: $scope.display_address,
                        cross_streets: $scope.cross_streets
                    },
                    phone: $scope.phone,
                    url: $scope.url,
                    price: $scope.price,
                    rating: $scope.rating,
                    review_count: $scope.review_count,
                    is_closed: $scope.is_closed,
                    image_url: $scope.image_url,
                    hours: $scope.hours,
                    photos: $scope.photos,
                    categories: $scope.categories
                };
                console.log(restaurant);
                RestaurantService.updateRestaurant(id, restaurant)
                    .then(function (response) {
                        alert("Restaurant update successful!");
                        $window.location.href = '/';
                    }, function (err) {
                        alert("There has been an error in restaurant update! " + err);
                    });
            };
        });
})();
