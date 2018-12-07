(function () {
    angular
        .module("RestoFinder")
        .controller("SearchController", function ($rootScope, $scope, $http, SearchService) {
            $scope.getRestaurants = getRestaurants();
            $scope.viewRestaurant = viewRestaurant;
            function getRestaurants(){
                SearchService.getSearchRestaurants($rootScope.search)
                .then(function(response){
                    console.log("response is", response);
                    $scope.restaurants = response.data;
                },function(err) {
                    console.log(err);
                })
                
            }

            function viewRestaurant(restaurant){
                console.log("restaurant passed is", restaurant);
            }
        });
})();
