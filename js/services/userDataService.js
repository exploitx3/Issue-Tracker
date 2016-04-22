app.factory('userDataService', [
    '$http',
    '$q',
    'localStorageService',
    'authService',
    function ($http, $q, localStorageService) {
        "use strict";

        return {
            isDataSet: function () {
                var isDataSet = localStorageService.hasOwnProperty('userLeadDashboardProjectObjects') &&
                    localStorageService.hasOwnProperty('userAssignedIssuesProjectObjects') &&
                    localStorageService.hasOwnProperty('userLeadProjectObjects') &&
                    localStorageService.hasOwnProperty('userIssues');

                return isDataSet;
            },
            clearUserDataInStorage: function () {
                localStorageService.remove('userAssignedIssuesProjectObjects');
                localStorageService.remove('userLeadProjectObjects');
                localStorageService.remove('userDashboardProjectObjects');
                localStorageService.remove('userIssues');
            },
            setUserDataInStorage: function (data) {
                var defer = $q.defer();
                localStorageService.set('userAssignedIssuesProjectObjects', data.userAssignedIssuesProjectObjects);
                localStorageService.set('userLeadProjectObjects', data.userLeadProjectObjects);
                localStorageService.set('userDashboardProjectObjects', data.userDashboardProjectObjects);
                localStorageService.set('userIssues', data.userIssues);
                defer.resolve();
                return defer.promise;
            },
            getUserLeadProjectObjects: function () {
                var userLeadProjectObjects = localStorageService.get('userLeadProjectObjects');
                return userLeadProjectObjects;
            },

            getUserAssignedIssuesProjectObjects: function () {
                var userAssignedIssuesProjectObjects = localStorageService.get('userAssignedIssuesProjectObjects');
                return userAssignedIssuesProjectObjects;
            },

            getUserIssues: function () {
                var userIssues = localStorageService.get('userIssues');
                return userIssues;
            },

            getUserDashboardProjectObjects: function () {
                var userDashboardProjectObjects = localStorageService.get('userDashboardProjectObjects');
                return userDashboardProjectObjects;
            },


        }
    }]);

