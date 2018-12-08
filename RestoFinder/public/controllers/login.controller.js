// <!--referenced from Jason Watmore-->
(function () {
    'use strict';

    angular
        .module('RestoFinder')
        .controller('LoginController', LoginController);

    function LoginController($location, LoginService, FlashService, $scope, $rootScope) {
        var vm = $scope;
        vm.login = login;
        vm.username = "";
        vm.password = "";
        (function initController() {
            // reset login status
            LoginService.clearCookieData();
        })();

        function login() {
            console.log("in login");
            vm.dataLoading = true;
            LoginService.login(vm.username, vm.password)
            .then(function (response){
                console.log("user", response.data._id);
                LoginService.setCookieData(JSON.stringify(response.data));
                $rootScope.currentUser = LoginService.getCookieData(); 
                $location.path('/');
            }, function (err) {
                console.log(err);
                FlashService.createFailFlash(err.message);
            });
            
        };
    }

})();