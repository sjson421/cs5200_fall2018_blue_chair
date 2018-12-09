(function () {
    angular
        .module("RestoFinder")
        .controller("CreateReviewController", function ($rootScope, $scope, $window, UserService, LoginService) {
            $scope.loggedUser = JSON.parse(LoginService.getCookieData());
            console.log("loggedUser is", $scope.loggedUser.username);

            var date = new Date();
            $scope.curDate = date.getFullYear() + '-' + ('0' + (date.getMonth() + 1)).slice(-2) + '-' + ('0' + date.getDate()).slice(-2);

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

                    credit_card_number: $scope.credit_card_number,
                    cardType: $scope.cardType,
                    cvv: $scope.cvv
                };
                console.log("user getting post is", user);
                UserService.register(user)
                    .then(function (response) {
                        alert("Registration successful!");
                        $window.location.href = '/';
                    }, function (err) {
                        if (err.data.password == 'Passwords do not match') {
                            alert("Passwords do not match");
                        }
                    });
            };
        });
})();
