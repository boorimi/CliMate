package com.climate.main.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class HC {

    @GetMapping("/HC")
    public String home(){
        return "main";
    }

    @GetMapping("/simulator")
    public  String simulator(){
        return "index";
    }



}
