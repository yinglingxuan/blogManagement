		var palaces=-1; //记录艾特的位置
		var ip;    //记录当前ip
		var atip; //记录当前的选择私聊的ip
		
		var hint=[] ;  //用来提示当前有多少条私聊未读
		$.ajax({
			url: "/ip",
			success: function(data, status, xhr){
				ip=data;
			}, 
			error: function(xhr, status, errorThrown){
				console.warn(xhr, status, errorThrown);
			}
		})
		
		
		
		//角色上线
		var role=[];
		$.ajax({
			url: "/pop",
			dataType:'json',
			success: function(data, status, xhr){
				$("#role #ro").empty();
				$("#sel").empty();
				for(var i=0;i<data.length;i++){
					$("#role #ro").append("<li ondblclick='choice(this)'>"+data[i].url+"</li>");
					if(i==0){
						$("#sel").append("<option>@选择</option>");
					}
					$("#sel").append("<option>"+data[i].url+"</option>");
				}
				var height=$("#role #ro").height();
				$("#role").scrollTop(height);
				
				role=data;
			}, 
			error: function(xhr, status, errorThrown){
				console.warn(xhr, status, errorThrown);
			}
		})
		//监听是否有新的角色上线
		setInterval(function(){
			$.ajax({
				url: "/pop2",
				dataType:'json',
				success: function(data, status, xhr){
					if(role.length!=data.length){    //判断是否来了新的数据
						role=data;
						$("#role #ro").empty();
						$("#sel").empty();
						for(var i=0;i<data.length;i++){
							$("#role #ro").append("<li ondblclick='choice(this)'>"+data[i].url+"</li>");
							if(i==0){
								$("#sel").append("<option>@选择</option>");
							}
							$("#sel").append("<option>"+data[i].url+"</option>");
						}
						var height=$("#role #ro").height();
						$("#role").scrollTop(height);
					}
				}, 
				error: function(xhr, status, errorThrown){
					console.warn(xhr, status, errorThrown);
				}
			})
		},1000); 
		
		
		var arr=[];  //用来保存上一次的数据
		$("#submit").click(function(e){
			e.preventDefault();
			$("#text #txt").empty();
			var json=$("#chat").stringJSON();
			$("#input #name").val("");
			$.ajax({
				url: "/index",
				data:json,
				dataType:'json',
				success: function(data, status, xhr){
					console.info(data, status, xhr);
					for(var i=0;i<data.length;i++){
						var make=aiters(data[i].text,i);   //查看是否有艾特
						if(make==1&&i>palaces){
							$("#text #txt").append("<li class='golden'>"+data[i].name+"</li><li style='color: #FF0000;' >"+data[i].text+"</li>");
						}else{
							$("#text #txt").append("<li class='golden'>"+data[i].name+"</li><li>"+data[i].text+"</li>");
						}	
					}
					var height=$("#text #txt").height();
					$("#text").scrollTop(height);
					arr=data;   //保存
				}, 
				error: function(xhr, status, errorThrown){
					console.warn(xhr, status, errorThrown);
				}
			})
		});
	
	    //刷新是否有新的数据
		setInterval(function(){
			$.ajax({
				url: "/data",
				dataType:'json',
				success: function(data, status, xhr){
					if(arr.length<data.length){    //判断是否来了新的数据
						arr=data;
						$("#text #txt").empty();
						for(var i=0;i<data.length;i++){
							var make=aiters(data[i].text,i);   //查看是否有艾特
							if(make==1&&i>palaces){
								$("#text #txt").append("<li class='golden'>"+data[i].name+"</li><li style='color: #FF0000;' >"+data[i].text+"</li>");
								
							}else{
								$("#text #txt").append("<li class='golden'>"+data[i].name+"</li><li>"+data[i].text+"</li>");
							}
						}
						var height=$("#text #txt").height(); //消息里面的总高度
						$("#text").scrollTop(height);      //每次看到最新的数据
					}
				}, 
				error: function(xhr, status, errorThrown){
					console.warn(xhr, status, errorThrown);
				}
			})
		},1000); 
		
		
		
		function aiters(obj,i){
			if(/\@[.]*/.test(obj)&&i>palaces){ //判断是否有艾特
				var regex = /\@(.+?)\:/;		//获取ip
				var txt=obj.match(regex);
				
				if(txt!=null){
					if(txt[1]==ip){ //判断艾特的是谁
						$("#at").empty();
						$("#at").append("<p onclick='place("+i+")'>"+"有专属你的信息"+"</p>");
						$("#at").show();
						return 1;
					}
				}
			}
			return -1;			
		}
		function place(i){  //记录这个艾特在哪个位置
			palaces=i;  //记录艾特的位置
			
			$("#at").hide();
			shux(palaces);
		}
		
		
		//点击退出
		$("#butt").click(function(){
			 $.ajax({
					url: "/quit",
					dataType:'json',
					success: function(data, status, xhr){
						$("#role #ro").empty();
						$("#sel").empty();
						for(var i=0;i<data.length;i++){
							$("#role #ro").append("<li>"+data[i].url+"</li>");
							if(i==0){
								$("#sel").append("<option>@选择</option>");
							}
							$("#sel").append("<option>"+data[i].url+"</option>");
						}
					}, 
					error: function(xhr, status, errorThrown){
						console.warn(xhr, status, errorThrown);
					}
				})
		})
	
		
		//获取要艾特的对象
			$("#sel").change(function(){   //当数据发生了改变
				var a=$("#sel option:selected");    //获取选择的对象
				$("#input #name").val("@"+a.text()+":");
			});
			
		//刷新数据
		function shux(obj){
			$("#text #txt").empty();
			$.ajax({
				url: "/data",
				dataType:'json',
				success: function(data, status, xhr){
					for(var i=0;i<data.length;i++){
						$("#text #txt").append("<li class='golden'>"+data[i].name+"</li><li>"+data[i].text+"</li>");
					}
					if(obj>0){
						var a= $("#text #txt li:eq("+obj+")").position().top;
						$("#text").scrollTop(a);      //每次看到最新的数据
					}else{
						var height=$("#text #txt").height(); //消息里面的总高度
						$("#text").scrollTop(height);      //每次看到最新的数据
					}
				}, 
				error: function(xhr, status, errorThrown){
					console.warn(xhr, status, errorThrown);
				}
			})
		}
	//私聊功能	
	$(document).ready(function(){ 
	  var move=false;
	  var _x,_y;
	  $("#private").mousedown(function(e){ 
	    move=true; 
	    _x=e.pageX-parseInt($("#private").css("left")); 
	    _y=e.pageY-parseInt($("#private").css("top")); 
	  }); 
	  $(document).mousemove(function(e){ 
	    if(move){ 
	      var x=e.pageX-_x;//控件左上角到屏幕左上角的相对位置 
	      var y=e.pageY-_y; 
	      $("#private").css({"top":y,"left":x}); 
	    } 
	  }).mouseup(function(){ 
	    move=false; 
	  }); 
	});
	
	//点击关闭
	$("#private .sp").click(function(){
		$("#private").hide();
		$("#private #nickname ul").empty();
		hint=newArr; //记录点击关闭时的数据
	})

	
	//双击后
	function choice(obj){
		$("#private").show();
		var make=-1;
		var list=$("#private #nickname ul li");
		for (var i=0;i<list.length;i++) {
			if(list[i].innerText==obj.innerText){
				make=i;
				break;
			}
			$("#private #nickname ul li:eq("+i+")").removeAttr("class");//删除前面的样式
		}
		if(make==-1){
			$("#private #nickname ul").append("<li class='red' onclick='choose(this)'>"+obj.innerText+"</li>")
			atip=obj.innerText;
			newRefresh(obj.innerText); //刷新数据
		}
	}



		var newArr=[];
	   //获取私聊锁发送的数据和接收发送的数据
		$("#prsubmit").click(function(e){
			e.preventDefault();
			$("#private #prtext ul").empty();
		  	var name=$("#inp #prname").val();
		  	$("#inp #prname").val("");
			$.ajax({
				url: "/privates",
				data:{"name":name,"atip":atip},
				dataType:'json',
				success: function(data, status, xhr){
					for(var i=0;i<data.length;i++){
						if(data[i].newName==atip&&data[i].name==ip||data[i].newName==ip&&data[i].name==atip){
							$("#private #prtext ul").append("<li class='golden'>"+data[i].name+"</li><li>"+data[i].text+"</li>");
						}
					}
					newArr=data;
					var height=$("#private #prtext").height();
					$("#prtext").scrollTop(height+height);
				}, 
				error: function(xhr, status, errorThrown){
					console.warn(xhr, status, errorThrown);
				}
			})
		});
		 //刷新是否有新的数据
		setInterval(function(){
			$.ajax({
				url: "/newData",
				dataType:'json',
				success: function(data, status, xhr){
					if(newArr.length<data.length){    //判断是否来了新的数据
						newArr=data;
						$("#private #prtext ul").empty();
						for(var i=0;i<data.length;i++){
							if(data[i].newName==atip&&data[i].name==ip||data[i].newName==ip&&data[i].name==atip){
								$("#private #prtext ul").append("<li class='golden'>"+data[i].name+"</li><li>"+data[i].text+"</li>");
							}
						}
						var height=$("#private #prtext").height();
						$("#prtext").scrollTop(height);
					}
					newArr=data;
					var count=data.length-hint.length;//算出有多少未读
					var aaa=$("#private").is(":hidden");
					if(aaa){
						if(count>0){
							$("#wd").empty();
							$("#wd").append("未读有:"+count);
						}
					}
				}, 
				error: function(xhr, status, errorThrown){
					console.warn(xhr, status, errorThrown);
				}
			})
		},1000); 

	//刷新对私聊角色的数据
	function newRefresh(ips){
		$("#private #prtext ul").empty();
		$("#wd").empty(); //未读的以读取
		$.ajax({
				url: "/newData",
				dataType:'json',
				success: function(data, status, xhr){
					newArr=data;
					$("#private #prtext ul").empty();
					for(var i=0;i<data.length;i++){
						hint=data; //点击后获取最新的数据去比较
						if(data[i].newName==ips&&data[i].name==ip||data[i].newName==ip&&data[i].name==ips){
							$("#private #prtext ul").append("<li class='golden'>"+data[i].name+"</li><li>"+data[i].text+"</li>");
						}
					}
					newArr=data;
					var height=$("#private #prtext").height();
					$("#prtext").scrollTop(height);
				}, 
				error: function(xhr, status, errorThrown){
					console.warn(xhr, status, errorThrown);
				}
			})
	}
	//点击选择对应的角色私聊
  	function choose(obj){
  		var list=$("#private #nickname ul li");
		for (var i=0;i<list.length;i++) {
			$("#private #nickname ul li:eq("+i+")").removeAttr("class");//删除前面的样式
			if($("#private #nickname ul li:eq("+i+")").text()==obj.innerText){
				$("#private #nickname ul li:eq("+i+")").attr("class","red");
			}
		}
		atip=obj.innerText;
		newRefresh(obj.innerText); //刷新数据
  	}
	

	
	setInterval(function(){
		var aee=["red","cyan","green","blue","orange","purple","#557CC1","#DA63FF","#93F100","#FECCE5"];
		var span=$("h1 span");
		for (var i=0;i<span.length;i++) {
			var p=Math.random()*10;
			var n=Math.ceil(p);
			$("h1 span:eq("+i+")").attr("style","color: "+aee[n]+";");
		}		
	},800); 
	


