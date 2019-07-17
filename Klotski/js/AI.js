/**
 * 
 * 广度优先搜算算法解决
 */

var AI = AI || {};

AI.init = function(){
    this.place = Klotski.place.arr2Clone();//数据克隆
    this.history = [];//已走过地图类型，记录数据防止重复
    this.allNodes = [];//每一步的所有走法（走到终点回溯上一步用，如果只求步数则可以不要）
    this.nextList;//下一步走法节点
    this.index; //关联链式结构
    this.Left = -1;//移动方式  重置为字符串移动 数组移动用于玩家滑动
    this.Right = 1;
    this.Up = -4;
    this.Down = 4;
    this.initMap = this.dimension(this.place).join("").replace(new RegExp(10,"g"), ' ');
    this.exchange = this.Testing();
    this.bfs();
}
AI.dimension = function(arr){//降维
    var newArr = [];
    for(var i = 0, len = arr.length; i < len; i++) {
        newArr = newArr.concat(arr[i]);
    }
    return newArr;
}
AI.Testing = function(){
    var hor = [];//横
    var ver = [];//竖
    for(var i = '4'; i < '9'; i++) {
        var just = this.initMap.indexOf(i);
        var back = this.initMap.lastIndexOf(i);
        if(just + 1 == back){
            hor.push(i);
        }
        else if(just + 4 == back){
            ver.push(i);
        }
    }
    return {hor : hor,ver : ver}
}

AI.Move = function(dir,map,noder,step2){
    var work = map.replace(new RegExp(noder,"g"), ' ').split("");
    for(var i = 0; i < 20; i++){
        if(map[i] == noder){
            var pos = i + dir;
            var x = i % 4;
            if (dir == this.Left  && x == 0 ||
                dir == this.Right && x == 3 ||
                pos < 0 || pos >= 20) return;

            if(work[pos] != ' ') return;
            work[pos] = noder;
        }
    }
    work = work.join('');
    //重复检查
    if (this.IsDuplicate(work)) return;
    //加入下一步,记录父
    this.nextList.push({"map":work, "parent":this.index});
    if (!step2){
        //试着走第二步，但不能退回
        if (dir != this.Right) this.Move(this.Left, work, noder, true);
        if (dir != this.Left) this.Move(this.Right, work, noder, true);
        if (dir != this.Down) this.Move(this.Up, work, noder, true);
        if (dir != this.Up) this.Move(this.Down, work, noder, true);
    }
}
AI.IsDuplicate=function(map){
    //相似的形状统一成一种，去重复
    var layout = map.replace(new RegExp("1","g"), '0')
                    .replace(new RegExp("2","g"), '0')
                    .replace(new RegExp("3","g"), '0');
    
    for(var i = 1, len = this.exchange.hor.length; i < len; i++ ) {
        layout = layout.replace(new RegExp(this.exchange.hor[i],"g"), this.exchange.hor[0])
    }
    for(var i = 1, len = this.exchange.ver.length; i < len; i++ ) {
        layout = layout.replace(new RegExp(this.exchange.ver[i],"g"), this.exchange.ver[0])
    }

    if (this.history.indexOf(layout) >= 0) return true;
    this.history.push(layout);
    //左右镜像（大约节约1/2时间），去重复
    var reverse = layout.split("");
    for (var k = 0; k < 20; k++){
        var x = 3 - (k % 4);
        var y = parseInt(k / 4);
        reverse[y * 4 + x] = layout[k];
    }
    reverse = reverse.join("");
    if (this.history.indexOf(reverse) >= 0) return true;
    return false;
}
AI.Print = function(){
    var outList = [];
    var parent = this.index;
    for (var level = this.allNodes.length - 1; level >= 0; level--){
        var outMap = this.allNodes[level][parent].map;
        parent = this.allNodes[level][parent].parent;
        outList.push(outMap);
    }
    var cnt = 0;
    for (var j = outList.length - 1; j >= 0; j--){
        console.log("--------------------------" + cnt++);
        for (var y = 0; y < 5; y++){
            console.info(outList[j].substr(y * 4, 4) + '          |' + y);
        }
    }
}

AI.bfs = function(){
    var curList = [{ "map" : this.initMap, "parent" : 0}];
    console.log('AI求解中，请稍后...');
    var begin = new Date();//开始时间
    // 迭代遍历每个可移动节点
    var whnum = 0;
    while(curList.length > 0){
        this.allNodes.push(curList);
        this.nextList = [];
        for(this.index = 0; this.index < curList.length; this.index++) {
            var map = curList[this.index].map;
            // 到达终点
            if(map[4 * 4 + 1] == '9' && map[ 4 * 4 + 2] == '9'){
                console.log("time:" + ((new Date()).getTime() - begin.getTime()));
                this.Print();
                return;
            }
            // 穷举当前可移动点，去重复，加入下一步
            for(var noder = '0'; noder <= '9'; noder++){
                this.Move(this.Left, map, noder);
                this.Move(this.Right, map, noder);
                this.Move(this.Up, map, noder);
                this.Move(this.Down, map, noder);
            }
        }
        //迭代
        curList = this.nextList;
    }
    console.log("无解");
}
