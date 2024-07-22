package com.climate.main.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class HC {

    @GetMapping("/")
    public String home(){
        return "main";
    }

    @GetMapping("/community")
    public String community(){
        return "/community/community_video";
    }



}
