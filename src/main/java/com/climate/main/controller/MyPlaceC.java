package com.climate.main.controller;

import com.climate.main.service.MyPlaceDAO;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class MyPlaceC {
    @PostMapping("/WishC")
    public void WishC(HttpServletRequest request, HttpServletResponse response) {
        MyPlaceDAO.insertWish(request,response);
    }
}
