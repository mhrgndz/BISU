function orders($scope,$window,srv)
{
    var http = new XMLHttpRequest();

    function GetOrderList()
    {
        return new Promise(resolve => 
        {
            var url = "getOrders?" + localStorage.phoneNumber;
            http.open('GET', url, true);
    
            http.onreadystatechange = function() 
            {
                if(http.readyState == 4 && http.status == 200) 
                {
                    srv.SafeApply($scope,function()
                    {
                        $scope.OrderList = JSON.parse(http.responseText).recordset;

                        for (let i = 0; i < $scope.OrderList.length; i++) 
                        {
                            $scope.OrderList[i].product = JSON.parse($scope.OrderList[i].products)[0].product
                            $scope.OrderList[i].quantity = JSON.parse($scope.OrderList[i].products)[0].quantity
                        }
                    });
                    resolve();
                }
            }
            http.send();
        });
    }
    $scope.Init = async function()
    {
        $scope.OrderList = [];

        await GetOrderList();
    }
}