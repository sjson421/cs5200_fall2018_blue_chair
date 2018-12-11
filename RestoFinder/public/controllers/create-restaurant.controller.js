(function () {
    angular
        .module("RestoFinder")
        .controller("CreateRestaurantController", function ($rootScope, $scope, $window, RestaurantService) {
            $scope.prices = [
                "$", "$$", "$$$", "$$$$", "$$$$$"
            ];
            $scope.create = function () {
                var restaurant = {
                    id: "",
                    name: $scope.name,
                    is_claimed: false,
                    location: {
                        address1: $scope.address,
                        address2: $scope.address2,
                        city: $scope.city,
                        state: $scope.state,
                        zip_code: $scope.zip,
                        country: $scope.country,
                        display_address: undefined,
                        cross_streets: ""
                    },
                    phone: $scope.phone,
                    url: "",
                    price: $scope.price,
                    rating: 0,
                    review_count: 0,
                    is_closed: false,
                    image_url: "",
                    hours: undefined,
                    photos: undefined,
                    categories: undefined
                };
                RestaurantService.createRestaurant(restaurant)
                    .then(function (response) {
                        alert("Restaurant creation successful!");
                        $window.location.href = '/';
                    }, function (err) {
                        alert("There has been an error in restaurant creation! " + err);
                    });
            };
        });
})();
