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
        registrationBean.addUrlPatterns("/community/*", "/simulator/*"); // 필터를 적용할 URL 패턴들
        registrationBean.setOrder(1); // 필터 순서 설정
        return registrationBean;
    }
}
