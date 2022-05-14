let content = document.getElementById("content");
var item, ip;

let itemsArray = document.getElementsByClassName("column-box");
let $left = document.getElementById("left");
let $right = document.getElementById("right");
let $stop = document.getElementById("stop");

// 前一次左右移按钮判定
// let _head = head, _end = end - 2;         //回溯的值
// let leftHead, leftEnd,
//     rightHead, rightEnd;
let _flag, _flag1, _flag2;    // 定位通道标志
var l = 0, h = end - 1;
let lInterval, rInterval, time;

var aniCol = function () {

    $('.column-box').on('click', function () {
        var value = $(this).find("p").html();
        $('#KN-this').text(value);
        var item = this.dataset.index,
            ip = this.dataset.ip,
            quNum = this.dataset.qunum;
        item = parseFloat(item);
        if (!isNaN(item)) {
            $('.column-box').removeClass('active');
            $(this).addClass("active");
        }
        /*if(state){
            if(fixed == '中'){
                if(item<mid){
                    $(itemsArray[l]).animate({left: "0px"}, 3000);
                    lInterval = setInterval(function () {
                        if (l < item) {
                            l++;
                            $(itemsArray[_flag1]).animate({left: "0px"}, 3000);
                        }
                    }, 1500);
                }else{
                    end--;
                    if(item <= end){
                        $(itemsArray[end]).animate({left: "72px"}, 3000);
                        rInterval = setInterval(function () {
                            if (item <= end) {
                                end--;
                                console.log('1',end);
                                $(itemsArray[end]).animate({left: "72px"}, 3000);
                            }
                        }, 1500);
                    }else{
                        $(itemsArray[end]).animate({left: "38px"}, 3000);
                        rInterval = setInterval(function () {
                            if (end <= item) {
                                end++;
                                console.log('2',end);
                                $(itemsArray[end]).animate({left: "38px"}, 3000);
                            }
                        }, 1500);
                    }
                }
            }else if(fixed == '左'){
                if(runStatus == undefined){
                    _flag = document.getElementsByClassName('column-box').length - 1;
                }
                if(item < _flag){
                    moveRight(item, '38px');
                }else if(item > _flag){
                    moveLeft(item, '0');
                }
            }else if(fixed == '右'){
                if(runStatus == undefined){
                    _flag = 0;
                }
                if(item < _flag){
                    moveRight(item, '72px');
                }else if(item > _flag){
                    moveLeft(item, '38px');
                }
            }
            // if (fixed == '左') {
            //     moveRight(index, '38px');
            // } else if (fixed == '右') {
            //     moveLeft(index, '0');
            // } else if (fixed == '中') {
            //
            // }
        }*/
        // control();
        myAnimate(item, ip, quNum)
    });
};

$(document).ready(function () {
    aniCol();
});
let locStatus = true;
// let lock = function () {
//     if (!locStatus) {
//         $("#locked").removeClass("icon-unlock");
//         $("#locked").attr("class", "icon-lock icon-locked");
//         $(".circle").animate({left: "33px"}, 100);
//         $(".lock").removeClass("unlock");
//         $(".lock").attr("class", "lock locked")
//         $(".lock").find("p").text("锁定");
//         $(".direction #left").attr("class", "btn prev disabled");
//         $(".direction #right").attr("class", "btn next disabled");
//         $(".direction button").attr("disabled", true);
//     } else {
//         $("#locked").removeClass("icon-locked");
//         $("#locked").attr("class", "icon-lock icon-unlock");
//         $(".circle").animate({left: "0"}, 100);
//         $(".lock").removeClass("locked");
//         $(".lock").attr("class", "lock unlock")
//         $(".lock").find("p").text("解锁");
//     }
// }

// let backtracking, _backtracking;

// let _runStatus;
// var statusFn = function (mid) {
//     var fixed;
//     if (status == -1) {
//         fixed = 0;  // 左
//     } else if (status == 0) {
//         fixed = mid;
//     } else {
//         fixed = end;    // 右
//     }
//     return fixed;
// };

// function control() {
//     var playPause = anime({
//         targets: '.column-box',
//         translateX: 250,
//         delay: function(el, i, l) { return i * 100; },
//         direction: 'linear',
//         // loop: true,
//         autoplay: false
//     });
//
//     document.querySelector('#right').onclick = playPause.play;
//     document.querySelector('#stop').onclick = playPause.pause;
// }


