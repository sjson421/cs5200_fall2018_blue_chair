(function () {
    angular
        .module("RestoFinder")
        .factory("RestaurantService", restaurantService);

    function restaurantService($http) {
        var baseUrl = "https://restofinder.tejasparab1.com/api/restaurant"
        var api = {
            getFeaturedRestaurants: getFeaturedRestaurants,
            getAllRestaurants: getAllRestaurants,
            getRestaurant: getRestaurant,
            getReviewsForRestaurant: getReviewsForRestaurant,
            removeRestaurant: removeRestaurant,
            createRestaurant: createRestaurant,
            updateRestaurant: updateRestaurant
        };
        return api;

        function getFeaturedRestaurants() {
            url = "https://restofinder.tejasparab1.com/api/featured";
            return $http.get(url);
        }

        function getAllRestaurants() {
            return $http.get(baseUrl);
        }

        function getRestaurant(id) {
            return $http.get(baseUrl + "/" + id);
        }

        function getReviewsForRestaurant(id) {
            return $http.get(baseUrl + "/" + id + "/" + "review");
        }

        function removeRestaurant(id) {
            return $http.delete(baseUrl + "/" + id);
        }
        function createRestaurant(restaurant) {
            return $http.post(baseUrl, restaurant);
        }
        function updateRestaurant(id, restaurant) {
            return $http.put(baseUrl + "/" + id, restaurant);
        }
    }
})();