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
      UserService,
      $mdDialog
    ) {
      console.log("routeParams", $routeParams);
      $scope.getLoggedInUser = getLoggedInUser();
      $scope.getRestaurant = getRestaurant();
      $scope.getReviews = getReviews();
      $scope.loadingOwner = true;
      function getRestaurant() {
        RestaurantService.getRestaurant($routeParams.restaurantId).then(
          function(response) {
            $scope.restaurant = response.data[0];
            $scope.loadingOwner = false;
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
          console.log("in here");
          $rootScope.currentUser = $scope.loggedUser;
          $scope.userType = $scope.loggedUser.userType;
          console.log("logged in user is", $scope.loggedUser);
         
        } 
      }

      $scope.claimRestaurant = function claimRestaurant(){
        UserService.createOwnerRestaurant($scope.loggedUser._id, $scope.restaurant._id)
          .then(
            function(response){
              if(response.data.hasOwnProperty("userOwns")){
                alert("user already owns a restaurant")
              }
              else{
                $scope.restaurant.is_claimed = true;
              }
             
              //getRestaurantOwner();
            },
            function(err){
              console.log(err);
            }

          )
      }

      function getRestaurantOwner(){
        if($scope.restaurant.is_claimed){
          UserService.getOwnerRestaurant()
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

      $scope.createReview = function createReview(){
        $mdDialog.show({
          controller: "DialogController",
          templateUrl: "../views/create-review.dialog.view.html",
          parent: angular.element(document.body),
          clickOutsideToClose: false,
          scope: $scope,
          preserveScope: true
          // locals: {
          //   qsb_jdf_id: $scope.qsbJdfId,
          //   pipeline_dialog: angular.copy($scope.pipeline),
          //   jdf_instance_id: $scope.jdfInstanceId
          // }
        });
      }



    })

    .controller("DialogController", function($scope, $rootScope, $mdDialog, ReviewService){
        let date = new Date();
        date = date.toString();
        $scope.type = "Create"
        console.log("date is",date);
        $scope.newReview = {
          user: $scope.loggedUser._id,
          restaurant: $scope.restaurant._id,
          rating: $scope.rating,
          text: $scope.text,
          time_created: date,
          url: "",
          yelp_review: false,
          
        }

        $scope.postReview = function postReview () {
          // body
          $scope.dataLoading = true;
          console.log("review being posted is", $scope.newReview);
          ReviewService.createReview($scope.newReview)
            .then(
              function(response){
                console.log("response received is", response.data);
                $scope.reviews.push(response.data[0]);
                $mdDialog.cancel();
              }
            )
        }

        $scope.cancel = function cancel () {
          // body
          $mdDialog.cancel();
        }

    });
})();