function canStop() {
    $($left).attr('disabled', true);
    $($left).addClass('KN-disabled');
    $($right).attr('disabled', true);
    $($right).addClass('KN-disabled');
    $($stop).removeAttr('disabled');
    $($stop).removeClass('KN-disabled');
}

function canMove() {
    $($left).removeAttr('disabled');
    $($left).removeClass('KN-disabled');
    $($right).removeAttr('disabled');
    $($right).removeClass('KN-disabled');
    $($stop).attr('disabled');
    $($stop).addClass('KN-disabled');
}

function moveLeft(index, distance) {
    if (index > _flag) {
        $(itemsArray[_flag]).animate({left: distance}, 3000);
        _flag++;
        lInterval = setInterval(function () {
            if (index >= _flag) {
                if (index + 1 == _flag) {
                    time = setInterval(function () {
                        canMove();
                    }, 3000);
                }
                $(itemsArray[_flag]).animate({left: distance}, 3000);
                _flag++;
            }
        }, 1500);
    } else if (index == _flag && runStatus == 1) {
        $(itemsArray[_flag]).animate({left: distance}, 3000);
        _flag++;
        time = setInterval(function () {
            canMove();
        }, 3000);
    }
}


function moveRight(index, distance) {
    if (index < _flag) {
        _flag--;
        $(itemsArray[_flag]).animate({left: distance}, 3000);
        lInterval = setInterval(function () {
            if (index < _flag) {
                if (index + 1 == _flag) {
                    time = setInterval(function () {
                        canMove();
                    }, 3000);
                }
                _flag--;
                console.log('_flag', _flag)
                $(itemsArray[_flag]).animate({left: distance}, 3000);
            }
        }, 1500);
    } else if (index == _flag && runStatus == 0) {
        _flag--;
        $(itemsArray[_flag]).animate({left: distance}, 3000);
        time = setInterval(function () {
            canMove();
        }, 3000);
    }
}

