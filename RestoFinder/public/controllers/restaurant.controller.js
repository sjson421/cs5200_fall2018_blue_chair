(function() {
  angular
    .module("RestoFinder")
    .controller("RestaurantController", function(
      $rootScope,
      $scope,
      $location,
      $routeParams,
      RestaurantService
    ) {
      console.log("routeParams", $routeParams);
      $scope.getRestaurant = getRestaurant();
      $scope.getReviews = getReviews();
      function getRestaurant() {
        RestaurantService.getRestaurant($routeParams.restaurantId).then(
          function(response) {
            $scope.restaurant = response.data[0];
            console.log(response.data);
          },
          function(err) {}
        );
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
    });
})();
