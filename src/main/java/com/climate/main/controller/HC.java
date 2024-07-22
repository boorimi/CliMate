package com.climate.main.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class HC {

    @GetMapping("/")
    public String home(){
        return "main";
    }

    @GetMapping("/simulator")
    public  String simulator(){

        return "index";
    }

    @GetMapping("/community")
    public  String community(){
        return "index";
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
