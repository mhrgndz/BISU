function account($scope,$window,srv)
{
    var http = new XMLHttpRequest();

    function GetCustomerList()
    {
        return new Promise(resolve => 
        {
            var url = "getCustomerInfo?" + localStorage.phoneNumber;
            http.open('GET', url, true);
    
            http.onreadystatechange = function() 
            {
                if(http.readyState == 4 && http.status == 200) 
                {
                    srv.SafeApply($scope,function()
                    {
                        $scope.CustomerList = JSON.parse(http.responseText).recordset;
                    });
                    resolve();
                }
            }
    
            http.send();
        });
    }
    $scope.Init = async function()
    {
        $scope.CustomerList = [];

        await GetCustomerList();
    }
}