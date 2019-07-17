var Klotski = Klotski || {};
Klotski.init = function(){
    this.Browser   = Laya.Browser;
    this.WebGL     = Laya.WebGL;
    this.Stage     = Laya.Stage;
    this.Stat      = Laya.Stat;
    this.Handler   = Laya.Handler;
    this.Image     = Laya.Image;
    this.Text      = Laya.Text;
    this.Tween     = Laya.Tween;
    this.Sprite    = Laya.Sprite;
    this.Event     = Laya.Event;
    this.Animation = Laya.Animation;
    this.TimeLine  = Laya.TimeLine;
    Laya.init(750,1624, Laya.WebGL);
    Laya.stage.scaleMode   = "fixedwidth";
    Laya.stage.screenMode  = Laya.Stage.SCREEN_VERTICAL;
    Laya.stage.alignH      = "center";
    Laya.stage.alignV      = "middle";
    // Laya.Stat.show(0, 0);
    
    this.order = 0;
    this.step = 0;
    this.points = [];
    this.place = [];
    this.loadArr();
}
Klotski.stype = {
    row : 4,
    cols : 5,
    pointStartX : 17,
    pointStartY : 160,
    spaceX : 144,
    spaceY : 144
}
Klotski.loadArr = function(){
    this.loader = Laya.loader;
    this.urls = ['img/bg.png','img/btn.png','img/frame.png','img/person.atlas'];
    this.loader.load(this.urls,this.Handler.create(this,this.onAssetloadedUI),this.Handler.create(this, this.onLoading, null, false));
}
Klotski.onLoading = function(progress){
    console.log("加载进度: " + progress);
}
Klotski.onAssetloadedUI = function(){
    this.bg = new this.Sprite();
    this.bg.loadImage('img/bg.png');
    Laya.stage.addChild(this.bg);
    this.frame = new this.Sprite();
    this.frame.loadImage('img/frame.png');
    Laya.stage.addChild(this.frame);
    this.frame.x = 56;
    this.frame.y = (Laya.stage.height - this.frame.height) >> 1;
    this.loadSurFace();
    this.loadBtn();
    this.loadInfo();

}
Klotski.loadInfo = function(){
    var info = arrayList[this.order];
    this.place = info.place.arr2Clone();
    // info
    for(var i = 0; i < this.stype.cols; i++) {
        for(var j = 0; j < this.stype.row; j++) {
            var place = info.place[i][j];
            if(place < 4){
                this.loadPerson(i, j, 'person/soldiers1.jpg', [0, 0, 144, 0, 144, 144, 0, 144, 0, 0],place);
            }
            else if(place >= 4 && place < 9){
                if(info.place[i][j + 1] && place == info.place[i][j + 1]){
                    this.loadPerson(i, j, 'person/General2_' + (place - 3) + '.jpg', [0, 0, 288, 0, 288, 144, 0, 144, 0, 0],place,1);
                }
                if(info.place[i + 1] && place == info.place[i + 1][j]){
                    this.loadPerson(i, j, 'person/General1_' + (place - 3) + '.jpg', [0, 0, 144, 0, 144, 288, 0, 288, 0, 0],place,2);
                }
            }
            else if(place == 9){
                if(info.place[i + 1] && place == info.place[i][j + 1] && place == info.place[i + 1][j + 1] && place == info.place[i + 1][j]) {
                    this.loadPerson(i, j, 'person/Principal.jpg', [0, 0, 288, 0, 288, 288, 0, 288, 0, 0],place);
                }
            }
        }
    }
    this.frame.on(this.Event.MOUSE_DOWN, this, this.onMouseDown);
    this.frame.on(this.Event.MOUSE_MOVE,this,this.onMouseMove);
    this.frame.on(this.Event.MOUSE_UP,this,this.onMouseUp);
    this.frame.on(this.Event.MOUSE_OUT,this,this.onMouseUp);

    this.title.text = (this.order + 1) + '、' + arrayList[this.order].name;
}
Klotski.loadSurFace = function(){
    this.title = new this.Text();
    this.title.text = (this.order + 1) + '、' + arrayList[this.order].name;
    this.frame.addChild(this.title);
    this.title.fontSize = 36;
    this.title.color = "#ffffff";
    this.title.x = 20;
    this.title.y = 60;

    this.stepTit = new this.Text();
    this.stepTit.text = '步数：' + this.step;
    this.frame.addChild(this.stepTit);
    this.stepTit.fontSize = 36;
    this.stepTit.color = "#ffffff";
    this.stepTit.x = 420;
    this.stepTit.y = 60;
}
Klotski.loadBtn = function(){
    // this.nextBtn = new this.Sprite();
    this.nextBtn = new Btn({
        bg : 'img/btn.png',
        x : 500,
        y : ((Laya.stage.height + this.frame.height) >> 1) + 30,
        text : '下一关'
    })
    Laya.stage.addChild(this.nextBtn);
    this.nextBtn.on(this.Event.MOUSE_DOWN, this, this.next);

    this.preBtn = new Btn({
        bg : 'img/btn.png',
        x : 100,
        y : ((Laya.stage.height + this.frame.height) >> 1) + 30,
        text : '上一关'
    })
    Laya.stage.addChild(this.preBtn);
    this.preBtn.on(this.Event.MOUSE_DOWN, this, this.pre);

    this.ResetBtn = new Btn({
        bg : 'img/btn.png',
        x : 300,
        y : ((Laya.stage.height + this.frame.height) >> 1) + 30,
        text : '重置'
    })
    Laya.stage.addChild(this.ResetBtn);
    this.ResetBtn.on(this.Event.MOUSE_DOWN, this, this.Reset);

    this.strategy = new Btn({
        bg : 'img/btn.png',
        x : 500,
        y : ((Laya.stage.height - this.frame.height) >> 1) - 100,
        text : '攻略'
    })
    Laya.stage.addChild(this.strategy);
    this.strategy.on(this.Event.MOUSE_DOWN, this,function(){
        new Confirm({
            text : '联系作者微信q411799907，并发送一元红包',
            left : '取消',
            right : '确认',
            width : 500,
            height : 300,
        },this,function(e){
            if(e){}
        })
        return false;
    });

}
Klotski.Reset = function(){
    for(var i = 0; i < this.points.length; i++){
        var point = this.points.shift();
        point.destroy();
        i--;
    }
    this.loadInfo();
    this.step = 0;
    this.stepTit.text = '步数：' + this.step;
}
Klotski.next = function(){
    if(this.order == arrayList.length - 1){
        new Confirm({
            text : '已是最后一关，敬请更新',
            left : '取消',
            right : '确认',
            width : 500,
            height : 300,
        },this,function(e){})
        return false;
    }
    this.order++;
    this.Reset();
}
Klotski.pre = function(){
    if(this.order == 0){
        new Confirm({
            text : '已是第一关，前面无关卡',
            left : '取消',
            right : '确认',
            width : 500,
            height : 300,
        },this,function(e){})
        return false;
    }
    this.order--;
    this.Reset();
}

