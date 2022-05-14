'use strict'

function File(...arg) {
    if(!(this instanceof File)){
        return new File(...arg);
    }
    this.argArr = arg;
}

File.prototype.preview = {
    doc: function () {
        this.insert = function (where) {
            var code = this.code;
            where.appendChild(code);
        }
    },
    docx: this.doc(),
    img: function () {
        this.insert = function (where) {
            var im = document.createElement('img');
            im.src = this.url;
            where.appendChild(im);
        }
    },
    video: function () {
        this.insert = function (where) {
            var video = document.createElement('video');
            video.src = this.url;
            where.appendChild(video);
        }
    },
    pdf: function () {
        this.insert = function (where) {
            var iframe = document.createElement('iframe');
            iframe.src = this.url;
            where.appendChild(iframe);
        }
    },
    factory: function (type) {
        var factory = new File();
        return factory.preview[type];
    }
};

File.prototype.createEle = function () {
    var shape = document.createElement('div');
    shape.className = 'shape';
    var cancel = document.createElement('div');
    cancel.className = 'cancel';
    cancel.id = 'cancel';

};
