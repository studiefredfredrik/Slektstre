angular.module('app').controller('AdminModalController', function ($scope, $uibModal, $log) {
    $scope.open = function (size) {
        var modalInstance = $uibModal.open({
            templateUrl: 'AdminModal.html',
            controller: 'AdminModalInstanceCtrl',
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

angular.module('app').controller('AdminModalInstanceCtrl', function ($scope, $uibModalInstance, items,Upload) {
    $scope.items = items;

    $scope.save = function () {
        $uibModalInstance.close(true);
    };

    $scope.discard = function () {
        $uibModalInstance.close(false);
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


    // ------ADMIN FEATURES------------
    $scope.deleteChild = function (index) {
        items.children.splice(index, 1);
    };

    $scope.addParent = function (name) {
        var newitems = { children: [{}]};
        angular.copy(items, newitems.children[0]);
        newitems.name = name;
        angular.copy(newitems, items);
    };

    $scope.addChild = function (newchildname) {
        // copy from first to avoid null fields if possible
        if (!items.children) items.children =
            [
                {
                    name: newchildname,
                    children: []
                }
            ];
        else items.children.push(
            {
                name: newchildname,
                children: []
            });
    };

    $scope.addStory = function(heading, text){
        if (!items.story) items.story =
        [
            {
                heading: heading,
                text: text
            }
        ];
        else items.story.push(
        {
            heading: heading,
            text: text
        });
    };


    //------- DATE PICKER-----
    $scope.today = function () {
        $scope.dt = new Date();
    };
    $scope.today();

    $scope.clear = function () {
        $scope.dt = null;
    };

    $scope.open1 = function ($event) {
        $scope.status.opened1 = true;
    };

    $scope.open2 = function ($event) {
        $scope.status.opened2 = true;
    };

    $scope.setDate = function (year, month, day) {
        $scope.dt = new Date(year, month, day);
    };

    $scope.dateOptions = {
        formatYear: 'yy',
        startingDay: 1
    };

    $scope.status = {
        opened: false
    };

    // IMAGES
    // upload on file select or drop
    $scope.upload = function (file,item,overwrite,title,text) {
        Upload.upload({
            url: '/api/photo',
            data: { file: file }
        }).then(function (resp) {
            if (overwrite === true) {
                if (item === 'nameimg') $scope.items.nameimg = resp.data.replace("WWW\\", "");
                if (item === 'partnerimg') $scope.items.partnerimg = resp.data.replace("WWW\\", "");
            }
            else { // Slides
                if (!$scope.items.images) $scope.items.images = [{
                    url: resp.data.replace("WWW\\", ""),
                    title: title,
                    label: text
                }];
                else {
                    $scope.items.images.push(
                        {
                            url: resp.data.replace("WWW\\", ""),
                            title: title,
                            label: text
                        });
                };
                // Image carousel
                $scope.myInterval = 5000;
                $scope.noWrapSlides = false;
                $scope.slides = [];
                if ($scope.items.images) {
                    for (var i = 0; i < $scope.items.images.length; i++) {
                        $scope.slides.push({
                            image: $scope.items.images[i].url,
                            title: $scope.items.images[i].title,
                            label: $scope.items.images[i].label
                        });
                    }
                }
            }
        }, function (resp) {
            $log.info('Error status: ' + resp.status);
        }, function (evt) {
            var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
            $log.info('progress: ' + progressPercentage + '% ' + evt.config.data.file.name);
        });
    };


    $scope.deleteImgFromCarousel = function (index) {
        $scope.items.images.splice(index, 1);
        // Image carousel
        $scope.myInterval = 5000;
        $scope.noWrapSlides = false;
        $scope.slides = [];
        if ($scope.items.images) {
            for (var i = 0; i < $scope.items.images.length; i++) {
                $scope.slides.push({
                    image: $scope.items.images[i].url,
                    title: $scope.items.images[i].title,
                    label: $scope.items.images[i].label
                });
            }
        }
    };

    $scope.removeImg = function (id) {
        if (id === 'partnerimg') $scope.items.partnerimg = null
        else if (id === 'nameimg') $scope.items.nameimg = null;
    };

    //---Rotate images according to EXIF
    var handleFileSelect = function (evt) {

        var target = evt.dataTransfer || evt.target;
        var file = target && target.files && target.files[0];
        var options = { canvas: true };

        var displayImg = function (img) {
            $scope.$apply(function ($scope) {
                $scope.myImage = img.toDataURL();
            });
        }

        loadImage.parseMetaData(file, function (data) {
            if (data.exif) {
                options.orientation = data.exif.get('Orientation');
            }
            loadImage(file, displayImg, options);
        });

    };
    angular.element(document.querySelector('#fileInput')).on('change', handleFileSelect);
    angular.element(document.querySelector('img')).on('change', handleFileSelect);
});