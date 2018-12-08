(function () {
    angular
        .module("RestoFinder")
        .factory("RestaurantService", restaurantService);

    function restaurantService($http) {
        var baseUrl = "http://localhost:5000/api/restaurant"
        var api = {
            getFeaturedRestaurants: getFeaturedRestaurants,
            getAllRestaurants: getAllRestaurants,
            getRestaurant: getRestaurant
        };
        return api;
        function getFeaturedRestaurants(){
            url = "http://localhost:5000/api/featured";
            return $http.get(url);
        }
        
        function getAllRestaurants(){
            return $http.get(baseUrl);
        }

        function getRestaurant(id){
            return $http.get(baseUrl +"/" + id);
        }

    }
})();