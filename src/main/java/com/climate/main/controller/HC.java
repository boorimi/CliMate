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


    @GetMapping("/simulator")
    public  String simulator(){

        return "index";
    }

    @GetMapping("/community/video")
    public  String community(Model model){
        model.addAttribute("content","/community/community_video");
        return "/community/community_menu";
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
