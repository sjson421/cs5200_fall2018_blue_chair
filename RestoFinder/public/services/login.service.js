(function () {
    angular
        .module("RestoFinder")
        .factory("LoginService", loginService);

    function loginService($http, $cookies) {
       var user = null;
       var url  = "http://restofinder.rishabmalik.info/api/user/login"
        var api = {
           setCookieData: setCookieData,
           getCookieData: getCookieData,
           clearCookieData: clearCookieData,
           login: login,
           logout: logout
        };
        return api;
        function setCookieData(inUser) {
            user = inUser;
            $cookies.put("user", user);
        }
        function getCookieData () {
            user = $cookies.get("user");
            if(!user){
                return null;
            }
            return user;
        }
        function clearCookieData() {
            user = {};
            $cookies.remove("user");
        }
        function login(username, password){
            userCredentials = {
                username: username,
                password: password
            }
            return $http.post(url, userCredentials);
        }
        
        function logout(){
            user = {};
            $cookies.remove("user");
        }

    }
})();