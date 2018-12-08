(function () {
    angular
        .module("RestoFinder")
        .factory("UserService", userService);

    function userService($http) {
        var baseUrl = "http://localhost:5000/api/user"
        var api = {
            getAllUsers: getAllUsers,
            getUser: getUser
        };
        return api;

        function getAllUsers(){
            return $http.get(baseUrl);
        }

        function getUser(id){
            return $http.get(baseUrl +"/" + id);
        }

        function setUser(id) {

        }
        function addUser() {

        }
    }
})();