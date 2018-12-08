(function () {
    angular
        .module("RestoFinder")
        .factory("RestaurantService", restaurantService);

    function restaurantService($http) {
        var baseUrl = "http://localhost:5000/api/restaurant"
        var api = {
            getFeaturedRestaurants: getFeaturedRestaurants,
            getAllRestaurants: getAllRestaurants
        };
        return api;
        function getFeaturedRestaurants(){
            url = "http://localhost:5000/api/featured";
            return $http.get(url);
        }
        
        function getAllRestaurants(){
            return $http.get(baseUrl);
        }

    }
})();