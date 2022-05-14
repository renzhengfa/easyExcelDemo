//渲染表格
function tableInit() {
    var db = openDatabase('mydb', '1.0', 'Test DB', 2 * 1024 * 1024);

    db.transaction(function (tx) {
        tx.executeSql('SELECT * FROM borrow', [], function (tx, results) {
            var len = results.rows.length, i;
            msg = "<p>查询记录条数: " + len + "</p>";
            document.querySelector('#status').innerHTML +=  msg;

            for (i = 0; i < len; i++){
                alert(results.rows.item(i).log );
            }

        }, null);
    });
    $('tab_table_2').append()
}