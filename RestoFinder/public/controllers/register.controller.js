// <!--referenced from Jason Watmore-->
(function () {
    'use strict';

    angular
        .module('RestoFinder')
        .controller('RegisterController', RegisterController);

    RegisterController.$inject = ['UserService', '$location', '$rootScope', 'FlashService'];
    function RegisterController(UserService, $location, $rootScope, FlashService, $scope) {
        var vm = $scope;

        vm.register = register;

        vm.user = {
            firstName: "",
            lastName: "",
            // create user here
        }
        function register() {
            vm.dataLoading = true;
            UserService.Create(vm.user)
                .then(function (response) {
                    if (response.success) {
                        FlashService.Success('Registration successful', true);
                        $location.path('/login');
                    } else {
                        FlashService.Error(response.message);
                        vm.dataLoading = false;
                    }
                });
        }
    }

})();