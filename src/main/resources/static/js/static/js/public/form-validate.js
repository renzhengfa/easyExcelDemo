// 信息校验
function formvalidate() {
    var validatejson={
        one:  $("#edit_info_form").validate({
            onfocusout: function (element) {
                $(element).valid();
            },
            rules: {
                fileName: {
                    required: true,
                    noblank:true,
                    isblank:true
                },
                fileNum: {
                    required: true,
                    english: true,
                    maxlength: 30,
                    noblank:true,
                    referenceverify:true,
                    fileNumRemote:true
                },
                fondsId: {
                    number:true,
                    required: true,
                    maxlength: 8
                },
                author: {
                    required: true,
                    noblank:true,
                    specialcharacter:true,
                    maxlength: 8
                },
                recordOrganize: {
                    required: true,
                    noblank:true,
                    specialcharacter:true,
                    maxlength: 24
                },
                pageNum: {
                    required: true,
                    positiveinteger: true,
                    maxlength: 5
                },
                integrity: {
                    required: true,
                    positive: true,
                    range: [0, 100]
                },
                fkTypeName: {
                    required: true
                },
                number: {
                    required: false,
                    number: true,
                    maxlength: 22
                },
                rfid: {
                    english: true,
                    // noblank:true,
                    specialcharacter:true,
                    maxlength: 24
                }
            },
            messages: {
                fileName: {
                    required: "题名不能为空",
                    isblank:"题名不能为空格"
                },
                fileNum: {
                    required: '档号不能为空',
                    english: '档号不能输入汉字',
                    maxlength: '最大长度不能超过30位',
                },
                fondsId: {
                    required: '全宗号不能为空',
                    number: '全宗号只能为数字',
                    maxlength: '最大长度不能超过8位'
                },
                author: {
                    required: '著录人不能为空',
                    maxlength: '最大长度不能超过8位'
                },
                recordOrganize: {
                    required: '著录单位不能为空',
                    maxlength: '最大长度不超过24位'
                },
                pageNum: {
                    required: '页数不能为空',
                    positiveinteger: '页数只能为正整数',
                    maxlength: '最大长度不能超过5位'
                },
                integrity: {
                    required: '完整度不能为空',
                    positive: '完整度只能为正整数和0',
                    range: '请输入0-100之间的数字'
                },
                fkTypeName: {
                    required: '档案类别不能为空'
                },
                number: {
                    number: '号只能为数字',
                    maxlength: '最大长度不能超过22位'
                },
                rfid: {
                    english: 'rfid只能为字母与数字',
                    // number: 'rfid只能位数字',
                    maxlength: '最大长度不能超过24位'
                }
            }
        }),
        two: $("#archiveInfo").validate({
            onfocusout: function (element) {
                $(element).valid();
            }
        })
    };
    return validatejson;
}