var myAnimate = function (item, ip, quNum) {
    var index = item;
    let left = function () {
        if (fixed == '左') {
            moveLeft(index, '0');
            // if (runStatus !== undefined) {
            //     moveLeft(index, _flag);
            // } else {
            //     if (index >= _flag) {
            //         _flag++;
            //         $(itemsArray[_flag]).animate({left: "0"}, 3000);
            //         lInterval = setInterval(function () {
            //             if (index > _flag) {
            //                 _flag++;
            //                 $(itemsArray[_flag]).animate({left: "0"}, 3000);
            //             }
            //         }, 1500);
            //     }
            // }
        } else if (fixed == '右') { // 固定列在右
            if (runStatus !== undefined) {
                moveLeft(index, '0');
            } else {
                _flag = 0;
                moveLeft(index, '0');
            }
        } else if (fixed == '中') {
            if (index < mid) {
                if (_runStatus1 !== undefined) {
                    if (index > _flag1) {
                        $(itemsArray[_flag1]).animate({left: '0'}, 3000);
                        _flag1++;
                        lInterval = setInterval(function () {
                            if (index >= _flag1) {
                                if (index + 1 == _flag1) {
                                    time = setInterval(function () {
                                        canMove();
                                    }, 3000);
                                }
                                $(itemsArray[_flag1]).animate({left: '0'}, 3000);
                                _flag1++;
                            }
                        }, 1500);
                    } else if (index == _flag1 && _runStatus1 == 1) {
                        $(itemsArray[_flag1]).animate({left: '0'}, 3000);
                        _flag1++;
                        time = setInterval(function () {
                            canMove();
                        }, 3000);
                    }
                } else {
                    _flag1 = 0;
                    $(itemsArray[_flag1]).animate({left: '0'}, 3000);
                    _flag1++;
                    lInterval = setInterval(function () {
                        if (index >= _flag1) {
                            if (index + 1 == _flag1) {
                                time = setInterval(function () {
                                    canMove();
                                }, 3000);
                            }
                            $(itemsArray[_flag1]).animate({left: '0'}, 3000);
                            _flag1++;
                        }
                    }, 1500);
                }
                _runStatus1 = 0;
            } else {
                $(itemsArray[_flag2]).animate({left: '38px'}, 3000);
                _flag2++;
                lInterval = setInterval(function () {
                    if (index - 1 >= _flag2) {
                        if (index - 1 == _flag2) {
                            time = setInterval(function () {
                                canMove();
                            }, 3000);
                        }
                        $(itemsArray[_flag2]).animate({left: '38px'}, 3000);
                        _flag2++;
                        console.log('left_flag2', _flag2)
                    }
                }, 1500);
                _runStatus2 = 0;
            }
        }
        runStatus = 0;
    };

    let right = function () {
        if (fixed == '左') {
            if (runStatus !== undefined) {
                moveRight(index, '38px');
            } else {
                _flag = end;
                moveRight(index, '38px');
            }
        } else if (fixed == '右') {
            moveRight(index, '38px');
            // if (runStatus !== undefined) {
            //     if (index < _flag) {
            //         _flag--;
            //         $(itemsArray[_flag]).animate({left: "38px"}, 3000);
            //         lInterval = setInterval(function () {
            //             if (index < _flag) {
            //                 _flag--;
            //                 console.log('_flag',_flag)
            //                 $(itemsArray[_flag]).animate({left: "38px"}, 3000);
            //             }
            //         }, 1500);
            //     }else if(index == _flag && runStatus == 0){
            //         _flag--;
            //         $(itemsArray[_flag]).animate({left: "38px"}, 3000);
            //     }
            // } else {
            //     _flag = end;
            //     if (index <= _flag) {
            //         _flag--;
            //         $(itemsArray[_flag]).animate({left: "38px"}, 3000);
            //         lInterval = setInterval(function () {
            //             if (index < _flag) {
            //                 _flag--;
            //                 $(itemsArray[_flag]).animate({left: "38px"}, 3000);
            //             }
            //         }, 1500);
            //     }
            // }
        } else if (fixed == '中') {
            if (index < mid) {
                if (index < _flag1) {
                    _flag1--;
                    $(itemsArray[_flag1]).animate({left: "38px"}, 3000);
                    lInterval = setInterval(function () {
                        if (index < _flag1) {
                            if (index + 1 == _flag2) {
                                time = setInterval(function () {
                                    canMove();
                                }, 3000);
                            }
                            _flag1--;
                            $(itemsArray[_flag1]).animate({left: "38px"}, 3000);
                        }
                    }, 1500);
                }
            } else {
                if (_runStatus2 !== undefined) {
                    if (index - 1 < _flag2) {
                        _flag2--;
                        $(itemsArray[_flag2]).animate({left: "72px"}, 3000);
                        lInterval = setInterval(function () {
                            if (index - 1 < _flag2) {
                                if (index + 1 == _flag2) {
                                    time = setInterval(function () {
                                        canMove();
                                    }, 3000);
                                }
                                _flag2--;
                                $(itemsArray[_flag2]).animate({left: "72px"}, 3000);
                            }
                        }, 1500);
                    } else if (index - 1 == _flag2 && _runStatus2 == 0) {
                        _flag2--;
                        $(itemsArray[_flag2]).animate({left: "72px"}, 3000);
                        time = setInterval(function () {
                            canMove();
                        }, 3000);
                    }
                } else {
                    _flag2 = end - 1;
                    if (index - 1 < _flag2) {
                        _flag2--;
                        $(itemsArray[_flag2]).animate({left: "72px"}, 3000);
                        lInterval = setInterval(function () {
                            if (index - 1 < _flag2) {
                                if (index == _flag2) {
                                    time = setInterval(function () {
                                        canMove();
                                    }, 3000);
                                }
                                _flag2--;
                                $(itemsArray[_flag2]).animate({left: "72px"}, 3000);
                            }
                        }, 1500);
                    }
                }
                _runStatus2 = 1;
            }
        }
        runStatus = 1;
    };

    /*let left = function () {
        if (fixed == mid) {
            if (index < mid) {
                flag = index - 1;
                $(itemsArray[leftHead]).animate({left: "0"}, 5000);
                lInterval = setInterval(function () {
                    if (leftHead < flag) {
                        $(itemsArray[leftHead + 1]).animate({left: "0"}, 5000);
                        leftHead++;
                        leftEnd = leftHead;
                    }
                }, 1500);
                console.log("runLeft-L:", leftHead, leftEnd);
            } else {
                flag = index;
                $(itemsArray[rightHead - 1]).animate({left: "38px"}, 5000);
                lInterval = setInterval(function () {
                    if (rightHead < flag) {
                        $(itemsArray[rightHead]).animate({left: "37px"}, 5000);
                        rightHead++;
                        rightEnd = rightHead;
                    }
                }, 1500);
                console.log("runLeft-R:", rightHead, rightEnd);
            }
        } else if (fixed == 0) {
            flag = index;
            if (flag >= head - 1) {
                if (flag <= head) {
                    $(itemsArray[head]).animate({left: "0px"}, 5000);
                    head++;
                    end = head - 2;
                } else if (runStatus == 0 && flag == head - 1) {
                    $(itemsArray[head + 1]).animate({left: "0px"}, 5000);
                    head++;
                    end = head - 1;
                } else {
                    $(itemsArray[head - 1]).animate({left: "0"}, 5000);
                    lInterval = setInterval(function () {
                        if (head <= flag) {
                            $(itemsArray[head]).animate({left: "0"}, 5000);
                            head++;
                            end = head - 1;
                            _end = end;
                            console.log("L-head:", head, "end:", end);
                        }
                    }, 1500);
                }
            } else {
                console.log("这一列无法左移");
            }
        } else {
            flag = index;
            if (flag >= head) {
                if (flag <= head) {
                    $(itemsArray[head]).animate({left: "0px"}, 5000);
                    head++;
                    end = head - 2;
                } else if (runStatus == 0 && flag == head - 1) {
                    $(itemsArray[head + 1]).animate({left: "0px"}, 5000);
                    head++;
                    end = head - 1;
                } else if (runStatus == 0 && flag == head - 1) {
                    $(itemsArray[head + 1]).animate({left: "0"}, 5000);
                    lInterval = setInterval(function () {
                        if (head < flag) {
                            $(itemsArray[head + 2]).animate({left: "0"}, 5000);
                            head++;
                            end = head - 1;
                            _end = end;
                            console.log("L-head: 0 ", head, "end:", end);
                        }
                    }, 1500);
                } else {
                    $(itemsArray[head]).animate({left: "0"}, 5000);
                    lInterval = setInterval(function () {
                        if (head < flag) {
                            $(itemsArray[head + 1]).animate({left: "0"}, 5000);
                            head++;
                            end = head - 1;
                            _end = end;
                            console.log("L-head:", head, "end:", end);
                        }
                    }, 1500);
                }
            } else {
                console.log("这一列无法左移");
            }
        }
        runStatus = 0;
    }
    let right = function () {
        if (fixed == mid) {
            if (index < mid) {
                flag = index - 1;
                $(itemsArray[leftEnd]).animate({left: "38px"}, 5000);
                rInterval = setInterval(function () {
                    if (flag < leftEnd) {
                        $(itemsArray[leftEnd - 1]).animate({left: "38px"}, 5000);
                        leftEnd--;
                        leftHead = leftEnd;
                    }
                }, 1500);
                console.log("runRight-F:", leftHead, leftEnd);
            } else {
                flag = index;
                $(itemsArray[rightEnd - 1]).animate({left: "76px"}, 5000);
                rInterval = setInterval(function () {
                    console.log(index, rightEnd);
                    if (flag < rightEnd) {
                        $(itemsArray[rightEnd - 2]).animate({left: "76px"}, 5000);
                        rightEnd--;
                        rightHead = rightEnd;
                    }
                }, 1500);
                console.log("runRight-R:", rightHead, rightEnd);
            }
        } else if (fixed == 0) {
            flag = index;
            if (flag <= end-1) {
                // if (flag > end) {
                //     $(itemsArray[end + 1]).animate({left: "38px"}, 5000);
                //     head = end + 1;
                //     end--;
                // } else
                if (runStatus == 1 && flag == end - 1) {
                    $(itemsArray[end - 1]).animate({left: "38px"}, 5000);
                    end--;
                    head = end;
                } else {
                    $(itemsArray[end]).animate({left: "38px"}, 5000);
                    rInterval = setInterval(function () {
                        if (flag <= end - 1) {
                            $(itemsArray[end - 1]).animate({left: "38px"}, 5000);
                            end--;
                            head = end;
                            _head = head;
                            console.log("R-head:", head, "end:", end);
                        }
                    }, 1500);
                }
            } else {
                console.log("这一列现在不能右移");
            }
        } else {
            flag = index;
            if (flag <= end + 1) {
                if (flag > end) {
                    $(itemsArray[end + 1]).animate({left: "38px"}, 5000);
                    head = end + 1;
                    end--;
                } else if (runStatus == 1 && flag == end) {
                    $(itemsArray[end]).animate({left: "38px"}, 5000);
                    end--;
                    head = end + 1;
                    return;
                } else if (runStatus == 1) {
                    $(itemsArray[end]).animate({left: "38px"}, 5000);
                    rInterval = setInterval(function () {
                        if (flag <= end) {
                            $(itemsArray[end - 1]).animate({left: "38px"}, 5000);
                            end--;
                            head = end + 1;
                            _head = head;
                            console.log("R-head:", head, "end:", end);
                        }
                    }, 1500);
                } else {
                    $(itemsArray[end + 1]).animate({left: "38px"}, 5000);
                    rInterval = setInterval(function () {
                        if (flag <= end) {
                            $(itemsArray[end]).animate({left: "38px"}, 5000);
                            end--;
                            head = end + 1;
                            _head = head;
                            console.log("R-head:", head, "end:", end);
                        }
                    }, 1500);
                }
            } else {
                console.log("这一列现在不能右移");
            }
        }
        runStatus = 1;
    }*/

//左移
    $left.onclick = function () {
        if (status == -1) {
            console.log("现在不能左移哟！");
        } else {
            // $(".column-box").stop();
            var lie = $('#KN-this').text();
            var col = lie.split('-')[1];
            col = parseFloat(col);
            var data = {
                type: 'leftmove',
                qu_num: quNum,
                column: col
            };
            var state = $('#KN-state').text();
            if (state == '锁定') {
                alert('请先解锁！');
            } else {
                app.myajax(`http://${ip}/GDL`, 'POST', data, function (res) {
                    console.log(res);
                    if (res.code == "200") {
                        $('#KN-state').text(res.message);
                        // 更新状态
                    }
                    else {
                        alert('解锁失败')
                    }
                });
            }
            clearInterval(rInterval);
            clearInterval(lInterval);
            clearInterval(time);
            left();
            canStop();
            status = null;
            // area = 'left';
        }
    };

//右移
    $right.onclick = function () {
        if (status == 1) {
            console.log("现在不能右移哟！");
        } else {
            // $(".column-box").stop();
            // if(area == 'right' && _runStatus2 == -1){
            //     _flag2 = _flag2 + 2;
            // }

            var lie = $('#KN-this').text();
            var col = lie.split('-')[1];
            col = parseFloat(col);
            var data = {
                type: 'rightmove',
                qu_num: quNum,
                column: col
            };
            var state = $('#KN-state').text();
            if (state == '锁定') {
                alert('请先解锁！');
            } else {
                app.myajax(`http://${ip}/GDL`, 'POST', data, function (res) {
                    console.log(res);
                    if (res.code == "200") {
                        $('#KN-state').text(res.message);
                        // 更新状态
                    }
                    else {
                        alert('解锁失败')
                    }
                });
                clearInterval(lInterval);
                clearInterval(rInterval);
                clearInterval(time);
                right();
                canStop();
                status = null;
                // area = 'right';
            }
        }
    };

//暂停
//     $stop.onclick = function () {
//         $(".column-box").stop();
//         _runStatus2 = -1;
//         // if(fixed == '中'){
//         //
//         // }
//         // if(_runStatus1!=undefined){
//         //     _runStatus1 = -1;
//         // }else if( _runStatus2!=undefined){
//         //     _runStatus2 = -1;
//         // }else if( runStatus!=undefined){
//         //     runStatus = -1;
//         // }
//         var data = {
//             type: 'stop',
//             qu_num: quNum
//         };
//         var state = $('#KN-state').text();
//         app.myajax(`http://${ip}/GDL`, 'POST', data, function (res) {
//             console.log(res);
//             if (res.code == "200") {
//                 $('#KN-state').text(res.message);
//                 // 更新状态
//             }
//             else {
//                 alert('解锁失败')
//             }
//         });
//
//         canMove();
//         clearInterval(lInterval);
//         clearInterval(rInterval);
//         clearInterval(time);
//     };


};