let container = document.documentElement||document.body;
let img,div,src,btnleft,btnright;
var imgid=0;
let x,y,w,h,tx,ty,tw,th,ww,wh;
let closeMove=function(){
    if(div==undefined){
        return false;
    }
    div.style.opacity=0;
    img.style.height=h+"px";
    img.style.width=w+"px";
    img.style.left=x+"px";
    img.style.top=(y - container.scrollTop)+"px";
    // 延迟移除dom
    setTimeout(function(){
        div.remove();
        img.remove();
        btnright.remove();
        btnleft.remove();
    },100);
};

function getNaturalWidth(img){    
	var naturalSize = {};
    if (img.naturalWidth&&img.naturalHeight) { // 现代浏览器
        naturalSize.width = img.naturalWidth
        naturalSize.height = img.naturalHeight
    } else { // IE6/7/8
	    var image = new Image();
	    image.src = img.src;
		naturalSize.width = image.width;
		naturalSize.height = image.height; 
    }
    return naturalSize;
}

let closeFade=function(){
    if(div==undefined){
        return false;
    }
    div.style.opacity=0;
    img.style.opacity=0;
    // 延迟移除dom
    setTimeout(function(){
        div.remove();
        img.remove();
        btnright.remove();
        btnleft.remove();
    },100);
};

// 监听滚动关闭层
document.addEventListener("scroll",function(){
    closeFade();
});
document.querySelectorAll("img").forEach(v=>{

	if (v.parentNode.localName!='a') {
		v.id=imgid;
		imgid++;
		    v.addEventListener("click",function(e){ // 注册事件
	        // 记录小图的位置个大小
	        x=e.target.offsetLeft;
	        y=e.target.offsetTop;
	        w=e.target.offsetWidth;
	        h=e.target.offsetHeight;
	        src=e.target.src;
	        id=e.target.id;
	        // 创建遮罩层
	        div=document.createElement("div");
	        div.style.cssText=`
	            position:fixed;
	            left:0;
	            top:0;
	            bottom:0;
	            right:0;
	            background-color: rgba(75,75,75,0.5);
	            z-index:99999999;
	            transition:all .3s cubic-bezier(0.165, 0.84, 0.44, 1);
	        `;
	        document.body.appendChild(div);
	        setTimeout(function(){
	            div.style.opacity=1;
	        },0);
	        // (此处可以加loading)

	        // 创建副本
	        img=new Image();
	        btnright=document.createElement("button");
	        btnleft=document.createElement("button");
	        index=src.indexOf("?");
	        img.src=src.substr(0,index);
	        btnleft.style.cssText=`
			    position:fixed;
			    border-radius: 50%;
			    left:${x - 20}px;
			    top:${y - container.scrollTop + h/2}px;
			    width:50px;
			    height:50px;
			    border: 0px;
			    background-color: rgba(200,200,200,0.8);
			    font-size: 20px;
			    z-index: 999999999;
			    transition:all .3s cubic-bezier(0.165, 0.84, 0.44, 1);
			`;
			btnright.style.cssText=`
			    position:fixed;
			    border-radius: 50%;
			    left:${x + w + 20}px;
			    top:${y - container.scrollTop + h/2}px;
			    width:50px;
			    border: 0px;
			    height:50px;
			    font-size: 20px;
			    background-color: rgba(200,200,200,0.8);
			    z-index: 999999999;
			    transition:all .3s cubic-bezier(0.165, 0.84, 0.44, 1);
			`;
			btnleft.innerText="<";
			btnright.innerText=">";

			img.style.cssText=`
			    position:fixed;
			    left:${x}px;
			    top:${y - container.scrollTop}px;
			    width:${w}px;
			    height:${h}px;
			    z-index: 999999999;
			    transition:all .3s cubic-bezier(0.165, 0.84, 0.44, 1);
			    opacity:0;
			`;



	        btnleft.onclick=function(){
	        	if(id<=0){
	        		alert("已经是第一张了！");
	        		return;
	        	}
	        	id--;
	        	var left=document.getElementById(id);
	        	index=left.src.indexOf("?");
			    img.src=left.src.substr(0,index);
				x=left.offsetLeft;
				y=left.offsetTop;
				naturalSize = getNaturalWidth(left);
				w=naturalSize.width;
				h=naturalSize.height;
	        }
	        btnright.onclick=function(){
	        	
	        	if(id>=imgid-1){
	        		alert("已经是最后一张了！");
	        		return;
	        	}
	        	id++;
	        	var right=document.getElementById(id);
				index=right.src.indexOf("?");
			    img.src=right.src.substr(0,index);
				x=right.offsetLeft;
				y=right.offsetTop;
				console.log(right);
				naturalSize = getNaturalWidth(right);
				w=naturalSize.width;
				h=naturalSize.height;
	        }

	        naturalSize=getNaturalWidth(e.target);
	        w=naturalSize.width;
	        h=naturalSize.height;
	        
	        img.onload=function(){
	            document.body.appendChild(img);
	            document.body.appendChild(btnright);
	            document.body.appendChild(btnleft);

	            // 浏览器宽高
	            wh=window.innerHeight;
	            ww=window.innerWidth;

	            // 目标宽高和坐标

	            if(w/h<ww/wh){
	            	th=wh-80;
		            tw=w/h*th;
		            tx=(ww - tw) / 2;
		            ty=40;	            	
	            }

	            else{
	            	tw=ww*0.8;
	            	th=h/w*tw;
	            	tx=ww*0.1;
	            	ty=(wh-th)/2;
	            }

	            // 延迟写入否则不会有动画
	            setTimeout(function(){
	                img.style.opacity=1;
	                img.style.height=th+"px";
	                img.style.width=tw+"px";
	                img.style.left=tx+"px";
	                img.style.top=ty+"px";
	                btnleft.style.left=(tx-90)+"px";
	                btnleft.style.top=(ty+th/2)+"px";
	                btnright.style.left=(tx+tw+40)+"px";
	                btnright.style.top=(ty+th/2)+"px";
	                // 点击隐藏
	                div.onclick=img.onclick=closeMove;
	            },10);
	        };
	    });//end event
	}
});//end forEach