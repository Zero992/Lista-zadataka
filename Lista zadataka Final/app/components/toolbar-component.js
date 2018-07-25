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
            '<add-to-list-component></add-to-list-component>' +
            '<div>',
        bindings: {
            completed: '=',
            uncompleted: '='
        },
        controller: function ($scope, $filter, $timeout, $interval, ListaZadatakaService) {
            var self = this;

            self.completed = ListaZadatakaService.completed;
            self.uncompleted = ListaZadatakaService.uncompleted;
            self.items = ListaZadatakaService.items;

            self.reload = function () {
                self.completed = ListaZadatakaService.completed;
                self.uncompleted = ListaZadatakaService.uncompleted;
                self.items = ListaZadatakaService.items;
            };

            self.checkBoxClicked = function (index) {
                ListaZadatakaService.checkBoxClicked(index);
            };

            $scope.$on('RefreshCounters', function (event, data) {
                self.reload();
            });
            $timeout(function () {
                ListaZadatakaService.refreshCounters();
            }, 0);
            $interval(function () {
                document.getElementById("taskObject").value = new Date().toLocaleTimeString();
                ListaZadatakaService.addToList();
                document.getElementById("taskObject").value = "";
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
            '<button type="button" class="btn btn-primary" ng-click="$ctrl.addToList()"> + </button>' +
            '</div>' +
            '</div> ',
        controller: function ($scope, ListaZadatakaService) {
            var self = this;

            self.addToList = function () {
                ListaZadatakaService.addToList();
                document.getElementById("taskObject").value = "";
            };
        }
    })
    .service('ListaZadatakaService', function ($rootScope, $filter) {
        var self = this;

        self.completed = 0;
        self.uncompleted = 0;

        self.items = [
            { "toDo": "Ajde", "value": false },
            { "toDo": "mala", "value": false },
            { "toDo": "skidaj", "value": false },
            { "toDo": "sala", "value": false },
            { "toDo": "razvijaj", "value": false },
            { "toDo": "misice", "value": false },
            { "toDo": "jok bre!", "value": false }
        ];

        self.checkBoxClicked = function (index) {
            self.items[index].value = !self.items[index].value;
            self.refreshCounters();
            console.log("Complted: " + self.completed + " Uncompleted: " + self.uncompleted);
        };

        self.refreshCounters = function () {
            self.completed = 0;
            self.uncompleted = 0;
            angular.forEach(self.items, function (value, key) {
                if (value.value === true) {
                    self.completed++;
                } else
                    self.uncompleted++;
            });
            $rootScope.$broadcast('RefreshCounters', {});
        };

        self.addToList = function () {
            self.inputValue = document.getElementById("taskObject").value;
            if (self.inputValue === "") {
                alert("Unesite tekst zadatka");
            } else {
                if (($filter('filter')(self.items, { 'toDo': self.inputValue.trim() })).length !== 0) {
                    alert("Zadatak vec postoji u listi");
                }
                else {
                    self.items.push({ "toDo": self.inputValue, "value": false });
                }
            }
            self.refreshCounters();
        };
    });