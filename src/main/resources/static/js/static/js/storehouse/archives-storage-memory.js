/**
 * @description 监测统计
 * @author tangli
 */

// 初始化table
var form; 
$(function () {
    layui.use(['form', 'laydate' ], function () {
        form = layui.form; // form表单 
        getMenuBar(); //自定义面包屑，引用public-menu.js  
        // 初始下拉
        getSelectData();  
        $('#query').on('click', function () {      
            query();
        })
        $(window).on('resize',function(){//重新加载
            initArchivesStorage();
        });
        form.on('select(warehouse)', function (data) { 
            getRegion(data.value);  
            // console.log(data.value) 
        })
        form.on('select(regions)', function (data) { 
            getCols(data.value);  
        }) 
        form.render();
    })
}());

// 下拉框赋值的方法  bool是否添加“请选择”选项
function addSelect(id, data, bool, val, text) { 
    val = val || 'type';
    text = text || 'name';
    var html = '';
    var $id = $('#' + id);
    $id.html(''); 
    if (bool) {
        html += '<option value="">请选择</option>'
      }
    for (var i in data) {
        html += '<option value="' + data[i][val] + '">' + data[i][text] + '</option>';
    }
    $id.html(html);
    form.render();
}
// 初始化库房下拉框
function getSelectData() {  
    app.get('environmentmodule/wkStoTbStore/selectWkStoTbStore', null, function (msg) { 
        if (msg.state && msg.rows) {    
            var str = '<option value="">请选择</option>'; 
            for (var item of msg.rows) { 
                 str += '<option value="' + item.id + '">' + item.storeName + '</option>'; 
            }    
            $('#warehouse').html(str);     
            // getRegion(msg.rows[0].id);   
            layui.form.render(); 
        }
    })
} 
// 获取区下拉
function getRegion(fkStoreId){
    app.get('storeroommodule/stoTbRegion/selectByBind', {fkStoreId}, function (msg) { 
        if (msg.state && msg.rows) {   
            var str = '<option value="">请选择</option>'; 
            for (var item of msg.rows) { 
                 str += '<option value="' + item.id + '">' + item.regionName + '</option>'; 
            }    
            $('#regions').html(str);     
            getCols(msg.rows[0].id);   
            layui.form.render(); 
        }
    })
}
// 列节层渲染
var divs=[],
    lays=[];
function getCols(id){ 
    divs=[],
    lays=[];
    app.get("storeroommodule/stoTbRegion/selectByRegionId", {id}, function (msg) {
        if (msg.state && msg.row) {
            var str = '<option value="">请选择</option>'; 
            if(msg.row.gdlType=='左边'){
                for (var i = 0; i < msg.row.cols; i++) { 
                    str += '<option value="' + i + '">' + i + '</option>'; 
                } 
            }else{
                for (var i = 1; i <= msg.row.cols; i++) { 
                    str += '<option value="' + i + '">' + i + '</option>'; 
                } 
            } 
            // 节  
            for (var i = 0; i < msg.row.divs; i++) {
                divs.push(i);
            }
            // 层
            for (var i = 0; i < msg.row.lays; i++) {
                lays.push(i); 
            } 
            $('#cols').html(str); 
            layui.form.render(); 
        }
    });
}
  
// 条件查询 
var storage=[];
function query() {   
    let fkStoreId = $('#warehouse').val();   
    let fkRegionId = $('#regions').val();   
    let colNum = $('#cols').val();   
    let direction = $('#direction').val();    
    var info = { 
        fkStoreId,  
        fkRegionId,
        colNum,
        direction
    };    
    if(!fkStoreId || !fkRegionId || !colNum || !direction){
            layer.msg('请选择完整信息');
            return;
    } 
    app.get('countmodule/storeAndRegionCount/getFilesStorageInfo', info, function (msg) { 
        if (msg.state && msg.rows) {       
            storage=msg.rows;
        } 
        // 初始存储分布
        initArchivesStorage();   
    })    
} 
// 初始存储分布
function initArchivesStorage(){
    let fkStoreId = $('#warehouse').val();   
    let fkRegionId = $('#regions').val();   
    let colNum = $('#cols').val();   
    let direction = $('#direction').val();    
    if(!fkStoreId || !fkRegionId || !colNum || !direction){ 
        return;
    } 
    $('#archives_storage_memory').empty();
    // 获取每个方块宽、高
    var len1=divs.length,
        len2=lays.length;  
    var width=$('#archives_storage_memory').width()/len1;
    var height=$('#archives_storage_memory').height()/len2;  
    var str='',
        msg='',
        active_box='',
        laysR=[];  
        for(var i=len2-1;i>=0;i--){  
            laysR.push(lays[i]);
        }  
        for(let item of storage){
            var divNum=item.divNum,
                laysNum=item.laysNum,
                layerCapacity=item.layerCapacity,
                count=item.count; 
            if((count!=0 && count<layerCapacity) || count!=0 && count>layerCapacity) {   
                if(count<layerCapacity && count!=0){
                    msg='此格未满'; 
                    active_box='not_full_box';
                }
                if(count>layerCapacity){
                    msg='此格已超';
                    active_box='overflow_box'; 
                } 
                str+=`<div class='default_box ${active_box}'
                style="width:${width}px;height:${height}px;left:${(divNum-1)*width}px;
                top:${laysR[laysNum-1]*height}px;line-height: ${height}px;">${msg}(<span>${count}/${layerCapacity})</span></div>`; 
            } 
            if(count==0 || (count!=0 && count==layerCapacity)){ 
                msg=count==0?'此格为空':'此格已满'; 
                active_box=count==0?'no_box':'full_box'; 
                str+=`<div class='default_box ${active_box}'
                style="width:${width}px;height:${height}px;left:${(divNum-1)*width}px;
                top:${laysR[laysNum-1]*height}px;line-height: ${height}px;">${msg}</div>`;  
            } 
            
            if(divNum==1){
                str+=`<div style="width:${width}px;height:${height}px;position:absolute;left:${(divNum-1)*width-36}px;color:#bbb;z-index:99;
                top:${laysR[laysNum-1]*height}px;line-height: ${height}px;">${lays[laysNum-1]+1}层</div>`;
            }
            if(laysNum==1){
                str+=`<div style="width:${width}px;height:${height}px;position:absolute;left:${(divNum-1)*width+width/2}px;color:#bbb;
                top:${laysR[laysNum-1]*height+height/2+16}px;line-height: ${height}px;">${divs[divNum-1]+1}节</div>`;
            }
    }  
    $('#archives_storage_memory').html(str);
}
 
 
 