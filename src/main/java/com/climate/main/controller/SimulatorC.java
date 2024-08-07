package com.climate.main.controller;

import com.climate.main.service.HoldDAO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

@RequestMapping("/simulator")
@Controller
public class SimulatorC {

    @Autowired
    private HoldDAO holdDAO;

    @GetMapping("/main")
    public String simulatorMain(Model model){
        model.addAttribute("content", "/simulator/simulator_main");
        return "index";
    }

    @GetMapping("/create_project")
    public String simulator(Model model){
        model.addAttribute("holds", holdDAO.getAllHolds());
//        System.out.println(holdDAO.getAllHolds());
        model.addAttribute("content", "/simulator/simulator");
        return "index";
    }

    @GetMapping("/my_project")
    public String myProject(Model model){
        model.addAttribute("content", "/simulator/simulator_my_project");
        return "index";
    }

    @GetMapping("/gallery")
    public String simulatorGallery(Model model){
        model.addAttribute("content", "/simulator/simulator_gallery");
        return "index";
    }



}
