//table排序
//以下函数排序属性并未写死，可直接拿去用自定义属性
function SortByProps(item1, item2, obj) {
    var props = [];
    if(obj){
        props.push(obj)
    }
    var cps = []; // 存储排序属性比较结果。
    // 如果未指定排序属性(即obj不存在)，则按照全属性升序排序。
    // 记录下两个排序项按照各个排序属性进行比较得到的结果
    var asc = true;
    if (props.length < 1) {
        for (var p in item1) {
            if (item1[p] > item2[p]) {
                cps.push(1);
                break; // 大于时跳出循环。
            } else if (item1[p] === item2[p]) {
                cps.push(0);
            } else {
                cps.push(-1);
                break; // 小于时跳出循环。
            }
        }
    }
    else {
        for (var i = 0; i < props.length; i++) {
            var prop = props[i];
            for (var o in prop) {
                asc = prop[o] === "ascending";
                if (item1[o] > item2[o]) {
                    cps.push(asc ? 1 : -1);
                    break; // 大于时跳出循环。
                } else if (item1[o] === item2[o]) {
                    cps.push(0);
                } else {
                    cps.push(asc ? -1 : 1);
                    break; // 小于时跳出循环。
                }
            }
        }
    }

    // 根据各排序属性比较结果综合判断得出两个比较项的最终大小关系
    for (var j = 0; j < cps.length; j++) {
        if (cps[j] === 1 || cps[j] === -1) {
            return cps[j];
        }
    }
    return false;
}