package com.climate.main.controller;

import com.climate.main.dto.ChatingDTO;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.servlet.view.RedirectView;

@Controller
public class ChatingC {

//    @Autowired
//    private ChatingDTO chatingDTO;

    @GetMapping("/chating")
    public RedirectView chating(HttpSession session, Model model) {
        String userId = (String) session.getAttribute("user_id");
        String redirectUrl = "https://popular-plainly-mongoose.ngrok-free.app?userId=" + userId;
        return new RedirectView(redirectUrl);
    }

}
