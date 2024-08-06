package com.climate.main.controller;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class MiniMapC {

    @Value("${google.map_key}")
    String googleMapKey;

    @GetMapping("/miniMapC")
    public String MiniMapC(Model model) {
        model.addAttribute("mapKey", googleMapKey);
        return "/map/map";
    }
}
