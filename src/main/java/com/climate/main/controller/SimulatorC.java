package com.climate.main.controller;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class SimulatorC {

    @GetMapping("/simulator")
    public  String simulator(Model model){
        model.addAttribute("content", "/simulator/simulator");
        return "index";
    }
}
