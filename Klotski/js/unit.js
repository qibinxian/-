
/**
 * 
 * @private {文字按钮类 按钮本身阻止冒泡};
 * @param {config 文字参数配置 其中text为必填项 bubblType是否阻止事件冒泡}; 
 */
var textBtn = function(config,bubblType){
    this.config = config || {};
    this.bubblType = bubblType || false;
    this.setInfo();
    this.bubbling();
}
textBtn.prototype = new Laya.Text();

textBtn.prototype.setInfo = function(){
    this.fontSize = this.config.fontSize || this.fontSize;
    this.width = this.config.width || this.width;
    this.height = this.config.height || this.height;
    this.leading = this.config.leading || this.leading;
    this.bold = this.config.bold || this.bold;
    this.align = this.config.align || this.align;
    this.color = this.config.color || this.color;
    this.x = this.config.x || this.x;
    this.y = this.config.y || this.y;
    this.overflow = this.config.overflow || this.overflow;
    this.text = this.config.text;
    this.wordWrap = true;
    
}
textBtn.prototype.bubbling = function(){
    this.on(Laya.Event.MOUSE_DOWN,this,function(e){
        if(this.bubblType){
            e.stopPropagation();
        }
    });
    this.on(Laya.Event.MOUSE_UP,this,function(e){
        if(this.bubblType){
            e.stopPropagation();
        }
    });
    this.on(Laya.Event.CLICK,this,function(e){
        if(this.bubblType){
            e.stopPropagation();
        }
    });
}

var Btn = function(config){
    this.config = config || {};
    this.init();
}
Btn.prototype = new Laya.Sprite();
Btn.prototype.init = function(){
    this.loadImage(this.config.bg);
    this.x = this.config.x;
    this.y = this.config.y;
    this.text =  new textBtn({
        fontSize : 30,align : 'center',color : '#fff',width : this.width,height : this.height,y : (this.height - 30) >> 1,
        overflow : Laya.Text.HIDDEN,text : this.config.text,
    },false)
    this.addChild(this.text);
}

var Confirm = function(config,_this,fn){
    this.config = config;
    this.init();
    this.type = true;
    this.bg = new blackPop();
    this.doOK.on(Laya.Event.CLICK,this,function(e){
        this.type = true;
        fn && fn.bind(_this)(this.type);
        this.destroy();
        this.bg.close();
    });
    this.doFALSE.on(Laya.Event.CLICK,this,function(e){
        this.type = false;
        fn && fn.bind(_this)(this.type);
        this.destroy();
        this.bg.close();
    });
}
Confirm.prototype = new Laya.Sprite();
Confirm.prototype.init = function() {
    var config = this.config;
    this.size(config.width || 500,config.height || 500);
    Laya.stage.addChild(this);
    this.zOrder = 9999;
    this.graphics.drawRect(0, 0, config.width || 500, config.height || 500, "#ffffff");

    this.x = (750 - (config.width || 500)) >> 1;
    this.y = (Laya.stage.height - (config.height || 500)) >> 1;
    this.text = new textBtn({
        fontSize : 30,width : (500 - 100),height : 50,leading : 10,bold : true,align : 'center',color : '#000000',
        x : 50,y : 80,overflow : Laya.Text.AUTO,text : config.text,
    },true);
    this.addChild(this.text);
    this.doFALSE = new textBtn({
        fontSize : 26,width : 100,height : 50,leading : 10,bold : true,align : 'center',color : 'gray',
        x : 100,y : 300 - 80,overflow : Laya.Text.HIDDEN,text : config.left,
    },true);
    this.addChild(this.doFALSE);
    this.doOK = new textBtn({
        fontSize : 26,width : 100,height : 50,leading : 10,bold : true,align : 'center',color : 'green',
        x : 500 - 200,y : 300 - 80,overflow : Laya.Text.HIDDEN,text : config.right,
    },true);
    this.addChild(this.doOK);
}

var blackPop = function(){
    this.init();
}
blackPop.prototype.init = function() {
    if(this.blackBox){
        this.blackBox.visible = true;
    }else{
        this.blackBox = new Laya.Sprite();
        this.blackBox.zOrder = 9998;
        this.blackBox.size(750,1624);
        Laya.stage.addChild(this.blackBox);
        this.blackBox.alpha = 0.7;
        this.blackBox.graphics.drawRect(0, 0, Laya.stage.width, Laya.stage.height, "#000");
        this.blackBox.on(Laya.Event.CLICK,this,function(){})
    }
}
blackPop.prototype.close = function() {
    this.blackBox.visible = false;
}
