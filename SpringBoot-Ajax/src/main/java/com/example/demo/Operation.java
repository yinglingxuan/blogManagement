package com.example.demo;

import java.util.List;

public class Operation {
	//判断这个ip是否重复
	public int add(List<User> list,String url) {
		int make=-1;
		for (User user : list) {
			if (user.getUrl().equals(url)) {
				make=1;
				break;
			}
		}
		return make;
	}
}
