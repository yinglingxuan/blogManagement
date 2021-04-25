package com.example.demo;

import java.io.BufferedReader;
import java.io.File;
import java.io.IOException;
import java.io.InputStreamReader;
import java.lang.reflect.Method;
import java.net.InetAddress;
import java.net.URL;
import java.net.URLConnection;
import java.net.UnknownHostException;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.UUID;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.lionsoul.ip2region.DataBlock;
import org.lionsoul.ip2region.DbConfig;
import org.lionsoul.ip2region.DbSearcher;
import org.lionsoul.ip2region.Util;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.alibaba.fastjson.JSON;

@RestController
public class Dome {
	//用来保存用户信息的
	private List<User> list = new ArrayList<User>(); 
	//用来保存群聊的 信息的
	private List<DataDome> Data = new ArrayList<DataDome>();
	//用来保存私聊的信息的
	private List<DataDome> newData = new ArrayList<DataDome>();
	private static String version2 = "E:\\GeoLite2-City.mmdb";
	@RequestMapping("/index")
	public String index(HttpServletRequest request,HttpServletResponse response,String name,String jqr) throws IOException {
		response.setHeader("Content-Type", "text/html; charset=UTF-8");
		//获取到当前访问的ip地址
		String url=request.getRemoteHost();
		DataDome data = new DataDome();  //保存群聊的对象
		data.setText(name);     //将发送过来的信息保存
		if(jqr!=null) {     //判断机器人的名字是否为空
			data.setName(jqr);   //不为空名字就为机器人的名字
		}else {
			data.setName(url);  //为空就是自己本身的ip
		}
		Data.add(data);     //保存进list
		String datas = JSON.toJSONString(Data);   //转换成json
		IpUtil demo = new IpUtil();
		demo.getAddressByIP();
        AddressUtilst addressUtilst = new AddressUtilst();
        String str = "id="+demo.getIpAddr(request).toString();
        System.out.print(addressUtilst.getAddresses("ip = 127.0.0.1","UTF-8"));
        return demo.getIpAddr(request);
	}
	//测试根据ip获取到对应的位置
	@RequestMapping("/demos")
	public String demos(HttpServletRequest request,HttpServletResponse response,String name,String jqr){
		IpUtil demo = new IpUtil();
		demo.getAddressByIP();
		AddressUtilst addressUtilst = new AddressUtilst();
		String str = demo.getIpAddr(request).toString();

		System.out.println(str);
        IPUtils main = new IPUtils() ;
		System.err.println(main.getCity("192.161.63.130"));
		String datas = main.getCity("192.161.63.130");
		String ip = str;
		String country = datas.split("\\|")[0]; //国家
		String citys = datas.split("\\|")[1];  // 位置
		String province = datas.split("\\|")[2];  // 省或者州
		String city = datas.split("\\|")[3];  // 城市
		LocalDateTime time= LocalDateTime.now();

		String date = time.format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss"));   //当前时间
		System.out.println("时间："+date);
		System.out.println("国家："+country+" 省/州："+province+" 城市："+city+" 位置："+citys+ " ip："+ip);
		return main.getCity("220.248.12.158");
	}
	// 获取的类
	public class IPUtils {
		public String getCity(String ip) {
			String result = "";
			// 获取到文件地址 path
            String dbPath = IPUtils.class.getResource("/ip2region.db").getPath();
            // 读取文件
			File file = new File(dbPath);
			//如果失败就报异常
			if ( file.exists() == false ) {
				System.out.println("Error: Invalid ip2region.db file");
			}

			//查询算法
			int algorithm = DbSearcher.BTREE_ALGORITHM; //B-tree
			//DbSearcher.BINARY_ALGORITHM //Binary
			//DbSearcher.MEMORY_ALGORITYM //Memory
			try {
				DbConfig config = new DbConfig();
				DbSearcher searcher = new DbSearcher(config, dbPath);

				//define the method
				Method method = null;
				switch ( algorithm )
				{
					case DbSearcher.BTREE_ALGORITHM:
						method = searcher.getClass().getMethod("btreeSearch", String.class);
						break;
					case DbSearcher.BINARY_ALGORITHM:
						method = searcher.getClass().getMethod("binarySearch", String.class);
						break;
					case DbSearcher.MEMORY_ALGORITYM:
						method = searcher.getClass().getMethod("memorySearch", String.class);
						break;
				}

				DataBlock dataBlock = null;
				if ( Util.isIpAddress(ip) == false ) {
					System.out.println("Error: Invalid ip address");
				}

				dataBlock  = (DataBlock) method.invoke(searcher, ip);

				return dataBlock.getRegion();

			} catch (Exception e) {
				e.printStackTrace();
			}
			return result;
		}

	}
	public class IpUtil {
		public String getAddressByIP() {
			try
			{
				String strIP = "127.0.0.1";
				URL url = new URL( "http://ip.qq.com/cgi-bin/searchip?searchip1=" + strIP);
				URLConnection conn = url.openConnection();
				BufferedReader reader = new BufferedReader(new InputStreamReader(conn.getInputStream(), "GBK"));
				String line = null;
				StringBuffer result = new StringBuffer();
				while((line = reader.readLine()) != null)
				{
					result.append(line);
				}
				reader.close();
				strIP = result.substring(result.indexOf( "该IP所在地为：" ));
				strIP = strIP.substring(strIP.indexOf( "：") + 1);
				String province = strIP.substring(6, strIP.indexOf("省"));
				String city = strIP.substring(strIP.indexOf("省") + 1, strIP.indexOf("市"));
				System.out.print(strIP+"----"+province+"----"+city);
			}
			catch( IOException e)
			{
				return "读取失败";
			}
			return "结束";
		}
		public  String getIpAddr(HttpServletRequest request) {
			String ipAddress = null;
			try {
				ipAddress = request.getHeader("x-forwarded-for");
				if (ipAddress == null || ipAddress.length() == 0 || "unknown".equalsIgnoreCase(ipAddress)) {
					ipAddress = request.getHeader("Proxy-Client-IP");
				}
				if (ipAddress == null || ipAddress.length() == 0 || "unknown".equalsIgnoreCase(ipAddress)) {
					ipAddress = request.getHeader("WL-Proxy-Client-IP");
				}
				if (ipAddress == null || ipAddress.length() == 0 || "unknown".equalsIgnoreCase(ipAddress)) {
					ipAddress = request.getRemoteAddr();
					if (ipAddress.equals("127.0.0.1")) {
						// 根据网卡取本机配置的IP
						InetAddress inet = null;
						try {
							inet = InetAddress.getLocalHost();
						} catch (UnknownHostException e) {
							e.printStackTrace();
						}
						ipAddress = inet.getHostAddress();
					}
				}

				// 对于通过多个代理的情况，第一个IP为客户端真实IP,多个IP按照','分割
				if (ipAddress != null && ipAddress.length() > 15) { // "***.***.***.***".length()
					// = 15
					if (ipAddress.indexOf(",") > 0) {
						ipAddress = ipAddress.substring(0, ipAddress.indexOf(","));
					}
				}
			} catch (Exception e) {
				ipAddress="";
			}
			// ipAddress = this.getRequest().getRemoteAddr();

			return ipAddress;
		}
	}
	
