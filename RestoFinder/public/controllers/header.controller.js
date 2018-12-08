(function () {
    angular
        .module("RestoFinder")
        .controller("HeaderController", function ($rootScope, $scope, $http, $location, RestaurantService, LoginService) {
          
            // $scope.getCurrentLoggedInUser = getCurrentLoggedInUser();
            $scope.logout = logout; 

            // function getCurrentLoggedInUser(){
            //     $scope.currentUser = LoginService.getCookieData()
            //     console.log("current user is", $scope.currentUser);
            // }

            function logout(){
                LoginService.logout();
                $rootScope.currentUser = null;
                $location.path("/")

            }
            
        });
})();
