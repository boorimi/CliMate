package com.climate.main.controller;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class MapC {

    @Value("${google.map_key}")
    private String mapKey;

    @GetMapping("/mapC")
    public String mapC(Model model) {
        model.addAttribute("mapKey", mapKey);
        return "map/map";
    }
}