	//获取最新的数据
			@RequestMapping("/data") 
			public String data(HttpServletRequest request,HttpServletResponse response) throws IOException {
				response.setHeader("Content-Type", "text/html; charset=UTF-8");
				String datas = JSON.toJSONString(Data);
				return datas;
			}
			//接收上线的信息
			@RequestMapping("/pop") 
			public String pop(HttpServletRequest request,HttpServletResponse response) throws IOException {
				response.setHeader("Content-Type", "text/html; charset=UTF-8");
				String url=request.getRemoteHost();
				User user = new User();
				user.setUrl(url);    //将ip保存
				Operation operation = new Operation();//工具类判断是否存在 去重
				int add = operation.add(list, url);    //不存在表示-1
				if(add==-1) {
					list.add(user);  //不存在就添加
				}
				String datas = JSON.toJSONString(list);
				return datas;
			}
			//刷新上线的信息
			@RequestMapping("/pop2") 
			public String pop2(HttpServletRequest request,HttpServletResponse response) throws IOException {
				response.setHeader("Content-Type", "text/html; charset=UTF-8");
				String datas = JSON.toJSONString(list);
				return datas;
			}
			
			
			//接收下线消息
			@RequestMapping("/quit") 
			public String quit(HttpServletRequest request,HttpServletResponse response) throws IOException {
				response.setHeader("Content-Type", "text/html; charset=UTF-8");
				String url=request.getRemoteHost();
				List list2 = new ArrayList<User>();  
				for (int i = 0; i < list.size(); i++) {
					if (!list.get(i).getUrl().equals(url)) {  //将要下线的ip替换掉
						list2.add(list.get(i));
					}
				}
				list=list2;
				System.out.println("退出:"+list);
				String datas = JSON.toJSONString(list);
				return datas;
			}
			
