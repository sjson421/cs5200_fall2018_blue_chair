(function () {
    angular
        .module("RestoFinder")
        .factory("UserService", userService);

    function userService($http) {
        var baseUrl = "http://restofinder.rishabmalik.info/api/user";
        var api = {
            getAllUsers: getAllUsers,
            getUser: getUser,
            updateUser: updateUser,
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
            updateFavorite: updateFavorite,
            removeUser: removeUser,
            getOwnerRestaurant: getOwnerRestaurant,
            deleteOwnerRestaurant: deleteOwnerRestaurant,
            getAdvertisementsForUser: getAdvertisementsForUser,
            getEventsForUser: getEventsForUser
        };
        return api;

        function getAllUsers() {
            return $http.get(baseUrl);
        }

        function getUser(id) {
            return $http.get(baseUrl + "/" + id);
        }

        function updateUser(id, user) {
            return $http.put(baseUrl + "/update/" + id, user);
        }

        function register(user) {
            return $http.post(baseUrl + "/register", user);
        }

        function getReviews(id) {
            return $http.get(baseUrl + "/" + id + "/reviews")
        }

        function getFollows(id) {
            return $http.get(baseUrl + "/" + id + "/follows");
        }

        function getFollowedBy(id) {
            return $http.get(baseUrl + "/" + id + "/followedBy");
        }

        function getEndorses(id) {
            // no API
            return $http.get(baseUrl + "/" + id + "/endorses");
        }

        function getEndorsedBy(id) {
            // no API
            return $http.get(baseUrl + "/" + id + "/endorsedBy");
        }

        // userId1 follows userId2
        function createFollow(userId1, userId2) {
            return $http.post(baseUrl + "/" + userId1 + "/" + "follow/" + userId2);
        }

        function createEndorse(userId1, userId2) {
            return $http.post(baseUrl + "/" + userId1 + "/" + "endorse/" + userId2);
        }

        function getFavorites(id) {
            // No API
            return $http.get(baseUrl + "/" + id + "/favorites");
        }

        function createFavorite(userId, restaurantId) {
            // No API
            return $http.post(baseUrl + "/" + userId + "/favorites/" + restaurantId);
        }

        async function updateFavorite(userId, restaurantId, temp) {
            await deleteFavorite(userId, temp);
            return createFavorite(userId, restaurantId);


        }

        function getOwnerRestaurant(userId) {
            // ??
            return $http.get(baseUrl + "/getowned/" + userId);
        }

        function createOwnerRestaurant(userId, restaurantId) {
            return $http.post(baseUrl + "/" + userId + "/owns/" + restaurantId);
        }

        function deleteFollow(userId1, userId2) {
            return $http.post(baseUrl + "/" + userId1 + "/" + "unfollow/" + userId2);
        }

        function deleteEndorse(userId1, userId2) {
            return $http.post(baseUrl + "/" + userId1 + "/" + "unendorse/" + userId2);
        }

        function deleteFavorite(userId, restaurantId) {
            return $http.post(baseUrl + "/" + userId + "/" + "unfavorites/" + restaurantId);
        }

        function deleteOwnerRestaurant(userId, restaurantId) {
            return $http.post(baseUrl + "/" + userId + "/disown/" + restaurantId);
        }

        // No API
        function removeUser(id) {
            return $http.delete(baseUrl + "/" + id);
        }

        // get Advertisements for user
        function getAdvertisementsForUser(userId) {
            return $http.get(baseUrl + "/getads/" + userId);
        }

        function getEventsForUser(id) {
            return $http.get(baseUrl + "/" + id + "/events");
        }
    }
})();