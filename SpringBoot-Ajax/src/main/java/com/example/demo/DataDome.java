package com.example.demo;

public class DataDome {
	private int id;   
	private String name;
	private String newName; //˽�ĵĶ���
	private String text;
	private String Date;
	public int getId() {
		return id;
	}
	public void setId(int id) {
		this.id = id;
	}
	public String getName() {
		return name;
	}
	public void setName(String name) {
		this.name = name;
	}
	public String getNewName() {
		return newName;
	}
	public void setNewName(String newName) {
		this.newName = newName;
	}
	public String getText() {
		return text;
	}
	public void setText(String text) {
		this.text = text;
	}
	public String getDate() {
		return Date;
	}
	public void setDate(String date) {
		Date = date;
	}
	@Override
	public String toString() {
		return "DataDome [id=" + id + ", name=" + name + ", newName=" + newName + ", text=" + text + ", Date=" + Date
				+ "]";
	}
	
	
}
