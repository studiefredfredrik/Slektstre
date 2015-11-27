angular.module('app').controller('ModalDemoCtrl', function ($scope, $uibModal, $log) {
    $scope.open = function (size) {
        var modalInstance = $uibModal.open({
            templateUrl: 'InfoModal.html',
            controller: 'ModalInstanceCtrl',
            size: size,
            animation: true,
            resolve: {
                items: function () {
                    return $scope.items;
                }
            }
        });

        modalInstance.result.then(function () {
        }, function () {
            $log.info('Modal dismissed at: ' + new Date());
        });
    };
});

angular.module('app').controller('ModalInstanceCtrl', function ($scope, $uibModalInstance, items) {
    $scope.items = items;

    $scope.ok = function () {
        $uibModalInstance.close();
    };

    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };

    // Image carousel
    $scope.myInterval = 5000;
    $scope.noWrapSlides = false;
    var slides = $scope.slides = [];
    if (items.images) {
        for (var i = 0; i < items.images.length; i++) {
            slides.push({
                image: items.images[i].url,
                title: items.images[i].title,
                label: items.images[i].label
            });
        }
    }
});