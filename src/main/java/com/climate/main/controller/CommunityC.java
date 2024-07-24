package com.climate.main.controller;

import com.climate.main.dto.CommunityDTO;
import com.climate.main.service.CommunityDAO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.UUID;

@Controller
public class CommunityC {

    @Autowired
    private CommunityDAO communityDAO;



    @GetMapping("/community/video")
    public String communityShowoff(Model model) {
        model.addAttribute("showoffLists", communityDAO.selectAllCommunityShowoff());
        model.addAttribute("content", "/community/community_menu");
        model.addAttribute("community_content", "/community/community_video");
        return "index";
    }

    @GetMapping("/community/lfg")
    public String communityLfg(Model model) {
        model.addAttribute("recruitment", communityDAO.selectAllCommunityRecruitment());
        model.addAttribute("content", "/community/community_menu");
        model.addAttribute("community_content", "/community/community_lfg");
        return "index";
    }

    @GetMapping("/community/video/insert")
    public String moveInsertCommunityShowoff(Model model) {
        model.addAttribute("content", "/community/community_video_insert");
        return "index";
    }

    @PostMapping("community/video/insert")
    public String insertCommunityShowoff(RedirectAttributes redirectAttributes, CommunityDTO communityDTO, Model model) {
        communityDAO.insertCommunityShowoff(communityDTO);
        return "redirect:/community/video";
    }

    @GetMapping("/community/video/detail")
    public String communityShowoffDetail(int b_pk, Model model) {
        model.addAttribute("showoffList", communityDAO.selectCommunityShowoff(b_pk));
        model.addAttribute("content", "/community/community_video_detail");
        return "index";
    }

}
