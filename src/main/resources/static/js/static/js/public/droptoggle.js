$('.drop-group').on('click', 'button', function (e) {
    if(this.dataset.toggle === 'dropdown'){
        $(this).next().toggle();
        $('.layui-laydate').hide();
        e.stopPropagation();
    }
});

document.body.addEventListener('click', function (e) {
    $('.dropdown-menu').hide();
});