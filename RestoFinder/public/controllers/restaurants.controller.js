(function () {
    angular
        .module("RestoFinder")
        .controller("RestaurantsController", function ($rootScope, $scope, $location, RestaurantService) {
            $scope.getAllRestaurants = getAllRestaurants();
            $scope.loading = true;
            function getAllRestaurants(){
                RestaurantService.getAllRestaurants()
                    .then(function(response){
                        
                        $scope.restaurants = response.data;
                        $scope.loading = false;
                    }, function(err){
                        console.log(err);
                    })
            }
        });
})();
