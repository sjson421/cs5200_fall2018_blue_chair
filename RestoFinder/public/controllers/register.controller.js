(function () {
    angular
        .module("RestoFinder")
        .controller("RegisterController", function ($rootScope, $scope, $location, UserService) {
            $scope.button = "Type";
            $scope.types = [
                "User", "Critic", "Owner", "Advertiser", "Admin"
            ];

            $scope.change = function (type) {
                $scope.button = type;
                $scope.type = type;
            }

            var user = {
                username: $scope.username,
                email: $scope.email,
                password: $scope.password,
                address: $scope.address,
                address2: $scope.address2,
                city: $scope.city,
                state: $scope.state,
                country: $scope.country,
                zip: $scope.zip,
                phone: $scope.phone,
                type: $scope.type
            };

            UserService.register(user);
        });
})();
