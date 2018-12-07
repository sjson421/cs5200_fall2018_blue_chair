(function () {
    angular
        .module("RestoFinder")
        .factory("SearchService", searchService);

    function searchService($http) {

        var api = {
            getSearchRestaurants: getSearchRestaurants
        };
        return api;
        function getSearchRestaurants(term){
            url = "http://localhost:5000/api/restaurant/search/" + term
            return $http.get(url);
        }
        

    }
})();