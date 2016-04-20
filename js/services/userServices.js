"use strict";

app.factory('userService', function ($http, baseServiceUrl, authService) {
    return {
        getAllUsers: function getAllUsers(success, error){
            var request = {
                method: 'GET',
                url: baseServiceUrl + '/users/',
                headers: authService.getAuthHeaders()
            };
          $http(request).success(success).error(error);
        }
    }
});