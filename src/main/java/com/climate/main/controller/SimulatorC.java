package com.climate.main.controller;

import com.climate.main.service.HoldDAO;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class SimulatorC {

    @Autowired
    private HoldDAO holdDAO;

    @GetMapping("/simulator_main")
    public String simulatorMain(HttpSession session, Model model){
        String userId = (String) session.getAttribute("user_id");
        model.addAttribute("user_id", userId);

        model.addAttribute("content", "/simulator/simulator_main");
        return "index";
    }

    @GetMapping("/simulator")
    public String simulator(Model model){
        model.addAttribute("holds", holdDAO.getAllHolds());
//        System.out.println(holdDAO.getAllHolds());
        model.addAttribute("content", "/simulator/simulator");
        return "index";
    }

    @GetMapping("/simulator_my_project")
    public String myProject(Model model){
        model.addAttribute("content", "/simulator/simulator_my_project");
        return "index";
    }

    @GetMapping("/simulator_gallery")
    public String simulatorGallery(Model model){
        model.addAttribute("content", "/simulator/simulator_gallery");
        return "index";
    }



}
