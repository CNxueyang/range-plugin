function getPos(obj){
	var pos={left:0,top:0};
	while(obj){
		pos.left+=obj.offsetLeft;
		pos.top+=obj.offsetTop;
		obj=obj.offsetParent;
	}
	return pos;
}
function bind(obj,evname,evFn,x){
	var a=x||false;
	if(obj.addEventListener){
		obj.addEventListener(evname,evFn,a);
	}else{
		obj.attachEvent("on"+evname,function(){
			evFn.call(obj);//call中第一个参数为this指代对象，为了低版本浏览器this对象兼容问题
		})
	}
}
function unbind(obj,evname,evFn){
	if(obj.addEventListener){
		obj.removeEventListener(evname,evFn,false);
	}else{
		obj.detachEvent("on"+evname,function(){
			evFn.call(obj);//call中第一个参数为this指代对象，为了低版本浏览器this对象兼容问题
		})
	}
}
			//滑块效果封装
function Range(box,imax){
	this.box=box;
	this.max=imax;
	this.sp=this.box.getElementsByTagName("span")[0];
	this.iWidth=this.box.offsetWidth;
	this.iWidth1=this.sp.offsetWidth;
	this.value=Math.ceil(this.max*(this.sp.offsetLeft/(this.iWidth-this.iWidth1)));
	this.fn=function(){};
	var _this=this;
	bind(this.sp,"mousedown",function(ev){
		var e=ev||event;
		try{e.stopPropagation()}catch(x){window.event.cancelBubble=true;}
		_this.mousedown(e);
	},true);
	bind(this.box,"mousedown",function(ev){
		var e=ev||event;
		try{e.stopPropagation()}catch(x){window.event.cancelBubble=true;}
		_this.boxdown(e);
	},false);
}
Range.prototype.mousedown=function(e){
	var _this=this;
	var disx=e.clientX-this.sp.offsetLeft;
	document.onmousemove=function(ev){
		var e=ev||event;
		try{e.preventDefault()}catch(x){e.returnValue=false;}
		_this.sp.style.left=e.clientX-disx+"px";
		if(_this.sp.offsetLeft+_this.iWidth1>_this.iWidth){
			_this.sp.style.left=_this.iWidth-_this.iWidth1+"px";
		}
		if(_this.sp.offsetLeft<0){
			_this.sp.style.left="0px";
		}
		_this.value=Math.ceil(_this.max*(_this.sp.offsetLeft/(_this.iWidth-_this.iWidth1)));
		_this.fn();
		return false;
	}
	document.onmouseup=function(){
		document.onmousemove=document.onmouseup=null;
		return false;
	}
}
Range.prototype.boxdown=function(e){
	var _this=this;
		var disX=e.clientX-getPos(this.box).left;
		this.sp.style.left=disX+"px";
		if(_this.sp.offsetLeft+_this.iWidth1>_this.iWidth){
			_this.sp.style.left=_this.iWidth-_this.iWidth1+"px";
		}
		if(_this.sp.offsetLeft<0){
			_this.sp.style.left="0px";
		}
		this.value=Math.ceil(this.max*(this.sp.offsetLeft/(this.iWidth-this.iWidth1)));
		this.fn();
}
Range.prototype.valChange=function(val){//传入数值，控制拉动条
	this.value=val?val:this.value;
	this.sp.style.left=this.value*(this.iWidth-this.iWidth1)/this.max+"px";
}
Range.prototype.val=function(){
	return this.value;
}