(function () {
    angular
        .module("RestoFinder")
        .factory("SearchService", searchService);

    function searchService($http) {

        var api = {
            getSearchRestaurants: getSearchRestaurants,
            getSearchUsers: getSearchUsers
        };
        return api;
        function getSearchRestaurants(term){
            url = "https://restofinder.tejasparab1.com/api/restaurant/search/" + term;
            return $http.get(url);
        }

        function getSearchUsers(term){
            url = "https://restofinder.tejasparab1.com/api/user/search/" + term;
            return $http.get(url);
        }
        

    }
})();