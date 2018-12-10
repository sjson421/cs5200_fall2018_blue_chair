(function () {
    angular
        .module("RestoFinder")
        .controller("RestaurantsController", function ($rootScope, $scope, $location, RestaurantService) {
            $scope.getAllRestaurants = getAllRestaurants();
            $scope.loading = true;
            $scope.viewRestaurant = viewRestaurant;
            function getAllRestaurants(){
                RestaurantService.getAllRestaurants()
                    .then(function(response){
                        
                        $scope.restaurants = response.data;
                        $scope.loading = false;
                    }, function(err){
                        console.log(err);
                    })
            }

            function viewRestaurant(restaurant) {
                console.log("restaurant passed is", restaurant);
                let id = restaurant._id;
                $location.url("/restaurant/" + id);
              }
        });
})();
