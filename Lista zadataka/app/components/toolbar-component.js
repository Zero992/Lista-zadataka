angular
    .module('app', [])
    .component('toolbarComponent', {
        template:
            '<div class="container-fluid">' +
            ' <div class="row">' +
            '<div class="col-6">Lista zadataka</div>' +
            ' <div class="col-3">Uradjeni:<span ng-bind="$ctrl.completed"></span></div>' +
            ' <div class="col-3">Ne uradjeni:<span ng-bind="$ctrl.uncompleted"></span></div>' +
            ' </div>' +
            '<list-component completed="$ctrl.completed" uncompleted="$ctrl.uncompleted"></list-component>'
        ,
        controller: function () {
            var self = this;

            self.completed = 0;
            self.uncompleted = 0;
        }
    })
    .component('listComponent', {
        template:
            '<div>' +
            '<ul>' +
            '<li ng-repeat="item in $ctrl.items">' +
            '<div class="container-fluid">' +
            ' <div class="row">' +
            '<div class="col-8">{{item.toDo}}</div>' +
            ' <div class="col-4">' +
            '<input ng-model="$ctrl.checkbox[$index]" ng-change="$ctrl.checkBoxClicked($index)" type="checkbox">' +
            '</div> ' +
            ' </div>' +
            ' </div>' +
            '</li>' +
            '</ul> ' +

            'Completed:<span ng-bind="$ctrl.completed"></span> Uncompleted:<span ng-bind="$ctrl.uncompleted"></span> ' +
            '<add-to-list-component input-value="$ctrl.inputValue" on-add-to-list="$ctrl.addToList(item)"></add-to-list-component>' +
            '<div>',
        bindings: {
            completed: '=',
            uncompleted: '=',
        },
        controller: function ($scope, $filter, $interval) {
            var self = this;
            self.items = [
                { "toDo": "Ajde", "value": false },
                { "toDo": "mala", "value": false },
                { "toDo": "skidaj", "value": false },
                { "toDo": "sala", "value": false },
                { "toDo": "razvijaj", "value": false },
                { "toDo": "misice", "value": false },
                { "toDo": "jok bre!", "value": false }
            ];
            //self.items = [];
            self.completed = 0;
            self.uncompleted = 0;

            if (self.items === undefined || self.items == [])
                self.uncompleted = 0;
            else self.uncompleted = self.items.length;

            self.refreshCounters = function () {
                self.completed = 0;
                self.uncompleted = 0;
                angular.forEach(self.items, function (value, key) {
                    if (value.value == true) {
                        self.completed++;
                    } else {
                        self.uncompleted++;
                    };
                });
            }

            self.checkBoxClicked = function (index) {
                self.items[index].value = !self.items[index].value;
                self.refreshCounters();
            };

            self.inputValue = "";
            self.addToList = function () {
                $scope.$broadcast('AddToList');

                $scope.$on('pingAddToList', function (e, data) {
                    self.inputValue = data;
                });
                if (self.inputValue == "") {
                    alert("Unesite tekst zadatka");
                    self.refreshCounters();
                } else {
                    if (($filter('filter')(self.items, { 'toDo': self.inputValue.trim() })).length != 0) {
                        alert("Zadatak vec postoji u listi");
                        self.refreshCounters();
                    }
                    else {
                        self.items.push({ "toDo": self.inputValue, "value": false })
                        self.refreshCounters();
                    }

                }
            }

            $interval(function () {
                document.getElementById("taskObject").value = new Date().toLocaleTimeString();
                self.addToList();
            }, 30000);
        }
    })
    .component('addToListComponent', {
        template:
            '<div class="container-fluid">' +
            '<div class="row">' +
            '<div class="col-9">' +
            '<input id="taskObject" type="text" class="form-control" placeholder="New todo item">' +
            '</div>' +
            '<div class="col-3">' +
            '<button type="button" class="btn btn-primary" ng-click="$ctrl.onAddToList()"> + </button>' +
            '</div>' +
            '</div> ',
        bindings: {
            onAddToList: '&',
            inputValue: '='
        },
        controller: function ($scope) {
            var self = this;

            $scope.$on('AddToList', function (e) {
                $scope.$emit("pingAddToList", $scope.get());
            });

            $scope.get = function () {
                var value = document.getElementById("taskObject").value;
                return value;
            }
        }
    })
    .service('addRandomTaskService', function () {
        var self = this;
    });;