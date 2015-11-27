var treeData;
angular.module('app').controller('treeController', ['$scope', '$http', "$uibModal", "$log", function ($scope, $http, $uibModal, $log) {
    var self = this;

    this.drawTree = function () {
        var tree = d3.layout.tree()
            .size([treeData.height, treeData.width - 160]);

        var diagonal = d3.svg.diagonal()
            .projection(function (d) { return [d.y, d.x]; });

        d3.select("#familyTreeSVG").html("");
        var svg = d3.select("#familyTreeSVG").append("svg")
            .attr("width", treeData.width)
            .attr("height", treeData.height)
            .append("g")
            .attr("transform", "translate(40,0)");

        var nodes = tree.nodes(treeData),
            links = tree.links(nodes);

        // links (lines between points)
        var link = svg.selectAll(".link")
            .data(links)
            .enter().append("path")
            .attr("class", "link")
            .attr("d", diagonal);

        // nodes (points)
        var node = svg.selectAll(".node")
            .data(nodes)
            .enter().append("g")
            .attr("class", "node")
            .attr("transform", function (d) { return "translate(" + d.y + "," + d.x + ")"; })

        // Each node represents one name
        node.append("circle")
            .attr("r", 4.5);

        // Add partners
        // TODO: support for more than one partner pr. name (.1% case)
        node.filter(function (d) { return d.partner; }).append("circle")
            .attr("r", 4.5).attr("cy", 10);

        // Add name of name
        node.append("text")
            .attr("dx", function (d) {
                if (!d.parent) return -30;
                else return d.children ? -8 : 8;
            })
            .attr("dy", function (d) {
                if (!d.parent) return -10;
                else return 3;
            })
            .style("text-anchor", function (d)
            {
                if (!d.parent) return "start";
                return d.children ? "end" : "start";
            })
            .text(function (d) { return d.name; });

        // Add name of partner
        node.append("text")
            .attr("dx", function (d) {
                if (!d.parent) return -30;
                else return d.children ? -8 : 8;
            })
            .attr("dy", function (d) {
                if (!d.parent) return 27;
                else return 13;
            })
            .style("text-anchor", function (d) {
                if (!d.parent) return "start";
                return d.children ? "end" : "start";
            })
            .text(function (d) { return d.partner; });

        // On-click event for node-circle/text
        node.on("click", function (data) {
            if (d3.event.defaultPrevented) return; // default-click suppressed
            if ($scope.usermode === 'admin') self.openAdminModal(data); 
            else self.openInfoModal(data);
        });
        d3.select(self.frameElement).style("height", treeData.height + "px");
    };

    // Sizes
    $scope.setSize = function (size) {
        if (size === 'small') {
            treeData.width = 500;
            treeData.height = 500;
        };
        if (size === 'medium') {
            treeData.width = 1000;
            treeData.height = 1000;
        };
        if (size === 'large') {
            treeData.width = 1500;
            treeData.height = 1500;
        };
        self.drawTree();
        self.saveDataToServer(treeData);
    };

    // Modal
    this.openInfoModal = function (data) {
        var modalInstance = $uibModal.open({
            animation: true,
            templateUrl: 'InfoModal.html',
            controller: 'ModalInstanceCtrl',
            size: 'lg',
            resolve: {
                items: function () {
                    return data;
                }
            }
        });

        modalInstance.result.then(function (selectedItem) {
        }, function () {
            $log.info('Modal dismissed at: ' + new Date());
        });
    };

    // ADMIN MODAL
    this.openAdminModal = function (data) {
        var modalInstance = $uibModal.open({
            animation: true,
            templateUrl: 'AdminModal.html',
            controller: 'AdminModalInstanceCtrl',
            size: 'lg',
            resolve: {
                items: function () {
                    return data;
                }
            }
        });

        modalInstance.result.then(function (save) {
            // Reload svg when modal closes since adminmodal can make changes
            if (save) {
                self.saveDataToServer(treeData);
                self.drawTree();
            }
            else {
                    self.getDataAndDrawTree();
            }
            
        }, function () {
            $log.info('AdminModal dismissed at: ' + new Date());
        });
    };

    $scope.setUsermode = function (mode) {
        $scope.usermode = mode;
    }

    // ----- talk to the server ------
    $scope.saveToServer = function () {
        self.saveDataToServer(treeData);
    };

    $scope.loadFromServer = function () {
        self.getDataAndDrawTree();
    };

    // Get the tree and then draw it
    this.getDataAndDrawTree = function () {
        $http({
            method: 'GET',
            url: '/api/tree'
        }).then(function successCallback(response) {
            treeData = response.data;
            self.drawTree();
        }, function errorCallback(response) {
            $log.info(response);
        });
    };

    this.saveDataToServer = function (data) {
        $http.post('/api/tree', JSON.stringify(data, function (key, value) {
            if (key == 'parent') { return value.id; }
            else { return value; }
        }))
				.success(function (data) {
				})
				.error(function (data) {
				    $log.info('Error: ' + data);
				});
    };

    this.init = function () {
        $http({
            method: 'GET',
            url: '/api/tree'
        }).then(function successCallback(response) {
            if (response.data.isAdminUser === true) {
                $scope.adminIsAvailable = true;
                $scope.usermode = 'user';
            }
            if(response.data)treeData = response.data;
            else treeData = 
                {
                    name: 'Click here to start building a tree, If you are logged in as',
                    children: [{name:'an ADMIN'}]
                };
            self.drawTree();
        }, function errorCallback(response) {
            $log.info(response);
        });
    };
    this.init();
}]);