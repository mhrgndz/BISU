function index($scope,$window,srv)
{
    var http = new XMLHttpRequest();
 
    function GetAccountList()
    {
        let param = 1;
        var url = "listUsers?" + param;
        http.open('GET', url, true);

        http.onreadystatechange = function() 
        {
            if(http.readyState == 4 && http.status == 200) 
            {
                console.log(http.responseText);
            }
        }

        http.send();
    }
    $scope.Init = function()
    {
        localStorage.mode = true;
        localStorage.phoneNumber = '05495250675'; 
    }
    $scope.BtnClick = function()
    {
        GetAccountList();
    }
}