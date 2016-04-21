app.controller('HeaderController', ['$scope', '$route', '$location', 'authService', function ($scope, $route, $location, authService) {
    $scope.logout = function logout(){
        authService.logout();
        $location.path('/');
        $route.reload();
    }
}]);