(function () {
    angular
        .module("RestoFinder")
        .controller("AdminController", function ($rootScope, $scope, $http) {
            $scope.isVisibleUsers = false;
            $scope.showHideUsers = function () {
                $scope.isVisibleUsers = $scope.isVisibleUsers ? false : true;
            }
        });
})();
