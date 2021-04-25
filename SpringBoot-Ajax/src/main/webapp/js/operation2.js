		
										
		var palaces=-1; //记录艾特的位置
		var ip;    //记录当前ip
		var atip; //记录当前的选择的私聊ip
		var hint=[] ;  //用来提示当前有多少条私聊未读
//////////////////////////////////////////////////////////////////////////
//////////////获取ip的/////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////
		//一进来就直接访问服务器发送当前上线的ip
		$.ajax({
			url: "/ip",
			success: function(data, status, xhr){
				ip=data;   //当前的ip
			}, 
			error: function(xhr, status, errorThrown){
				console.warn(xhr, status, errorThrown);
			}
		})
		//角色上线
		var role=[];   //用来记录当前有多少个对象和最新的对象做对比
		$.ajax({     
			url: "/pop",
			dataType:'json',
			success: function(data, status, xhr){
				$("#role #ro").empty();     		 	//清除上线的人数重新加载
				$("#sel").empty();          		 	//清除选择艾特里面的数据重新加载
				for(var i=0;i<data.length;i++){     
					$("#role #ro").append("<li ondblclick='choice(this)'>"+data[i].url+"</li>");
					if(i==0){     					 //选择前两个默认的
						$("#sel").append("<option>选择</option>");
						$("#sel").append("<option>机器人</option>");
					}
					$("#sel").append("<option>"+data[i].url+"</option>");
				}
				var height=$("#role #ro").height();  	//保持看到最新上线的角色
				$("#role").scrollTop(height);
				role=data;  //保存当前的人数
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
					if(role.length!=data.length){    //判断是否来了新的数据和上面的老数据对比
						role=data;     //重新变为老数据
						$("#role #ro").empty();
						$("#sel").empty();
						for(var i=0;i<data.length;i++){
							$("#role #ro").append("<li ondblclick='choice(this)'>"+data[i].url+"</li>");
							if(i==0){
								$("#sel").append("<option>选择</option>");
								$("#sel").append("<option>机器人</option>");
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
//////////////////////////////////////////////////////////////////////////
//////////////发送群聊数据的/////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////
		var arr=[];  //用来保存上一次的数据
		$("#submit").click(function(e){  //群聊发送数据
			e.preventDefault();
			var imgs=$("#input").children();    //获取这个id下所有的标签
			if(imgs.length<=0){                 //判断是否有标签
				var name=$("#input").text();         //没有标签就发送文字
			}else{
				var name=$("#input").html();    //有标签就发送标签
			}
			$("#input").text("");   //情空这个输入框里面的信息
			if(/\@[机器人]\:*/.test(name)){    //判断是否艾特发送到机器人
				var txt2=name.split(":");  //获取到要发送给机器人的数据
				robot(txt2[1]);   //调用发送到机器人的方法
			}
			/*$("#text #txt").empty();  */  //清空
			add(name);    //调用发送的ajax  保存数据到后台
		});
		/*回车发送*/
		$("#input").keypress(function(e){
			if(e.keyCode==13){
				var imgs=$("#input").children();    //获取这个id下所有的标签
				if(imgs.length<=0){                 //判断是否有标签
					var name=$("#input").text();         //没有标签就发送文字
				}else{
					var name=$("#input").html();    //有标签就发送标签
				}
				if(/\@[机器人]\:*/.test(name)){    //艾特发送到机器人
					var txt2=name.split(":");
					robot(txt2[1]);   //调用发送到机器人的方法
				}
				/*$("#text #txt").empty();*/    //清空
				add(name);    //调用发送的ajax
				$("#input").text("");   //情空
			}
		})
		
		$("#input").keyup(function(e){
			if(e.keyCode==13){
				$("#input").empty();   //情空
			}
		})
		
		//////////////////////
		//机器人
		var counts=0;
		var jl;     //用来判断是否多次重复
		function robot(obj){
		  $.post("http://www.tuling123.com/openapi/api?key=d3bf70b873cf466e92515a324d7bf3ed&info="+obj+"&userid=1234567", function(data){
		  		var datas;  //记录机器人要说的话
	       		
	       		if(counts==0){
	       			jl=obj;
	       		}
	       		if(jl==obj){
	       			counts++;
	       			if(counts>2){
	       				datas="草你大爷，是不是傻，还是你是复读机，老是重复，事不过三，你几次了？！！！";
	       			}
	       		}else{
	       			counts=0;
	       		}
	       		if(counts<2&&/.*你叫什么.*/g.test(obj)||/.*你是谁.*/g.test(obj)&&counts<2){
	       			datas="我叫小樱";
	       		}else if(counts<2&&/.*你的主人是谁.*/g.test(obj)){
	       			datas="伟大的樱凌轩大人";
	       		}else{
	       			if(counts<=2){
	       				datas=data.text;
	       			}
	       		}
	       		add(datas,"机器人-小樱:");   //发送当前机器人的名字和获取机器人的数据
	       });
		}
		/*发送的ajax的方法*/
		function add(name,obj){    //nama 表示要发送的信息文字    obj 只是给机器人一个名字
			$.ajax({
				type:'post',
				url: "/index",
				data:{"name":name,"jqr":obj},
				dataType:'json',
				success: function(data, status, xhr){
					/*console.info(data, status, xhr);*/
					var n=arr.length; //从上次的老数据开始
					
					for(var i=n;i<data.length;i++){   /*从老数据的位置开始*/
						var make=aiters(data[i].text,i);   //调用判断1表示有艾特自己的并且大于这个艾特下标的数据改样式
						if(make==1&&i>palaces){
							$("#text #txt").append("<li class='golden'>"+data[i].name+"</li><li style='color: #FF0000;' >"+data[i].text+"</li>");
						}else{
							$("#text #txt").append("<li class='golden'>"+data[i].name+"</li><li>"+data[i].text+"</li>");
						}	
					}
					var height=$("#text #txt").height();  //每次都看到最新的数据
					$("#text").scrollTop(height);
					arr=data;   //保存老数据
				}, 
				error: function(xhr, status, errorThrown){
					console.warn(xhr, status, errorThrown);
				}
			});
		}
		//获取剪切板中的数据
		document.querySelector('#input').addEventListener('paste',function(e){
		 var cbd = e.clipboardData;    ////获取剪切板的数据
		    for(var i = 0; i <cbd.items.length; i++) {
		        var item = cbd.items[i];     //读取里面的数据
		        if(item.kind == "file"){    //找到等于file的内容
		            var blob = item.getAsFile();  //获取里面所有的自己
		            if (blob.size ==0) {
		                return;
		            }
		            // blob 就是从剪切板获得的文件 
					var reader = new FileReader();     //字符处理
				        reader.readAsDataURL(blob);    //对这个图片对象进行解析
				        reader.onload = function(e){   //解析完成后
				        	
				        	var a=$("#input").html();
				        	$("#input").html(a+'<img src="'+reader.result+'"/>');
				        }
		        }
		    }
		}, false);
	    //刷新是否有新的群聊数据
		setInterval(function(){
			$.ajax({
				url: "/data",
				dataType:'json',
				success: function(data, status, xhr){
					if(arr.length<data.length){    //判断是否来了新的数据
						bf();
						/*$("#text #txt").empty();*/
						var n=arr.length;
						for(var i=n;i<data.length;i++){   /*从老数据的位置开始*/
							var make=aiters(data[i].text,i);   //查看是否有艾特
							if(make==1&&i>palaces){
								$("#text #txt").append("<li class='golden'>"+data[i].name+"</li><li style='color: #FF0000;' >"+data[i].text+"</li>");
								
							}else{
								$("#text #txt").append("<li class='golden'>"+data[i].name+"</li><li>"+data[i].text+"</li>");
							}
						}
						arr=data;    //变成老数据
						var height=$("#text #txt").height(); //消息里面的总高度
						$("#text").scrollTop(height);      //每次看到最新的数据
					}
				}, 
				error: function(xhr, status, errorThrown){
					console.warn(xhr, status, errorThrown);
				}
			})
		},1000); 
		//判断是否有艾特如果有就为1
		function aiters(obj,i){    //并且接受当前艾特的位置
			if(/\@[.]*/.test(obj)&&i>palaces){ //判断是否有艾特
				var regex = /\@(.+?)\:/;		//获取艾特的ip
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
		//点击那个提示会获得最近的艾特下标
		function place(i){  //i表示记录这个艾特在哪个位置
			palaces=i;  //记录艾特的位置   表示看过了这个艾特
			$("#at").hide();   //将其隐藏
			shux(palaces);  //调用刷新数据的方法
		}
		//获取要艾特的对象
			$("#sel").change(function(){   //当数据发生了改变
				var a=$("#sel option:selected");    //获取选择的对象
				$("#input").text("@"+a.text()+":");
				$("#sel").empty();
				$.ajax({
					url: "/pop2",
					dataType:'json',
					success: function(data, status, xhr){
						for(var i=0;i<data.length;i++){
							if(i==0){
								$("#sel").append("<option>选择</option>");
								$("#sel").append("<option>机器人</option>");
							}
							$("#sel").append("<option>"+data[i].url+"</option>");
						}
					}, 
					error: function(xhr, status, errorThrown){
						console.warn(xhr, status, errorThrown);
					}
				})
			});
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
		//刷新艾特后的数据
		function shux(obj){   //传入上次艾特的位置
			$("#text #txt").empty();
			$.ajax({
				url: "/data",
				dataType:'json',
				success: function(data, status, xhr){
					for(var i=0;i<data.length;i++){
						$("#text #txt").append("<li class='golden'>"+data[i].name+"</li><li>"+data[i].text+"</li>");
					} 
					if(obj>=0){   //如果有艾特进来就跳到这个艾特的位置
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
//////////////////////////////////////////////////////////////////////////
//////////////发送私聊数据的/////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////
	//私聊功能 拖拽	
	$(document).ready(function(){     //加载完成后
	  var move=false;         //判断是否点击了
	  var _x,_y;
	  $("#private").mousedown(function(e){     //点击后
	    move=true;           					//点击后可以执行数标悬浮事件
	    _x=e.pageX-parseInt($("#private").css("left"));   //算出当前位置 
	    _y=e.pageY-parseInt($("#private").css("top")); 
	  }); 
	  $(document).mousemove(function(e){ 
	    if(move){     				//悬浮允许
	      var x=e.pageX-_x;//控件左上角到屏幕左上角的相对位置 
	      var y=e.pageY-_y; 
	      $("#private").css({"top":y,"left":x}); 
	    } 
	  }).mouseup(function(){ 
	    move=false; 
	  }); 
	});
	//点击关闭掉私聊的窗口
	$("#private .sp").click(function(){
		$("#private").hide();
		$("#private #nickname ul").empty();
		hint=newArr; //记录点击关闭时的数据
	})
	//双击后
	function choice(obj){
		$("#private").show();    //显示出私聊的窗口
		var make=-1;              //判断是重复
		var list=$("#private #nickname ul li");   //获取到这个私聊窗口里面的所有的对象
		for (var i=0;i<list.length;i++) {
			if(list[i].innerText==obj.innerText){     //这个对象和传进来的ip进行比较 是否已经在窗口了
				make=i;  
				break;
			}
			$("#private #nickname ul li:eq("+i+")").removeAttr("class");//删除前面选中的样式
		}
		if(make==-1){  //如果不存在就直接添加到后面
			$("#private #nickname ul").append("<li class='red' onclick='choose(this)'>"+obj.innerText+"</li>")
			atip=obj.innerText;      //表示当前选中的ip
			newRefresh(obj.innerText); //刷新这个ip下的数据
		}
	}
		//私聊的发送数据
		var newArr=[];
	   //获取私聊锁发送的数据和接收发送的数据
		$("#prsubmit").click(function(e){
			e.preventDefault();
			var imgs=$("#inp").children();    //获取这个id下所有的标签
			if(imgs.length<=0){                 //判断是否有标签
				var name=$("#inp").text();         //没有标签就发送文字
			}else{
				var name=$("#inp").html();    //有标签就发送标签
			}
			$("#inp").text("");					//清空
			/*$("#private #prtext ul").empty(); */   //清除重新加载
		  	add2(name);          //调用发送数据的方法
		});
		/*回车发送*/
		$("#inp").keydown(function(e){
			if(e.keyCode==13){
				var imgs=$("#inp").children();    //获取这个id下所有的标签
				if(imgs.length<=0){                 //判断是否有标签
					var name=$("#inp").text();         //没有标签就发送文字
				}else{
					var name=$("#inp").html();    //有标签就发送标签
				}
				$("#inp").text("");
				/*$("#private #prtext ul").empty();*/
			  	add2(name);
			}
		});
		$("#inp").keyup(function(e){
			if(e.keyCode==13){
				$("#inp").empty();   //情空
			}
		})
		
		
		
		//发送数据
		function add2(name){
			$("#private #prtext ul").empty();
			$.ajax({
				url: "/privates",
				data:{"name":name,"atip":atip},
				dataType:'json',
				success: function(data, status, xhr){
					for(var i=0;i<data.length;i++){ //判断接收数据是不是本人和发送数据是不是本人的数据
						if(data[i].newName==atip&&data[i].name==ip||data[i].newName==ip&&data[i].name==atip){
							$("#private #prtext ul").append("<li class='golden'>"+data[i].name+"</li><li>"+data[i].text+"</li>");
						}
					}
					newArr=data;    //变成老数据
					var height=$("#private #prtext").height();   //获取当前最新数据的位置
					$("#prtext").scrollTop(height+height);
				}, 
				error: function(xhr, status, errorThrown){
					console.warn(xhr, status, errorThrown);
				}
			})
		}
		//获取剪切板中的数据
		document.querySelector('#inp').addEventListener('paste',function(e){
		 var cbd = e.clipboardData;
		    for(var i = 0; i < cbd.items.length; i++) {
		        var item = cbd.items[i];
		        if(item.kind == "file"){
		            var blob = item.getAsFile();
		            if (blob.size == 0) {
		                return;
		            }
		            // blob 就是从剪切板获得的文件 
					var reader = new FileReader();
				        reader.readAsDataURL(blob);
				        reader.onload = function(e){
				        	var a=$("#input").html();
				        	$("#inp").html(a+'<img src="'+reader.result+'"/>');
				        }
		        }
		    }
		}, false);
		 //隔秒刷新是否有新的数据
		setInterval(function(){
			$.ajax({
				url: "/newData",
				dataType:'json',
				success: function(data, status, xhr){
					if(newArr.length<data.length){    //判断是否来了新的数据
						bf();
						newArr=data;
						$("#private #prtext ul").empty();
						for(var i=0;i<data.length;i++){	//判断接收数据是不是本人和发送数据是不是本人的数据
							if(data[i].newName==atip&&data[i].name==ip||data[i].newName==ip&&data[i].name==atip){
								$("#private #prtext ul").append("<li class='golden'>"+data[i].name+"</li><li>"+data[i].text+"</li>");
							}
						}
						var height=$("#private #prtext").height();
						$("#prtext").scrollTop(height);
					}
					newArr=data;    //变成老数据
					var count=data.length-hint.length;//算出有多少未读
					var aaa=$("#private").is(":hidden");   //判断是否隐藏
					if(aaa){     //如果是隐藏的就显示有多少未读
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
  		var list=$("#private #nickname ul li");   //获取窗口中的所有角色
		for (var i=0;i<list.length;i++) {
			$("#private #nickname ul li:eq("+i+")").removeAttr("class");		//删除前面的样式
			if($("#private #nickname ul li:eq("+i+")").text()==obj.innerText){  //判断是否选中的角色
				$("#private #nickname ul li:eq("+i+")").attr("class","red");    //重新给样式
			}
		}
		atip=obj.innerText;        //改变当前的ip
		newRefresh(obj.innerText); //刷新数据
  	}
	//上面标题颜色的变化
	setInterval(function(){
		var aee=["red","cyan","green","blue","orange","purple","#557CC1","#DA63FF","#93F100","#FECCE5"];
		var span=$("h1 span");   //获取所有的标签
		for (var i=0;i<span.length;i++) {   //循环
			var p=Math.random()*10;    //获取随机数
			var n=Math.ceil(p);   //取整
			$("h1 span:eq("+i+")").attr("style","color: "+aee[n]+";");   //每次都改变颜色
		}		
	},800); 
	//表情包设置
	var imgs=["表情包/101.gif","表情包/102.gif","表情包/103.gif","表情包/104.gif","表情包/105.gif","表情包/106.gif","表情包/108.gif","表情包/109.gif","表情包/110.gif","表情包/111.gif","表情包/112.gif","表情包/114.gif","表情包/209.gif","表情包/211.gif","表情包/215.gif","表情包/224.gif"];
	
	$("#face").click(function(){   //点击选择表情包
		$("#bq ul").empty();       //清除
		$("#bq").toggle();         //显示表情包内容
		for (var i=0;i<imgs.length;i++) {    //遍历出里面所有的表情
			$("#bq ul").append("<li onclick='faces(this)'><img src='"+imgs[i]+"'/></li>");
		}
	})
	
	
	function faces(obj){     //点击选择对应的表情包
		$("#bq").hide();    //将所有的表情包的div隐藏
		$("#input").html($("#input").html()+obj.innerHTML);    //将这个标签包放到输入框中
	}
	
	$("#input").focus(function(){     //输入款获取焦点就将表情包的div 隐藏 
		$("#bq").hide();
	});   
	
	$("#face2").click(function(){
		$("#bq2 ul").empty();
		$("#bq2").toggle();
		for (var i=0;i<imgs.length;i++) {
			$("#bq2 ul").append("<li onclick='faces2(this)'><img src='"+imgs[i]+"'/></li>");
		}
	})
	
	function faces2(obj){
		$("#bq2").hide();
		$("#inp").html($("#inp").html()+obj.innerHTML);
	}	
	
	$("#inp").focus(function(){ 
		$("#bq2").hide();
	});   
	
	
	//声音的播放
	function bf(){
		var  music = document.getElementById("bf");
		music.play();
	}
	
	/*视频播放*/
	var  music2 = document.getElementById("video1");
	music2.pause();
	
	$("#gox").click(function(e){
		$("#sp").show();
		music2.play();
	});
	$("#sp #p2").click(function(e){
		$("#sp").hide();
		music2.pause();
	})
	
	/*上传文件*/
	$("#sc").click(function(e){
		$("#files").show();
	})

	$("#files p").click(function(e){
		$("#files").hide();
	})


	$("#wjsc").click(function(){
		var f = $('#file')[0].files[0];  //获取到发送文件里面的数据
        var form = new FormData();     
       	form.append('file', f);      //放到formData里面
		$.ajax({                  //ajax发送
		    url: '/upload',
		    type: 'POST',
		    cache: false,
		    data: form,
		    processData: false,
		    contentType: false
		}).done(function(res) {
		}).fail(function(res) {});
	})
	
	
