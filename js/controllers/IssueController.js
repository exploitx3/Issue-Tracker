app.controller('IssueController', ['$scope', '$routeParams', '$filter', 'userService', 'issuesService', 'projectsService', 'notifyService', 'pageSize', 'ngTableParams',
    function ($scope, $routeParams, $filter, userService, issuesService, projectsService, notifyService, pageSize, ngTableParams) {

        $scope.getIssueData = function getIssueData() {
            issuesService.getIssueById($routeParams.issueId, function success(data) {
                $scope.issueData = data;
                issuesService.getIssueCommentsById($routeParams.issueId, function success(data) {
                    $scope.issueComments = data;
                }, function error(err){
                    notifyService.showError('Cannot get issue comments, err');
                })
            }, function error(err) {
                notifyService.showError('Cannot get issue data', err);
            });
        };

        $scope.changeIssueStatus = function changeIssueStatus(statusId){
            console.log(statusId);
        };

        $scope.getIssueData();

    }]);