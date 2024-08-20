package com.climate.main.config;

import com.climate.main.filter.JwtSessionFilter;
import org.springframework.boot.web.servlet.FilterRegistrationBean;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class FilterConfig {
    @Bean(name = "customJwtSessionFilter")
    public FilterRegistrationBean<JwtSessionFilter> jwtSessionFilter(JwtSessionFilter jwtSessionFilter) {
        FilterRegistrationBean<JwtSessionFilter> registrationBean = new FilterRegistrationBean<>();
        registrationBean.setFilter(jwtSessionFilter);
        registrationBean.addUrlPatterns("/community/video/detail"); // 필터를 적용할 URL 패턴들
        registrationBean.addUrlPatterns("/community/video/insert");
        registrationBean.addUrlPatterns("/community/lfg/detail");
        registrationBean.addUrlPatterns("/community/lfg/insert");
        registrationBean.addUrlPatterns("/simulator/create");
        registrationBean.addUrlPatterns("/simulator/my_project");
        registrationBean.addUrlPatterns("/simulator/gallery_detail");
        registrationBean.setOrder(1); // 필터 순서 설정
        return registrationBean;
    }
}
