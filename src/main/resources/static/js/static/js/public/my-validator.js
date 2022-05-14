$.validator.addMethod("english", function (value, element, params) {
    // var pattern = /^$|^[0-9a-zA-Z]+$/;
    var pattern=/[\u4E00-\u9FA5]/g;
    var res = pattern.test(value);
    if (!res) {
        return true
    }
}, "不能输入汉字");
$.validator.addMethod("positiveinteger", function(value, element) {
    var aint=parseInt(value);
    return aint>0&& (aint+"")==value;
}, "请输入正整数");
$.validator.addMethod("positive", function (value, element, params) {
    // var pattern=/^(0|\+?[1-9][0-9]{0,4})(\.\d{1,2})?$/;  //正数和0
    var pattern=/[^\d]/g;
    var res = pattern.test(value);
    if (!res) {
        return true
    }
}, "请输入正整数和0");
$.validator.addMethod("isblank", function (value, element, params) {
    return $.trim(value) != ''
}, "不能为空，全空格也不行");
$.validator.addMethod("specialcharacter", function (value, element, params) {
    var pattern = /[`~!@#$%^&*()_\-+=<>?:"{}|,.\/;'\\[\]·~！@#￥%……&*（）——\-+={}|《》？：“”【】、；‘’，。、]/im;
    if (!pattern.test(value)) {// 如果包含特殊字符返回false
        return true;
    }
}, "不能包含特殊字符");
$.validator.addMethod("referenceverify", function (value, element, params) {
    var pattern = /[`~!@#$%^&*()_\+=<>?:"{}|,.\;'\\[\]·~！@#￥%……&*（）——\+={}|《》？：“”【】、；‘’，。、]/im;
    if (!pattern.test(value)) {// 如果包含特殊字符返回false
        return true;
    }
}, "不能包含特殊字符(/和-除外)");
$.validator.addMethod("noblank", function (value, element, params) {
    var reg =/^[^\s]*$/;
    return reg.test(value);
}, "不能包含空格");
$.validator.addMethod("CapitallettersNumbers", function (value, element, params) {
    var reg =/^[A-Z0-9]+[0-9]+$/;
    if(reg.test(value) ){
        return true;
    }
}, "只能为大写字母+数字格式或者纯数字格式");
//档号查重
$.validator.addMethod("fileNumRemote", function (value, element, params) {
    var flag=false;
    if(fileId){
        app.getAsync('archivesmodule/arcTbFile/validateFileNumIfExist', {
            id: fileId,
            fileNum: value
        }, function (res) {
            flag=res.state;
        });
    }else {
        app.getAsync('archivesmodule/arcTbFile/validateFileNumIfExist', {
            fileNum: value
        }, function (res) {
            flag=res.state;
        });
    }
    if(flag){
        return true;
    }
}, "档号已存在");
