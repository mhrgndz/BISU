var sql = require('mssql/msnodesqlv8');
var config = "";
// Constructor
function sqllib(pServer,pDatabase,pUid,pPwd,pTrust)
{
    BuildConfig(pServer,pDatabase,pUid,pPwd,pTrust);
}
function BuildConfig(pServer,pDatabase,pUser,pPassword,pTrust)
{
    let TmpServer = pServer;
    let TmpInstance = "";
    let TmpPort = "";

    if(pServer.split('\\').length > 1 || pServer.split(';').length > 1)
    {        
        TmpServer = pServer.split('\\')[0];
        TmpInstance = (typeof pServer.split('\\')[1] != 'undefined') ? pServer.split('\\')[1] : "";

        if(TmpServer.split(';').length > 1)
        {
            TmpPort = TmpServer.split(';')[1];
            TmpServer = TmpServer.split(';')[0];
        }
        if(TmpInstance.split(';').length > 1)
        {
            TmpPort = TmpInstance.split(';')[1];
            TmpInstance = TmpInstance.split(';')[0];
        }
    }

    config = 
    {
        server: TmpServer,
        database: pDatabase,
        user: pUser, 
        password: pPassword, 
        connectionTimeout:600000,
        requestTimeout:600000,
        options: 
        {
            trustedConnection: pTrust,
        }              
    };
    
    if(TmpPort != "")
    {
        config.port = TmpPort
    }

    if(TmpInstance != "")
    {
        config.options.instanceName = TmpInstance
    }
}
sqllib.prototype.QueryPromise = function(pQuery,pResult)
{
    try
    {   
        const pool = new sql.ConnectionPool(config, err => 
        {
            if(err == null)
            {
                const request = pool.request();           

                if(typeof pQuery.param != 'undefined')
                {
                    for(i = 0;i < pQuery.param.length;i++)
                    {
                        let pType = null;
                        if(pQuery.param[i].split(":").length > 1)
                        {
                            pType = pQuery.param[i].split(":")[1].split("|");
                        }
                        else
                        {
                            pType = pQuery.type[i].split("|");   
                        }
                        
                        if(pType[0] == "string")
                        {
                            request.input(pQuery.param[i].split(":")[0],sql.NVarChar(pType[1]),pQuery.value[i]);    
                        }
                        else if(pType[0] == "int")
                        {
                            request.input(pQuery.param[i].split(":")[0],sql.Int,pQuery.value[i]);    
                        }
                        else if(pType[0] == "float")
                        {
                            request.input(pQuery.param[i].split(":")[0],sql.Float,pQuery.value[i]);    
                        }
                        else if(pType[0] == "date")
                        {
                            var from = pQuery.value[i]; 
                            var numbers = from.match(/\d+/g);
                            var date = new Date(numbers[2] + "-" +numbers[1] + "-" + numbers[0]);

                            request.input(pQuery.param[i].split(":")[0],sql.Date,date);    
                        }
                        else if(pType[0] == "bit")
                        {
                            request.input(pQuery.param[i].split(":")[0],sql.Bit,pQuery.value[i]);    
                        }
                    }
                }

                request.query(pQuery.query,(err,result) => 
                {
                    if(err == null)
                    {
                        pResult(JSON.stringify(result));
                    }
                    else
                    {
                        var tmperr = { err : 'Error sqllib.js QueryPromise errCode : 101 - ' + err} 
                        pResult(JSON.stringify(tmperr));
                    }
                    pool.close();
                });
            }
            else
            {
                var tmperr = { err : 'Error sqllib.js QueryPromise errCode : 102 - ' + err} 
                pResult(JSON.stringify(tmperr));
            }
        });
    }
    catch(err)
    {
        var tmperr = { err : 'Error sqllib.js QueryPromise errCode : 103 - ' + err} 
        pResult(JSON.stringify(tmperr));
    }
}
module.exports = sqllib;