package com.climate.main.controller;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class HC {
    @GetMapping("/")
    public String home(){
        return "main";
    }

    @GetMapping("/map")
    public  String map(){
        return "index";
    }

    @GetMapping("/login")
    public  String login(){
        return "index";
    }
}
