(function () {
    angular
        .module("RestoFinder")
        .controller("UpdateUserController", function ($rootScope, $scope, $window, $routeParams, UserService) {
            $scope.types = [
                "REGISTERED", "CRITIC", "OWNER", "ADVERTISER", "ADMIN"
            ];

            let id = $routeParams.userId;
            UserService.getUser(id)
                .then(function (response) {
                    user = response.data.user;
                    console.log(user);
                    $scope.username = user.username;
                    $scope.email = user.email;

                    $scope.password = user.password;
                    $scope.address = user.address.streetaddress;
                    $scope.address2 = user.address.streetaddress2;
                    $scope.city = user.address.city;
                    $scope.state = user.address.state;
                    $scope.country = user.address.country;
                    $scope.zip = user.address.zipcode;
                    $scope.phone = user.phone;
                    $scope.picture = user.picture;
                    $scope.type = user.userType;
                });
            $scope.updateUser = function () {
                if (!$scope.picture) {
                    $scope.picture = "https://i.stack.imgur.com/34AD2.jpg";
                }
                var user = {
                    username: $scope.username,
                    email: $scope.email,
                    password: $scope.password,
                    streetaddress: $scope.address,
                    streetaddress2: $scope.address2,
                    city: $scope.city,
                    state: $scope.state,
                    country: $scope.country,
                    zipcode: $scope.zip,
                    phone: $scope.phone,
                    picture: $scope.picture
                };
                UserService.updateUser(id, user)
                    .then(function (response) {
                        console.log(response);
                        alert("Update successful!");
                        // $window.location.href = '/';
                    }, function (err) {
                        alert(err.data);
                    });
            };
        });
})();
