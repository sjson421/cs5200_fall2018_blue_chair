(function () {
    angular
        .module("RestoFinder")
        .controller("HeaderController", function ($rootScope, $scope, $http, $location, RestaurantService, LoginService) {
          
            // $scope.getCurrentLoggedInUser = getCurrentLoggedInUser();
            $scope.logout = logout; 
            $scope.goToProfile = goToProfile;
            // function getCurrentLoggedInUser(){
            //     $scope.currentUser = LoginService.getCookieData()
            //     console.log("current user is", $scope.currentUser);
            // }

            function logout(){
                LoginService.logout();
                $rootScope.currentUser = null;
                $location.path("/")

            }

            function goToProfile() {
                // body
                console.log("in header go to profile")
                let user = JSON.parse(LoginService.getCookieData())
                $location.url("/user/" + user._id);
            }
            
        });
})();
