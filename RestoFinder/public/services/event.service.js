(function () {
    angular
        .module("RestoFinder")
        .factory("EventService", eventService);

    function eventService($http) {
       var baseUrl  = "http://restofinder.tejasparab1.com/api/event"
        var api = {
          getEvents: getEvents,
          getEvent: getEvent,
          createEvent: createEvent,
          updateEvent: updateEvent,
          deleteEvent: deleteEvent
        };
        return api;
       
        function getEvents(){
            return $http.get(baseUrl);
        }

        function getEvent(id){
            return $http.get(baseUrl +"/" + id);
        }

        function createEvent(event){
            return $http.post(baseUrl, event);
        }

        function updateEvent(id,event){
            return $http.put(baseUrl + "/" + id, event);
        }

        function deleteEvent (id) {
            // body
            return $http.delete(baseUrl + "/" + id);
        }

    }
})();