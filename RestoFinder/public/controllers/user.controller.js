(function() {
  angular
    .module("RestoFinder")
    .controller("UserController", function(
      $rootScope,
      $scope,
      $http,
      LoginService,
      $routeParams,
      UserService,
      $q,
      $location,
      ReviewService,
      RestaurantService
    ) {
      $scope.getLoggedInUser = getLoggedInUser();
      //$scope.getProfileUser = getProfileUser();
      $scope.reviewsLoading = true;
      $scope.followsLoading = true;
      $scope.followedByLoading = true;
      $scope.favouritesLoading = true;

      //   $scope.getUserReviews = getUserReviews();
      //   $scope.getUserFollows = getUserFollows();
      //   $scope.getUserFollowedBy = getUserFollowedBy();
      //   $scope.getUserEndorses = getUserEndorses();
      //   $scope.getUserEndorsedBy = getUserEndorsedBy();
      //   $scope.getUserFavorites = getUserFavorites();

      function getLoggedInUser() {
        // body
        $scope.loggedUser = JSON.parse(LoginService.getCookieData());
        if ($scope.loggedUser != null && $scope.loggedUser) {
          $rootScope.currentUser = $scope.loggedUser;
        }
        $scope.loggedUserType = $scope.loggedUser.userType;
        console.log("loggedUser is", $scope.loggedUser);
        getProfileUser();
      }

      function getProfileUser() {
        let id = $routeParams.userId;
        UserService.getUser(id)
          .then(function(response) {
            $scope.user = response.data.user;
            $scope.userType = $scope.user.userType;
            console.log("response is", response.data);
            console.log("Profile of user to display is", $scope.user.username);
            getLoggedInUserFollows();
            getLoggedInUserFavourites();
            getUserReviews();
            getUserFollows();
            getUserFollowedBy();
            // getUserFavorites();
            // getLoggedInFavorites();
          })
          .catch(function(err) {
            console.log(err);
          });
      }

      function getUserReviews() {
        if ($scope.userType == "REGISTERED" || $scope.userType == "CRITIC") {
          let id = $scope.user._id;
          UserService.getReviews(id).then(
            function(response) {
              $scope.reviews = response.data;
              $scope.reviewsLoading = false;
            },
            function(err) {
              console.log("error in fetching reviews", err);
            }
          );
        }
      }

      function getUserFollows() {
        if (
          $scope.userType == "REGISTERED" ||
          $scope.userType == "CRITIC" ||
          $scope.userType == "OWNER"
        ) {
          let id = $scope.user._id;
          UserService.getFollows(id).then(
            function(response) {
              populatedUsers = [];
              $q.all(extractUsers(response.data, populatedUsers)).then(
                function(response) {
                  $scope.follows = angular.copy(populatedUsers);
                  console.log("follows are", $scope.follows);
                  $scope.followsLoading = false;
                },
                function(err) {
                  console.log(err);
                }
              );
            },
            function(err) {
              console.log("error in fetching folllows", err);
            }
          );
        }
      }
      function extractUsers(usersArray, populatedUsers) {
        console.log("users array is", usersArray);
        // populatedUsers = []
        promises = [];
        for (user of usersArray) {
          let promise = UserService.getUser(user);
          promise.then(
            function(response) {
              populatedUsers.push(response.data);
            },
            function(err) {
              console.log(err);
            }
          );
          promises.push(promise);
        }
        return promises;
      }
      function getUserFollowedBy() {
        if ($scope.userType == "REGISTERED" || $scope.userType == "CRITIC") {
          let id = $scope.user._id;
          UserService.getFollowedBy(id).then(
            function(response) {
              // $scope.followedBy = response.data;
              populatedUsers1 = [];
              $q.all(extractUsers(response.data, populatedUsers1)).then(
                function(response) {
                  $scope.followedBy = angular.copy(populatedUsers1);
                  $scope.followedByLoading = false;
                },
                function(err) {
                  console.log(err);
                }
              );
            },
            function(err) {
              console.log("error in fetching followedBy", err);
            }
          );
        }
      }

      function getUserEndorses() {
        if ($scope.userType == "OWNER" || $scope.userType == "CRITIC") {
          let id = $scope.user._id;
          UserService.getEndorses().then(
            function(response) {
              $scope.endorses = response.data;
            },
            function(err) {
              console.log("error in fetching endorses", err);
            }
          );
        }
      }

      function getUserEndorsedBy() {
        if ($scope.userType == "CRITIC") {
          let id = $scope.user._id;
          UserService.getEndorsedBy().then(
            function(response) {
              $scope.endorsedBy = response.data;
            },
            function(err) {
              console.log("error in fetching endorsedBy", err);
            }
          );
        }
      }

      $scope.viewProfile = function viewProfile(user) {
        let id = user._id;
        $location.url("/user/" + id);
      };

      $scope.unfollowUser = function unfollowUser(user, follow = null) {
        let userId1 = $scope.loggedUser._id;
        let userId2 = user._id;
        UserService.deleteFollow(userId1, userId2).then(
          function(response) {
            if (follow != null) {
              let index = $scope.follows.indexOf(follow);
              if (index > -1) {
                $scope.follows.splice(index, 1);
                console.log("user unfollowed, new follows is", $scope.follows);
              }
            }
            let index2 = $scope.loggedFollows.indexOf(userId2);
            //console.log("user id unfollowed is", );
            console.log("index find is", index2);
            if (index2 > -1) {
              $scope.loggedFollows.splice(index2, 1);
              checkUserInFollowsOfLoggedInUser();
            }
          },
          function(err) {
            console.log("error unfollowing", err);
          }
        );
      };

      $scope.deleteReview = function deleteReview(review) {
        // body
        let reviewId = review._id;
        ReviewService.removeReview(reviewId).then(
          function(response) {
            let index = $scope.reviews.indexOf(review);
            $scope.reviews.splice(index, 1);
          },
          function(err) {
            console.log("error in removing review", err);
          }
        );
      };

      $scope.followUser = function followUser(user) {
        // body
        let userId1 = $scope.loggedUser._id;
        let userId2 = user._id;
        UserService.createFollow(userId1, userId2).then(
          function(response) {
            //    $scope.follows
            $scope.loggedFollows.push(userId2);
            checkUserInFollowsOfLoggedInUser();
          },
          function(err) {
            console.log("error following", err);
          }
        );
      };

      function getLoggedInUserFollows() {
        let id = $scope.loggedUser._id;
        UserService.getFollows(id).then(
          function(response) {
            $scope.loggedFollows = response.data;
            checkUserInFollowsOfLoggedInUser();
            //checkUserInFollowsOfLoggedInUser();
          },
          function(err) {
            console.log("error in fetching folllows of logged In users", err);
          }
        );
      }

      function getLoggedInUserFollowedBy() {}

      function checkUserInFollowsOfLoggedInUser() {
        // body
        $scope.userNotInLoggedInFollows = !$scope.loggedFollows.includes(
          $scope.user._id
        );

        // let id = user._id;
        // return $scope.loggedFollows.
      }

      function getUserFavourites() {
        if ($scope.userType == "REGISTERED") {
          UserService.getFavorites($scope.user._id)
          .then(
              function(response){
                populateRestaurants = [];
                $q.all(
                  extractRestaurants(
                    response.data,
                    populateRestaurants
                  )
                ).then(
                  function(response) {
                    $scope.favourites = angular.copy(populateRestaurants);
                    console.log("favourites are ", $scope.favourites);
                    $scope.favouritesLoading = false;
                  },
                  function(err) {
                    console.log(err);
                  }
                );
              },
              function (err){
                console.log(err);
              }
          )
         
        }
      }

      function getLoggedInUserFavourites() {
        if ($scope.userType == "REGISTERED") {
          UserService.getFavorites($scope.loggedUser._id).then(
            function(response) {
              populateRestaurants1 = [];
              $q.all(
                extractRestaurants(response.data, populateRestaurants1)
              ).then(
                function(response) {
                  $scope.loggedFavourites = angular.copy(populateRestaurants1);
                  $scope.logggedFavouritesLoading = false;
                  getUserFavourites();
                },
                function(err) {
                  console.log(err);
                }
              );
            },
            function(err) {
              console.log(err);
            }
          );
        }
      }

      function extractRestaurants(restaurantsArray, populatedRestaurants) {
        // console.log("users array is", usersArray);
        // populatedUsers = []
        promises = [];
        for (restaurant of restaurantsArray) {
          let promise = RestaurantService.getRestaurant(restaurant);
          promise.then(
            function(response) {
              populatedRestaurants.push(response.data);
            },
            function(err) {
              console.log(err);
            }
          );
          promises.push(promise);
        }
        return promises;
      }

      $scope.unFavouriteRestaurant = function unFavouriteRestaurant(
        restaurant,
        index
      ) {
        UserService.deleteFavorite($scope.loggedUser._id, restaurant._id).then(
          function(response) {
            $scope.loggedFavourites.splice(index, 1);
            // Additional things after unfollowing
          },
          function(err) {
            console.log(err);
          }
        );
      };

      $scope.viewRestaurant = function viewRestaurant(restaurant) {
        $location.url("/restaurant/" + restaurant._id);
      };
      // review, follows, followedBy, favorites, endorses, endorsedBy, restaurant
      // RU
      // 1. reviews
      // 2. follows
      // 3. followedBy
      // 4. Favs
      // plus details + edit for his details ( his email,password,address,profilepic)
      // Critic
      // 1. reviews
      // 2. his profile including company
      // 3. endorses
      // 4. follows
      // 5. followedBy
      // Owner
      // 1. follows
      // 2. endorsedBy
      // 3. endorses
      // 4. restaurant
      // 5. events
      // Advertiser
      // create Advertisements
      // view Advertisements
      // delete Advertisements
    });
})();
