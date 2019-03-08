//获取元素
var wrap=document.querySelector('.wrap');//整体父级
var startCon=document.querySelector('.startCon');//开始界面
var startBtns=document.querySelector('.startBtns img');//开始按钮
var overCon=document.querySelector('.overCon');//结束界面
var nowScore=document.querySelector('.nowScore');//现在分数
var bestScore=document.querySelector('.bestScore');//最好成绩
var okBtn=document.querySelector('.ok')//ok按钮
var bird=document.querySelector('.bird')// 小鸟
var scoreCon=document.querySelector('.scoreCon');//分数
var pipeCon=document.querySelector('.pipeCon');//管道容器
//全局变量
var downTimer;//小鸟掉落计时器
var upTimer;//小鸟上升计时器，不加计时器，上升突兀
var createPipeTimer;//创建管道的计时器
var pipeMoveTimer;
var pipeArr=[];//所有管道
var score=0;//分数
var fs;

//分数渲染
function showScore(){
	//清除上一次分数
	//将score转成字符串
	//循环字符串取到每一个数字
	//创建图片，为图片设置src(利用档次取到的数字拼接)
	//将这个图片添加到scoreCon
   	 scoreCon.innerHTML='';
	var str=String(score);
	for(var i=0;i<str.length;i++){
		var newImg=document.createElement('img');
		newImg.src='img/'+str[i]+'.jpg';
		scoreCon.appendChild(newImg);
	}
}
showScore();

//小鸟掉落
function birdDown(){
	//top值累加，到达草地停止
	downTimer=setInterval(function(){
      bird.style.top=bird.offsetTop+2+'px';
      if(bird.offsetTop>397){
      	//草地
      	clearInterval(downTimer);
      }
	},20)
}

//小鸟上升
function birdUp(){
	//上升之前，清除掉落的计时器
	clearInterval(downTimer);
	//防止用户连续点击造成计时器叠加
	clearInterval(upTimer);
	//获取点击瞬间小鸟的top值
	var nowTop=bird.offsetTop;
	//这次点击的目标top值
	var mbTop=nowTop-30;
	upTimer=setInterval(function(){
	  bird.style.top=bird.offsetTop-2+'px';
	  //到达当此点击的目标top或top为0.不能再上升，得下降
	  if(bird.offsetTop<=mbTop || bird.offsetTop<=0){
	  	clearInterval(upTimer);
	  	birdDown();
	  }
	},20)
  
}

//创建管道一个管道
function createPipe(){
	var pipe=document.createElement('div');
	pipe.className='pipe';
	//随机高度
	var topHeight=rN(60,213);
	var bottomHeight=273-topHeight;
	//设置管道HTML内容（pipeup和pipedown）
	pipe.innerHTML='<div class="pipeUp" style="height:'+topHeight+'px"><div class="upHead"></div></div><div class="pipeDown" style="height:'+bottomHeight+'px"><div class="downHead"></div></div>';
    pipeCon.appendChild(pipe);
    pipeArr.push(pipe);
}

//管道移动
function pipeMove(){
	for(var j=0;j<pipeArr.length;j++){
	   pipeArr[j].style.left=pipeArr[j].offsetLeft-1+'px';

	   //碰撞检测
	   var res1=hit(pipeArr[j].children[0]);
	   var res2=hit(pipeArr[j].lastElementChild);
	   if(res1 || res2){
	   	//清除计时器
	   	clearInterval(createPipeTimer);
	   	clearInterval(pipeMoveTimer);
	   	clearInterval(downTimer);
	   	clearInterval(upTimer);
	   	overCon.style.display='block';
	   	wrap.onclick=null;
	   	//存最大分数
	   	var zgfs=localStorage.fs;
	   	console.log(zgfs);
	   	if(zgfs==undefined || score>zgfs){
	   		localStorage.fs=score;
	   		 bestScore.innerText=score;  
	   	}
	   	else if(nowScore.innerText <zgfs){
	   		bestScore.innerText=zgfs;
	   	}
	   	
	   }
	   //判断是否加分，小鸟完全通过管道
	   if(pipeArr[j].offsetLeft==-23){
	   	score++;
	   	nowScore.innerText=score;
	   	showScore();
	     
	    // if(res==null || nowScore.innerText>localStorage.bestScore){
	    // 	localStorage.maxScore=nowScore.innerText;
	    // 	console.log(localStorage.bestScore);
	    // 	bestScore.innerText=localStorage.maxScore;
	    // }
	   }
	   //当管道移出运行界面时，移出
	   if(pipeArr[j].offsetLeft<=-pipeArr[j].offsetWidth){
	   	pipeArr[j].remove();
	   	//匀速移除，移除第一个
	   	pipeArr.shift();
	   	j--;
	   }
	}
}

//两个碰撞检测（bird和box）碰撞成功，返回值为true
function hit(box){
     if(bird.offsetLeft + bird.offsetWidth >= box.parentNode.offsetLeft &&
      bird.offsetTop + bird.offsetHeight >= box.offsetTop && 
      bird.offsetLeft <= box.parentNode.offsetLeft + box.offsetWidth && 
      bird.offsetTop <= box.offsetTop + box.offsetHeight){
     	return true;
     } 
}


//游戏开始运行函数
function gameRun(){
	//小鸟掉落
	birdDown();
	//创建管道
	createPipeTimer=setInterval(createPipe,2500);
	//管道移动
	pipeMoveTimer=setInterval(pipeMove,10);

	//给wrap 绑定点击事件
	wrap.onclick=birdUp;

}
// gameRun();


//随机函数
function rN(min,max){
	return Math.round(Math.random()*(max-min)+min);
}

//开始点击事件
startBtns.onclick=function(){
	startCon.style.display='none';
	bird.style.display='block';
	gameRun();

}
//ok事件
okBtn.onclick=function(){
	pipeArr=[];
	pipeCon.innerHTML='';
	scoreCon.innerHTML='';
	score=0;
	scoreCon.innerHTML='<img src="img/'+0+'.jpg">';
	overCon.style.display='none';
	startCon.style.display='block';
	bird.style.display='none';
	// clearInterval(upTimer);
	// clearInterval(downTimer);
	bird.style.top='0px';
}			



