(function () {
    angular
        .module("RestoFinder")
        .controller("RestaurantController", function ($rootScope, $scope, $location, $routeParams, RestaurantService) {
            console.log("routeParams", $routeParams);
            $scope.getRestaurant = getRestaurant();

            function getRestaurant(){   
                RestaurantService.getRestaurant($routeParams.restaurantId)
                    .then(function(response){
                        $scope.restaurant = response.data[0];
                        console.log(response.data);
                    },function(err){

                    });
            }

        });
})();