Klotski.loadPerson = function(i, j, src, lines,place,direction){
    var point = new this.Sprite();
    point.loadImage(src);
    this.frame.addChild(point);
    point.x = this.countX(j);
    point.y = this.countY(i);
    point.graphics.drawLines(0, 0, lines, '#996a36', 3);
    point.pointX = j;
    point.pointY = i;
    point.place = place;
    point.direction = direction;

    this.points.push(point);
}
Klotski.countX = function(i){
    return i * this.stype.spaceX + this.stype.pointStartX;
}
Klotski.countY = function(i){
    return i * this.stype.spaceY + this.stype.pointStartY;
}

Klotski.onMouseDown = function(e) {
    if(e.touches && e.touches.length == 2){
        return false;
    }
    this.startX = e.stageX;
    this.startY = e.stageY;
    for(var i = 0; i < this.points.length; i++) {
        if(this.points[i].hitTestPoint(this.startX,this.startY)){
            this.point = this.points[i];
            this.result = this.bylaw(this.point,this.place);
            this.pointX = this.point.x;
            this.pointY = this.point.y;
            this.result.xarr.push(this.point.pointX);
            this.result.yarr.push(this.point.pointY);
            break;
        }
    }
    
}
Klotski.onMouseMove = function(e){
    if(e.touches && e.touches.length == 2){
        return false;
    }
    if(this.point && this.result.arr.length){
        if(this.result.direction.length == 1){
            if(this.result.direction[0] == 'x'){
                this.point.x = Math.max(Math.min((e.stageX - this.startX) + this.pointX, this.countX(Math.max.apply(null, this.result.xarr)) ), this.countX(Math.min.apply(null, this.result.xarr)));
            }else{
                this.point.y = Math.max(Math.min((e.stageY - this.startY) + this.pointY, this.countY(Math.max.apply(null, this.result.yarr)) ), this.countY(Math.min.apply(null, this.result.yarr)));
            }
        }
        else if(this.result.direction.length == 2){
            if(this.point.x == this.countX(this.point.pointX) && this.point.y == this.countY(this.point.pointY)){
                if(Math.abs(e.stageX - this.startX) > Math.abs(e.stageY - this.startY) ){
                    this.touchDir = 'x';
                }else{
                    this.touchDir = 'y';
                }
            }
            if(this.touchDir == 'x'){
                this.point.x = Math.max(Math.min((e.stageX - this.startX) + this.pointX, this.countX(Math.max.apply(null, this.result.xarr)) ), this.countX(Math.min.apply(null, this.result.xarr)));
            }else{
                this.point.y = Math.max(Math.min((e.stageY - this.startY) + this.pointY, this.countY(Math.max.apply(null, this.result.yarr)) ), this.countY(Math.min.apply(null, this.result.yarr)));
            }
        }
    }
    
}
Klotski.onMouseUp = function(e){
    if((e.touches && e.touches.length == 2) || !this.point){
        return false;
    }
    this.placeReset();
    if((this.result.direction[0] == 'x' && this.result.direction.length == 1) || this.touchDir == 'x'){
        var distance = Math.round((this.point.x - this.pointX) / this.stype.spaceX);
        if(distance){
            this.stepTit.text = '步数：' + ++this.step;
        }
        this.point.pointX += distance;
        this.Tween.to(this.point, {
            x: this.countX(this.point.pointX)
        }, 50);
    }
    if((this.result.direction[0] == 'y' && this.result.direction.length == 1) || this.touchDir == 'y'){
        var distance = Math.round((this.point.y - this.pointY) / this.stype.spaceY);
        if(distance){
            this.stepTit.text = '步数：' + ++this.step;
        }
        this.point.pointY += distance;
        this.Tween.to(this.point, {
            y: this.countY(this.point.pointY)
        }, 50);
    }
    this.placeLocation();
    if(this.point.place == 9 && this.point.pointY == 3 && this.point.pointX == 1){
        this.winer();
    }
    if(this.step >= 1000 && this.order == 33){
        new Confirm({
            text : '哈哈哈，这关是无解的，快去试试其他关吧',
            left : '取消',
            right : '下一关',
            width : 500,
            height : 300,
        },this,function(e){
            if(e){
                this.next();
            }
        })
    }
    this.point = null;
    this.touchDir = null;
}


