(function() {
  angular
    .module("RestoFinder")
    .controller("RestaurantController", function(
      $rootScope,
      $scope,
      $location,
      $routeParams,
      RestaurantService,
      LoginService,
      UserService
    ) {
      console.log("routeParams", $routeParams);
      $scope.getLoggedInUser = getLoggedInUser();
      $scope.getRestaurant = getRestaurant();
      $scope.getReviews = getReviews();
      function getRestaurant() {
        RestaurantService.getRestaurant($routeParams.restaurantId).then(
          function(response) {
            $scope.restaurant = response.data[0];
            getLoggedInUserFavourites();
            console.log(response.data);
          },
          function(err) {}
        );
      }
      function getLoggedInUser() {
        // body
        $scope.loggedUser = JSON.parse(LoginService.getCookieData());
        if ($scope.loggedUser != null && $scope.loggedUser) {
          $rootScope.currentUser = $scope.loggedUser;
          $scope.userType = $scope.loggedUser.userType;
        } 
      }

      function getReviews() {
        RestaurantService.getReviewsForRestaurant(
          $routeParams.restaurantId
        ).then(
          function(response) {
            $scope.reviews = response.data;
            console.log("reviews received are",response.data);
          },
          function(err) {
              console.log(err);
          }
        );
      }
      function getLoggedInUserFavourites() {
        if ($scope.loggedUser && $scope.userType == "REGISTERED") {
          UserService.getFavorites($scope.loggedUser._id).then(
            function(response) {
              $scope.loggedFavourites = response.data;
              setAlreadyFavorite();
            },
            function(err) {
              console.log(err);
            }
          );
        }
      }

      function setAlreadyFavorite(){
        // console.log("in set favorite");
        // console.log("logged favs", $scope.loggedFavourites);
        // console.log("restaurant id", $scope.restaurant._id);
        $scope.alreadyFavourite = $scope.loggedFavourites.includes($scope.restaurant._id);
      }

      $scope.unFavouriteRestaurant = function unFavouriteRestaurant(){
        let userId = $scope.loggedUser._id;
        let restaurantId = $scope.restaurant._id;
        UserService.deleteFavorite(userId, restaurantId).then(
          function(response) {
            $scope.alreadyFavourite= false;
            let index = $scope.loggedFavourites.indexOf(restaurantId);
            if(index > -1){
              $scope.loggedFavourites.splice(index, 1);
            }
          },
          function(err) {
            console.log(err);
          }
        );

      }

      $scope.favouriteRestaurant = function favouriteRestaurant() {
        // body
        let userId = $scope.loggedUser._id;
        let restaurantId = $scope.restaurant._id;

        UserService.createFavorite(userId,restaurantId)
          .then(
            function(response){
              $scope.alreadyFavourite = true;
              $scope.loggedFavourites.push(restaurantId);
            },
            function(err){
              console.log(err);
            }
          )
      }
    });
})();
