(function(){
    angular
        .module("RestoFinder")
        .config(configuration);

    function configuration($routeProvider, $locationProvider, $httpProvider) {
        $httpProvider.defaults.headers.post['Content-Type'] = 'application/json;charset=utf-8';
        $httpProvider.defaults.headers.put['Content-Type'] = 'application/json;charset=utf-8';

        $httpProvider.defaults.headers.post['Access-Control-Allow-Origin'] = '*';
        $httpProvider.defaults.headers.post['Access-Control-Allow-Credentials'] = 'true';


        $routeProvider
            .when("/", {
                templateUrl: "./views/home.view.html",
                controller: "HomeController"
            })
            .when("/search", {
                templateUrl: "./views/search.view.html",
                controller: "SearchController"
            })
            .when("/login", {
                templateUrl: "./views/login.view.html",
                controller: "LoginController"
            })
            .when("/register", {
                templateUrl: "./views/register.view.html",
                controller: "RegisterController"
            })
            .when("/user", {
                templateUrl: "./views/user.view.html",
                controller: "UserController"
            })
            .when("/restaurant", {
                templateUrl: "./views/restaurant.view.html",
                controller: "RestaurantController"
            })
            .when("/admin", {
                templateUrl: "./views/admin.view.html",
                controller: "AdminController"
            })
    }

})();