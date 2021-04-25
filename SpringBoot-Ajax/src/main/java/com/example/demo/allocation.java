package com.example.demo;

import javax.servlet.MultipartConfigElement;


import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.web.servlet.MultipartConfigFactory;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;


/**
 * Hello world!
 *
 */
@SpringBootApplication
@Configuration
public class allocation 
{
    public static void main( String[] args )
    {
        System.out.println( "Hello World!" );
        SpringApplication.run(allocation.class, args);
    }
    
    /**  
     * 文件上传配置  
     * @return  
     */  
    @Bean  
    public MultipartConfigElement multipartConfigElement() {  
        MultipartConfigFactory factory = new MultipartConfigFactory();  
        //单个文件最大  
        factory.setMaxFileSize("1002400KB"); //KB,MB  
        /// 设置总上传数据总大小  
        factory.setMaxRequestSize("1002400KB");  
        return factory.createMultipartConfig();  
    }  
}
