(function () {
    angular
        .module("RestoFinder")
        .factory("UserService", userService);

    function userService($http) {
        var baseUrl = "http://localhost:5000/api/user";
        var api = {
            getAllUsers: getAllUsers,
            getUser: getUser,
            setUser: setUser,
            register: register,
            getReviews: getReviews,
            getFollows: getFollows,
            getFollowedBy: getFollowedBy,
            getEndorses: getEndorses,
            getEndorsedBy: getEndorsedBy,
            getFavorites: getFavorites,
            createEndorse: createEndorse,
            createFavorite: createFavorite,
            createFollow: createFollow,
            createOwnerRestaurant: createOwnerRestaurant,
            deleteEndorse: deleteEndorse,
            deleteFavorite: deleteFavorite,
            deleteFollow: deleteFollow,
            removeUser: removeUser
        };
        return api;

        function getAllUsers(){
            return $http.get(baseUrl);
        }

        function getUser(id){
            return $http.get(baseUrl +"/" + id);
        }

        function setUser(id, user) {

        }
        function register(user) {
            return $http.post(baseUrl + "/register", user);
        }

        function getReviews(id){
            return $http.get(baseUrl + "/" + id + "/reviews")
        }

        function getFollows(id){
            return $http.get(baseUrl + "/" + id + "/follows");
        }

        function getFollowedBy(id){
            return $http.get(baseUrl + "/" + id + "/followedBy");   
        }
        function getEndorses(id){
            // no API
            return $http.get(baseUrl + "/" + id + "/endorses");
        }
        function getEndorsedBy(id){
            // no API
            return $http.get(baseUrl + "/" + id + "/endorsedBy");   
        }
        // userId1 follows userId2
        function createFollow(userId1, userId2){
            return $http.post(baseUrl + "/" + userId1 + "/" + "follow/" + userId2);
        }
        function createEndorse(userId1, userId2){
            return $http.post(baseUrl + "/" + userId1 + "/" + "endorse/" + userId2);
        }
        function getFavorites(id){
            // No API
            return $http.get(baseUrl + "/" + id + "/favorites");
        }
        function createFavorite(userId, restaurantId){
            // No API
            return $http.post(baseUrl + "/" + userId + "/favorites/" + restaurantId);
        }
        function getOwnerRestaurant(userId){
            // ??
        }
        function createOwnerRestaurant(userId,restaurantId){
            // ??
        }
        function deleteFollow(userId1, userId2){
            return $http.post(baseUrl + "/" + userId1 + "/" + "unfollow/" + userId2);
        }
        function deleteEndorse(userId1, userId2){
            return $http.post(baseUrl + "/" + userId1 + "/" + "endorse/" + userId2);
        }
        function deleteFavorite(userId, restaurantId){
            return $http.post(baseUrl + "/" + userId + "/" + "unfavorites/" + restaurantId);
        }
            // No API
        function removeUser(id) {
            return $http.delete(baseUrl + "/" + id);
        }
    }
})();