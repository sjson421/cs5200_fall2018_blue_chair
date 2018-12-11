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

                    $scope.company = user.name;
                    $scope.position = user.position;

                    $scope.creditCardNumber = user.credit_card_number;
                    $scope.cardType = user.cardType;
                    $scope.cvv = user.cvv;
                });
            $scope.register = function () {
                if (!$scope.picture) {
                    $scope.picture = "https://i.stack.imgur.com/34AD2.jpg";
                }
                var user = {
                    username: $scope.username,
                    email: $scope.email,
                    password: $scope.password,
                    confirmpassword: $scope.confirmPassword,
                    streetaddress: $scope.address,
                    streetaddress2: $scope.address2,
                    city: $scope.city,
                    state: $scope.state,
                    country: $scope.country,
                    zipcode: $scope.zip,
                    phone: $scope.phone,
                    picture: $scope.picture,
                    userType: $scope.type,

                    name: $scope.company,
                    position: $scope.position,

                    credit_card_number: $scope.creditCardNumber,
                    cardType: $scope.cardType,
                    cvv: $scope.cvv
                };
                UserService.updateUser(id, user)
                    .then(function (response) {
                        alert("Update successful!");
                        $window.location.href = '/';
                    }, function (err) {
                        alert(err.data.toString());
                    });
            };
        });
})();
