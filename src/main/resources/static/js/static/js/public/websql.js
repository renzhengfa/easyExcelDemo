//websql公共js
var db=openDatabase('mydb', '1.0', 'webDB', 2 * 1024 * 1024);
var createTransferTableSql='CREATE TABLE IF NOT EXISTS transfer (id unique,fileNum,fileName,fondsId,fkSecretName,fkTypeId,fkTypeName,boxName,createTime,locationName,integrity,state,allowBorrow)';
var createBorrowTableSql='CREATE TABLE IF NOT EXISTS borrow (id unique,fileNum,fileName,fondsId,fkSecretName,fkTypeId,fkTypeName,boxName,createTime,locationName,integrity,state,allowBorrow)';
//执行sql
function webSqlExecute(tableName,sql,data,callback) {
    db.transaction(function (tx) {
        if(tableName==='borrow'){
            tx.executeSql(createBorrowTableSql)
        }
        if(tableName==='transfer'){
            tx.executeSql(createTransferTableSql)
        }
        tx.executeSql(sql,data,function (tx, result) {
            callback(true,result)
        },function (tx,error) {
            callback(false,error)
        })
    })

}