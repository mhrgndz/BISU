function product($scope,$window,srv)
{
    var http = new XMLHttpRequest();
 
    function GetProductList()
    {
        return new Promise(resolve => 
        {
            var url = "ProductList";
            http.open('GET', url, true);
    
            http.onreadystatechange = function() 
            {
                if(http.readyState == 4 && http.status == 200) 
                {
                    srv.SafeApply($scope,function()
                    {
                        $scope.ProductList = JSON.parse(http.responseText).recordset;

                        for (let i = 0; i < $scope.ProductList.length; i++) 
                        {
                            $scope.ProductList[i].TxtQuantity = 1;
                        }
                    });
                    resolve();
                }
            }
    
            http.send();
        });
    }
    function InsertOrder(pData)
    {
        return new Promise(resolve => 
        {
            var url = "InsertOrder?" + JSON.stringify(pData);
            http.open('GET', url, true);
    
            http.onreadystatechange = function() 
            {
                if(http.readyState == 4 && http.status == 200) 
                {
                    if(typeof(JSON.parse(http.responseText).recordset) == "undefined")
                    {
                        alert("Sipariş Verildi !")
                    }

                    resolve();
                }
            }
    
            resolve();
            http.send();
        });
    }
    $scope.Init = async function()
    {
        $scope.ProductList = [];
        await GetProductList();
    }
    $scope.BtnOrderClick = async function(pData)
    {
        await InsertOrder(pData);
    }
}