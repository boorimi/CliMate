package com.climate.main.controller;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class CommunityC {

    @GetMapping("/community/lfg")
    public  String community(Model model){
        model.addAttribute("content","/community/community_lfg");
        return "/community/community_menu";
    }

}
