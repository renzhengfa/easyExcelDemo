var room = $("#store_Room1"),
    area = $("#area1"),
    cols = $("#cols1"),
    lays = $("#lays1"),
    divs = $("#divs1"),
    direction = $("#direction"),
    number = $("#number");
function selectStoreRegion() {
    //库房位置渲染select
    app.get("storeroommodule/StoTbStore/selectIsNotDelete", {}, function (msg) {
        if (msg.state) {
            var str1 = '<option value=""></option>';
            var str = "";
            for (var i = 0; i < msg.rows.length; i++) {
                str += '<option value="' + msg.rows[i].id + '">' + msg.rows[i].storeName + '</option>';
            }
            room.html(str1 + str);
            layui.form.render('select');
        }
    });
}
function renderStoreRegion(infoJson) {
    // 库房初始渲染
    app.get("storeroommodule/StoTbStore/selectIsNotDelete", {}, function (msg) {
        console.log(msg.rows,infoJson)
        if (msg.state) {
            var str1 = '<option value=""></option>';
            var str = "";
            for (var i = 0; i < msg.rows.length; i++) {
                if (msg.rows[i].id == infoJson.fkStoreId) { 
                    str += '<option value="' + msg.rows[i].id + '" selected>' + msg.rows[i].storeName + "</option>";
                } else { 
                    str += '<option value="' + msg.rows[i].id + '">' + msg.rows[i].storeName + "</option>";
                }
            }
            room.html(str1 + str);
            layui.form.render();
        }
    });
    if(infoJson.fkStoreId){
        // 区初始渲染 渲染开始就要ban了
        app.get("storeroommodule/stoTbRegion/selectByBind", {fkStoreId: infoJson.fkStoreId}, function (msg) {
            if (msg.state) {
                var str1 = '<option value=""></option>';
                var str = "";
                for (var i = 0; i < msg.rows.length; i++) {
                    if (msg.rows[i].id == infoJson.fkRegionId) {
                        str += '<option value="' + msg.rows[i].id + '" selected>' + msg.rows[i].regionName + "</option>";
                    } else {
                        str += '<option value="' + msg.rows[i].id + '">' + msg.rows[i].regionName + '</option>';
                    }
                }
                area.html(str1 + str);
                layui.form.render();
            }
        });
    }
    if(infoJson.fkRegionId){
        // 列节层初始渲染
        app.get("storeroommodule/stoTbRegion/selectByRegionId", {id: infoJson.fkRegionId}, function (msg) {
            if (msg.state && msg.row) {
                var str1 = '<option value=""></option>';
                var str2 = "";
                var str3 = "";
                var str4 = "";
                if(msg.row.gdlType=='左边'){
                    for (var i = 0; i < msg.row.cols; i++) {
                        if (i === infoJson.colNum) {
                            str2 += '<option value="' + i + '" selected>' + i + '</option>';
                        } else {
                            str2 += '<option value="' + i + '">' + i + '</option>';
                        }
                    }
                }else{
                    for (var i = 1; i <= msg.row.cols; i++) {
                        if (i === infoJson.colNum) {
                            str2 += '<option value="' + i + '" selected>' + i + '</option>';
                        } else {
                            str2 += '<option value="' + i + '">' + i + '</option>';
                        }
                    }
                }
                for (var i = 1; i <= msg.row.divs; i++) {
                    if (i === infoJson.divNum) {
                        str3 += '<option value="' + i + '" selected>' + i + '</option>';
                    } else {
                        str3 += '<option value="' + i + '">' + i + '</option>';
                    }
                }
                for (var i = 1; i <= msg.row.lays; i++) {
                    if (i === infoJson.laysNum) {
                        str4 += '<option value="' + i + '" selected>' + i + '</option>';
                    } else {
                        str4 += '<option value="' + i + '">' + i + '</option>';
                    }
                }
                cols.html(str1 + str2);
                lays.html(str1 + str3);
                divs.html(str1 + str4);
                layui.form.render();
            }
        });
    }
}
function selectLocations(fkLocationId) {
    app.get("archivesmodule/arcTbFiles/selectLocationById", { id: fkLocationId }, function (res) {
        if(res.state && res.row){
            var datasjson=res.row;
            renderStoreRegion(datasjson);
            direction.val(datasjson.direction);
            number.val(datasjson.number);
            layui.form.render();
        }
    });
}
layui.use('form', function () {
    var form = layui.form;
    form.on("select(storeroom1)", function (data) {
        if(data.value) {
            app.get("storeroommodule/stoTbRegion/selectByBind", {fkStoreId: data.value}, function (msg) {
                if (msg.state) {
                    var str1 = '<option value=""></option>';
                    var str = "";
                    var str2 = "";
                    var str3 = "";
                    var str4 = "";
                    for (var i = 0; i < msg.rows.length; i++) {
                        str += '<option value="' + msg.rows[i].id + '">' + msg.rows[i].regionName + '</option>';
                    }
                    area.html(str1 + str);
                    cols.html(str1 + str2);
                    lays.html(str1 + str3);
                    divs.html(str1 + str4);
                    form.render('select');
                }
            });
        }
    });
    form.on("select(areaName1)", function (data) {
        if(data.value){
            app.get("storeroommodule/stoTbRegion/selectByRegionId", {id: data.value}, function (msg) {
                var str1 = '<option value=""></option>';
                var str2 = "";
                var str3 = "";
                var str4 = "";
                if (msg.state) {
                    $("#regionNum").val(msg.row.regionNum);
                    // for (var i = 1; i <= msg.row.cols; i++) {
                    //     str2 += '<option value="' + i + '">' + i + '</option>';
                    // }
                    if(msg.row.gdlType=='左边'){
                        for (var i = 0; i < msg.row.cols; i++) {
                            str2 += '<option value="' + i + '">' + i + '</option>';
                        }
                    }else{
                        for (var i = 1; i <= msg.row.cols; i++) {
                            str2 += '<option value="' + i + '">' + i + '</option>';
                        }
                    }
                    for (var i = 1; i <= msg.row.divs; i++) {
                        str3 += '<option value="' + i + '">' + i + '</option>';
                    }
                    for (var i = 1; i <= msg.row.lays; i++) {
                        str4 += '<option value="' + i + '">' + i + '</option>';
                    }
                }
                cols.html(str1 + str2);
                lays.html(str1 + str3);
                divs.html(str1 + str4);
                form.render('select');
            });
        }
    });
});