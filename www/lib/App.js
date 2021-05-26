var app = angular.module("app", 
[
    'ngRoute',
    'app.controller',
    'app.srv'
]);
app.config(function($routeProvider) 
{
    $routeProvider
    .when("/", {
        templateUrl : "view/home.html"
    })
    .when("/account", 
    {
        templateUrl : "view/account.html"
    })
    .when("/orders", 
    {
        templateUrl : "view/orders.html"
    })
    .when("/product", 
    {
        templateUrl : "view/product.html"
    })
});