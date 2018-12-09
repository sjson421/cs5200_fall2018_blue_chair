(function() {
  angular
    .module("RestoFinder")
    .controller("SearchController", function(
      $rootScope,
      $scope,
      $http,
      SearchService,
      $location
    ) {
      $scope.getRestaurants = getRestaurants();
      $scope.getUsers = getUsers();
      $scope.viewRestaurant = viewRestaurant;
      $scope.viewUser = viewUser;
      function getRestaurants() {
        if ($rootScope.searchType == "restaurant") {
          SearchService.getSearchRestaurants($rootScope.search).then(
            function(response) {
              console.log("response is", response);
              $scope.restaurants = response.data;
            },
            function(err) {
              console.log(err);
            }
          );
        }
      }
      function getUsers() {
        if ($rootScope.searchType == "user") {
            console.log("search term is", $rootScope.userSearch);
          SearchService.getSearchUsers($rootScope.userSearch).then(
            function(response) {
              $scope.users = response.data;
              console.log("users received are", $scope.users);
            },
            function(err) {
              console.log("error fetching users ", err);
            }
          );
        }
      }

      function viewRestaurant(restaurant) {
        console.log("restaurant passed is", restaurant);
        let id = restaurant._id;
        $location.url("/restaurant/" + id);
      }

      function viewUser(user){
          $location.url("/user/" + user._id);
      }
    });
})();
