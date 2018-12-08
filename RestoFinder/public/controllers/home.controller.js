(function () {
    angular
        .module("RestoFinder")
        .controller("HomeController", function ($rootScope, $scope, $http, $location, RestaurantService) {
            $scope.search = "";
            $scope.getFeaturedRestaurants = getFeaturedResults();
            $scope.getSearchResults = function(){
                $rootScope.search = $scope.search;
                $location.url("/search");         
            }
            function getFeaturedResults(){
                // body
                console.log("function called");
                RestaurantService.getFeaturedRestaurants()
                    .then(function(response){
                        $scope.featuredRestaurants = response.data;
                        console.log("featuredRestaurants", $scope.featuredRestaurants);
                    },function(err){
                        console.log(err);
                    });
            }
            
        });
})();
