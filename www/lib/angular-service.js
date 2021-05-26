angular.module('app.srv', []).service('srv',function($rootScope)
{
    let _Socket = null;

    this.SocketEmit = _SocketEmit;
    this.Connection = _Connection;

    function _Connection() 
    {
        return new Promise(resolve => 
        {
            if(_Socket == null || _Socket.connected == false)
            {
                _Socket = io.connect(window.location.origin,{autoConnect: false,reconnectionDelay:10});
                _Socket.open();
                _Socket.on('connect',(data) => 
                {
                    this.SocketConnected = true;
                    resolve(true);  
                });
                _Socket.on('error', (error) => 
                {
                    this.SocketConnected = false;
                    resolve(false);
                });
            }
        });
    }
    function _SocketEmit(eventName,pParam)
    {
        return new Promise(resolve => 
        {
            _Socket.emit(eventName,pParam,function(Data)
            {               
                resolve(Data)
            });
        });
    }
    this.SafeApply = function(pScope,pFn) 
    {
        var phase = pScope.$root.$$phase;
        if(phase == '$apply' || phase == '$digest') 
        {
          if(pFn && (typeof(pFn) === 'function')) 
          {
            pFn();
          }
        } else 
        {
            pScope.$apply(pFn);
        }
    };
    this.SumColumn = function(pData,pColumn,pFilter)    
    {
        let Sum = 0;
        for(i=0;i<pData.length;i++)
        {
            if (typeof(pFilter) != "undefined")
            {
                if(pData[i][pFilter.toString().split('=')[0].trim()] == pFilter.toString().split('=')[1].trim())
                {
                    Sum += pData[i][pColumn];
                }
            }
            else
            {
                Sum += pData[i][pColumn];
            }
        }
        
        return Sum;
    }
});