			//发送当前访问的ip
			@RequestMapping("/ip") 
			public String ip(HttpServletRequest request,HttpServletResponse response) throws IOException {
				response.setHeader("Content-Type", "text/html; charset=UTF-8");
				String url=request.getRemoteHost();
				return url;
			}
			//接收私聊的数据转发
			@RequestMapping("/privates") 
			public String privates(HttpServletRequest request,HttpServletResponse response,String name,String atip) throws IOException {
				response.setHeader("Content-Type", "text/html; charset=UTF-8");
				System.out.println("私聊："+name +":"+ atip);
				String url=request.getRemoteHost();//自己访问的ip
				DataDome data = new DataDome();
				data.setText(name);    //私聊的信息
				data.setName(url);     //本人
				data.setNewName(atip);  //要私聊的对象
				newData.add(data);     
				String datas = JSON.toJSONString(newData);
				return datas;
			}
			
			//获取最新的私聊数据
			@RequestMapping("/newData") 
			public String newData(HttpServletRequest request,HttpServletResponse response) throws IOException {
				response.setHeader("Content-Type", "text/html; charset=UTF-8");
				String datas = JSON.toJSONString(newData);
				return datas;
			}
			
			/*private ServletContext servletContext; //获取路径
*/			
			@RequestMapping("/upload") 
			public String upload(MultipartFile file,HttpServletRequest request,HttpServletResponse response) throws IOException {
				response.setHeader("Content-Type", "text/html; charset=UTF-8");
				System.out.println(file);
				
				String names=UUID.randomUUID() + "_" + file.getOriginalFilename();
				File files = new File("D:\\jee文档/SpringBoot-Ajax/src/main/webapp/img/"+names);
				file.transferTo(files); // 保存
				String text=null;
				if(names.endsWith(".mp4")) {
					text="<video  controls=\"true\" width=\"270\" autoplay><source src=\"img/"+names+"\" type='video/mp4'></video>";
				}else {
					text="<div id=\"sd\"><a href=\"img/"+names+"\">打开文件</a><a href=\"img/"+names+"\" download=\""+names+"\">下载文件</a></div>";
				}
				//获取到当前访问的ip地址
				String url=request.getRemoteHost();
				DataDome data = new DataDome();  //保存群聊的对象
				data.setText(text);     //将发送过来的信息保存
				data.setName(url);  //为空就是自己本身的ip
				Data.add(data);     //保存进list
				String datas = JSON.toJSONString(Data);   //转换成json 	
				return datas;
			}
			
		/*	String sps;
			//接收视频
			@RequestMapping("/sp") 
			public String sp(String sp,HttpServletRequest request,HttpServletResponse response) throws IOException {
				response.setHeader("Content-Type", "text/html; charset=UTF-8");	
				sps=sp;
				return sps;
			}*/
			
	
}
