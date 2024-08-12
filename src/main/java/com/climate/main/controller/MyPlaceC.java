package com.climate.main.controller;

import com.climate.main.dto.MyPlaceDTO;
import com.climate.main.dto.UserDTO;
import com.climate.main.service.MyPlaceDAO;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
public class MyPlaceC {
    @Autowired
    private MyPlaceDAO myPlaceDAO;

    @PostMapping("/insertWish")
    public void WishC(@ModelAttribute MyPlaceDTO myplaceDTO, HttpServletRequest request, HttpServletResponse response) {
        if (myPlaceDAO.insertWish(myplaceDTO) == 1) {
            response.setStatus(response.SC_CREATED);
        } else {
            response.setStatus(response.SC_BAD_REQUEST);
        }
    }

    @GetMapping("/getOneWish")
    public void GetOneWish(HttpServletResponse response, @ModelAttribute MyPlaceDTO myplaceDTO) {
        System.out.println("check dto => " + myplaceDTO);
        if (myPlaceDAO.getOneWish(myplaceDTO) != null) {
            response.setStatus(response.SC_OK);
        } else {
            response.setStatus(response.SC_BAD_REQUEST);
        }
    }

    @GetMapping("/getAllWish")
    public List<MyPlaceDTO> GetAllWish(HttpServletResponse response, String mp_u_id) {
        System.out.println("check dto => " + mp_u_id);
        return myPlaceDAO.getAllWish(mp_u_id);
    }
}
