package com.climate.main.controller;

import com.climate.main.service.CommunityDAO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class CommunityC {

    @Autowired
    private CommunityDAO communityDAO;

    @GetMapping("/community/video")
    public  String communityShowoff(Model model){
        model.addAttribute("showoffLists", communityDAO.selectCommunityShowoff());
        model.addAttribute("content","/community/community_menu");
        model.addAttribute("community_content","/community/community_video");
        return "index";
    }

    @GetMapping("/community/lfg")
    public  String communityLfg(Model model){

        model.addAttribute("community_content","/community/community_lfg");
        return "/community/community_menu";
    }

}