Klotski.winer = function(){
    // alert('恭喜你，过关了');
    new Confirm({
        text : '恭喜过关，是否开始下一关',
        left : '取消',
        right : '下一关',
        width : 500,
        height : 300,
    },this,function(e){
        if(e){
            this.next();
        }
    })
    this.frame.off(this.Event.MOUSE_DOWN, this, this.onMouseDown);
    this.frame.off(this.Event.MOUSE_MOVE,this,this.onMouseMove);
    this.frame.off(this.Event.MOUSE_UP,this,this.onMouseUp);
    this.frame.off(this.Event.MOUSE_OUT,this,this.onMouseUp);
}

Klotski.placeReset = function(){
    if(this.point.place < 4){
        this.place[this.point.pointY][this.point.pointX] = 10;
    }
    else if(this.point.place >= 4 && this.point.place < 9){
        if(this.point.direction == 1){
            this.place[this.point.pointY][this.point.pointX] = 10;
            this.place[this.point.pointY][this.point.pointX + 1] = 10;
        }
        if(this.point.direction == 2){
            this.place[this.point.pointY][this.point.pointX] = 10;
            this.place[this.point.pointY + 1][this.point.pointX] = 10;
        }
    }
    else if(this.point.place == 9){
        this.place[this.point.pointY][this.point.pointX] = 10;
        this.place[this.point.pointY][this.point.pointX + 1] = 10;
        this.place[this.point.pointY + 1][this.point.pointX] = 10;
        this.place[this.point.pointY + 1][this.point.pointX + 1] = 10;
    }
}
Klotski.placeLocation = function(){
    if(this.point.place < 4){
        this.place[this.point.pointY][this.point.pointX] = this.point.place;
    }
    else if(this.point.place >= 4 && this.point.place < 9){
        if(this.point.direction == 1){
            this.place[this.point.pointY][this.point.pointX] = this.point.place;
            this.place[this.point.pointY][this.point.pointX + 1] = this.point.place;
        }
        if(this.point.direction == 2){
            this.place[this.point.pointY][this.point.pointX] = this.point.place;
            this.place[this.point.pointY + 1][this.point.pointX] = this.point.place;
        }
    }
    else if(this.point.place == 9){
        this.place[this.point.pointY][this.point.pointX] = this.point.place;
        this.place[this.point.pointY][this.point.pointX + 1] = this.point.place;
        this.place[this.point.pointY + 1][this.point.pointX] = this.point.place;
        this.place[this.point.pointY + 1][this.point.pointX + 1] = this.point.place;
    }
}

