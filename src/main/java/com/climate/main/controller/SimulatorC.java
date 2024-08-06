package com.climate.main.controller;

import com.climate.main.service.HoldDAO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class SimulatorC {

    @Autowired
    private HoldDAO holdDAO;

    @GetMapping("/simulator_main")
    public String simulatorMain(Model model){
        model.addAttribute("content", "/simulator/simulator_main");
        return "index";
    }

    @GetMapping("/simulator")
    public  String simulator(Model model){
        model.addAttribute("holds", holdDAO.getAllHolds());
//        System.out.println(holdDAO.getAllHolds());
        model.addAttribute("content", "/simulator/simulator");
        return "index";
    }



}
