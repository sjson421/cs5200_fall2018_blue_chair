(function () {
    angular
        .module("RestoFinder")
        .factory("ReviewService", reviewService);

    function reviewService($http) {
        var baseUrl = "http://localhost:5000/api/review"
        var api = {
            getAllReviews: getAllReviews,
            getReview: getReview,
            removeReview: removeReview
        };
        return api;

        function getAllReviews() {
            return $http.get(baseUrl);
        }

        function getReview(id) {
            return $http.get(baseUrl + "/" + id);
        }

        function removeReview(id) {
            return $http.delete(baseUrl + "/" + id);
        }
    }
})();