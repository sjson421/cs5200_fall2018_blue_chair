(function () {
    angular
        .module("RestoFinder")
        .controller("RegisterController", function ($rootScope, $scope, $location, UserService) {
            $scope.button = "Type";
            $scope.types = [
                "User", "Critic", "Owner", "Advertiser", "Admin"
            ];

            $scope.change = function(type){
                $scope.button = type;
            }

            UserService.addUser()
        });
})();
