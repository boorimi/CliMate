package com.climate.main.controller;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.servlet.view.RedirectView;

@Controller
public class HC {
    @GetMapping("/")
    public String home(HttpServletRequest request, Model model){
        HttpSession session = request.getSession();
        String user_id = (String) session.getAttribute("user_id");
        model.addAttribute("user_id", user_id);
        return "main";
    }

    @GetMapping("/map")
    public  String map(){
        return "index";
    }

    @GetMapping("/login")
    public  String login(){
        return "index";
    }

    @GetMapping("/chating")
    public RedirectView chating(HttpSession session, Model model) {
        String userId = (String) session.getAttribute("user_id");
        String redirectUrl = "https://popular-plainly-mongoose.ngrok-free.app?userId=" + userId;
        return new RedirectView(redirectUrl);
    }

}
