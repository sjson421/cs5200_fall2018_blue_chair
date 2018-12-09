(function() {
  angular
    .module("RestoFinder")
    .controller("UserController", function(
      $rootScope,
      $scope,
      $http,
      LoginService,
      $routeParams,
      UserService
    ) {
      $scope.getLoggedInUser = getLoggedInUser();
      $scope.getProfileUser = getProfileUser();
    //   $scope.getUserReviews = getUserReviews();
    //   $scope.getUserFollows = getUserFollows();
    //   $scope.getUserFollowedBy = getUserFollowedBy();
    //   $scope.getUserEndorses = getUserEndorses();
    //   $scope.getUserEndorsedBy = getUserEndorsedBy();
    //   $scope.getUserFavorites = getUserFavorites();

      function getLoggedInUser() {
        // body
        $scope.loggedUser = JSON.parse(LoginService.getCookieData());
        console.log("loggedUser is", $scope.loggedUser.username);
      }

      function getProfileUser() {
        let id = $routeParams.userId;
        UserService.getUser(id)
          .then(function(response) {
            $scope.user = response.data.user;
            $scope.userType = $scope.user.userType;
            console.log("response is", response.data);
            console.log("Profile of user to display is", $scope.user.username);
            getUserReviews();
            getUserFollows();
            getUserFollowedBy();
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
              $scope.follows = response.data;
            },
            function(err) {
              console.log("error in fetching folllows", err);
            }
          );
        }
      }

      function getUserFollowedBy() {
        if (
            $scope.userType == "REGISTERED" ||
            $scope.userType == "CRITIC" 
          ) {
            let id = $scope.user._id;
            UserService.getFollowedBy(id).then(
              function(response) {
                $scope.followedBy = response.data;
              },
              function(err) {
                console.log("error in fetching followedBy", err);
              }
            );
          }
      }

      function getUserEndorses(){
        if (
            $scope.userType == "OWNER" ||
            $scope.userType == "CRITIC" 
          ) {
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

      function getUserEndorsedBy(){
        if (
            $scope.userType == "CRITIC" 
          ) {
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

      function getUserFavorites(){
        if (
            $scope.userType == "REGISTERED"
          ) {
            let id = $scope.user._id;
            UserService.getFavorites().then(
              function(response) {
                $scope.favorites = response.data;
              },
              function(err) {
                console.log("error in fetching favorites", err);
              }
            );
          }
      }
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
