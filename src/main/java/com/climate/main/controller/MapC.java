package com.climate.main.controller;

import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class MapC {
    @Value("${google.map_key}")
    private String mapKey;

    @GetMapping("/mapC")
    public String mapC(Model model, HttpSession session) {
        model.addAttribute("content", "/map/map.html");
        model.addAttribute("mapKey", mapKey);
        String userId = (String) session.getAttribute("user_id");
        model.addAttribute("user_id", userId);
        return "index";
    }
}
