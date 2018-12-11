(function () {
    angular
        .module("RestoFinder")
        .factory("AdvertisementService", advertisementService);

    function advertisementService($http) {
        var baseUrl = "http://localhost:5000/api/advertisement"
        var api = {
           getAdvertisements: getAdvertisements,
           getAdvertisement: getAdvertisement,
           createAdvertisement: createAdvertisement,
           updateAdvertisement: updateAdvertisement,
           deleteAdvertisement: deleteAdvertisement
        };
        return api;
      
        function getAdvertisements(){
            return $http.get(baseUrl);
        }

        function getAdvertisement(id){
            return $http.get(baseUrl + "/" + id);
        }

        function createAdvertisement(advertisement){
            return $http.post(baseUrl, advertisement);
        }

        function updateAdvertisement(id, advertisement){
            console.log("advertisement is",advertisement);
            return $http.put(baseUrl + "/" + id, advertisement);
        }

        function deleteAdvertisement(id){
            return $http.delete(baseUrl + "/" + id);
        }

    }
})();