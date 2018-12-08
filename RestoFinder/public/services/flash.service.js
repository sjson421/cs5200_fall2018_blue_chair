(function () {
    angular
        .module("RestoFinder")
        .factory("FlashService", flashService);

    function flashService(Flash) {
       
        var api = {
            createSuccessFlash: createSuccessFlash,
            createWarningFlash: createWarningFlash,
            createFailFlash: createFailFlash,
            craeteInfoFlash: craeteInfoFlash
        };
        return api;
        // m
            // $scope.successAlert = function () {
            //     var message = '<strong> Well done!</strong>  You successfully read this important alert message.';
            //     var id = Flash.create('success', message, 0, {class: 'custom-class', id: 'custom-id'}, true);}
        function createSuccessFlash(message){
            Flash.create('success', message, 0, {class: 'custom-class', id: 'custom-id'}, true);
        }

        function createWarningFlash(message){
            Flash.create('warning', message, 0, {class: 'custom-class', id: 'custom-id'}, true);
        }

        function createFailFlash(message){
            Flash.create('danger', message, 0, {class: 'custom-class', id: 'custom-id'}, true);
        }

        function craeteInfoFlash(message){
            Flash.create('info', message, 0, {class: 'custom-class', id: 'custom-id'}, true);
        }


    }
})();