Klotski.bylaw = function(point,place){
    var x = point.pointX;
    var y = point.pointY;
    var d = [];
    var direction = [];
    var xarr = [];
    var yarr = [];

    if(point.place < 4){
        for(var i = x - 1; i >= 0; i--){//左
            if(place[y][i] == 10){
                d.push([y,i]);
                direction.push('x');
                xarr.push(i);
            }else{
                break;
            }
        }
        for(var i = x + 1; i < this.stype.row; i++){//右
            if(place[y][i] == 10){
                d.push([y,i]);
                direction.push('x');
                xarr.push(i);
            }else{
                break;
            }
        }
        for(var i = y - 1; i >= 0; i--){//上
            if(place[i][x] == 10){
                d.push([i,x]);
                direction.push('y');
                yarr.push(i);
            }else{
                break;
            }
        }
        for(var i = y + 1; i < this.stype.cols; i++){//下
            if(place[i][x] == 10){
                d.push([i,x]);
                direction.push('y');
                yarr.push(i);
            }else{
                break;
            }
        }
    }
    else if(point.place < 9){
        if(point.direction == 1){
            for(var i = x - 1; i >= 0; i--){//左
                if(place[y][i] == 10){
                    d.push([y,i]);
                    direction.push('x');
                    xarr.push(i);
                }else{
                    break;
                }
            }
            for(var i = x + 2; i < this.stype.row; i++){//右
                if(place[y][i] == 10){
                    d.push([y,i - 1]);
                    direction.push('x');
                    xarr.push(i - 1);
                }else{
                    break;
                }
            }
            for(var i = y - 1; i >= 0; i--){//上
                if(place[i][x] == 10 && place[i][x + 1] == 10){
                    d.push([i,x]);
                    direction.push('y');
                    yarr.push(i);
                }else{
                    break;
                }
            }
            for(var i = y + 1; i < this.stype.cols; i++){//下
                if(place[i][x] == 10 && place[i][x + 1] == 10){
                    d.push([i,x]);
                    direction.push('y');
                    yarr.push(i);
                }else{
                    break;
                }
            }
        }else{
            for(var i = x - 1; i >= 0; i--){//左
                if(place[y][i] == 10 && place[y + 1][i] == 10){
                    d.push([y,i]);
                    direction.push('x');
                    xarr.push(i);
                }else{
                    break;
                }
            }
            for(var i = x + 1; i < this.stype.row; i++){//右
                if(place[y][i] == 10 && place[y + 1][i] == 10){
                    d.push([y,i]);
                    direction.push('x');
                    xarr.push(i);
                }else{
                    break;
                }
            }
            for(var i = y - 1; i >= 0; i--){//上
                if(place[i][x] == 10){
                    d.push([i,x]);
                    direction.push('y');
                    yarr.push(i);
                }else{
                    break;
                }
            }
            for(var i = y + 2; i < this.stype.cols; i++){//下
                if(place[i][x] == 10){
                    d.push([i - 1,x]);
                    direction.push('y');
                    yarr.push(i - 1);
                }else{
                    break;
                }
            }
        }
    }
    else if(point.place == 9){
        for(var i = x - 1; i >= 0; i--){//左
            if(place[y][i] == 10 && place[y + 1][i] == 10){
                d.push([y,i]);
                direction.push('x');
                xarr.push(i);
            }else{
                break;
            }
        }
        for(var i = x + 2; i < this.stype.row; i++){//右
            if(place[y][i] == 10 && place[y + 1][i] == 10){
                d.push([y,i - 1]);
                direction.push('x');
                xarr.push(i - 1);
            }else{
                break;
            }
        }
        for(var i = y - 1; i >= 0; i--){//上
            if(place[i][x] == 10 && place[i][x + 1] == 10){
                d.push([i,x]);
                direction.push('y');
                yarr.push(i);
            }else{
                break;
            }
        }
        for(var i = y + 2; i < this.stype.cols; i++){//下
            if(place[i][x] == 10 && place[i][x + 1] == 10){
                d.push([i - 1,x]);
                direction.push('y');
                yarr.push(i - 1);
            }else{
                break;
            }
        }
    }
    direction = Array.from(new Set(direction));
    return {
        arr : d,
        direction : direction,
        xarr : xarr,
        yarr : yarr
    };
}

Klotski.init();