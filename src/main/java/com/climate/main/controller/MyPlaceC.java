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
    public void InsertWish(@ModelAttribute MyPlaceDTO myplaceDTO, HttpServletResponse response) {
        //테이블에 데이터 존재 확인 이후 insert, delete 실행
        if (myPlaceDAO.getOne(myplaceDTO) != null) {
            if (myPlaceDAO.deleteWish(myplaceDTO.getMp_u_id(), myplaceDTO.getMp_name(), myplaceDTO.getMp_type()) != 1) {
                response.setStatus(HttpServletResponse.SC_OK);
            } else {
                response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            }
        } else {
            if (myPlaceDAO.insertWish(myplaceDTO) == 1) {
                response.setStatus(response.SC_CREATED);
            } else {
                response.setStatus(response.SC_BAD_REQUEST);
            }
        }
    }

    @PostMapping("/deleteWish")
    public int DeleteWish(String mp_u_id, String mp_name, String mp_type) {
        return myPlaceDAO.deleteWish(mp_u_id, mp_name, mp_type);
    }

    @PostMapping("/insertCheck")
    public void InsertCheck(@ModelAttribute MyPlaceDTO myplaceDTO, HttpServletResponse response) {
        //테이블에 데이터 존재 확인 이후 insert, delete 실행
        if (myPlaceDAO.getOne(myplaceDTO) != null) {
            if (myPlaceDAO.deleteCheck(myplaceDTO.getMp_u_id(), myplaceDTO.getMp_name(), myplaceDTO.getMp_type()) == 1) {
                response.setStatus(response.SC_OK);
            } else {
                response.setStatus(response.SC_BAD_REQUEST);
            }
        } else {
            if (myPlaceDAO.insertCheck(myplaceDTO) == 1) {
                response.setStatus(response.SC_CREATED);
            } else {
                response.setStatus(response.SC_BAD_REQUEST);
            }

        }
    }

    @PostMapping("/deleteCheck")
    public int DeleteCheck(String mp_u_id, String mp_name, String mp_type) {
        return myPlaceDAO.deleteCheck(mp_u_id, mp_name, mp_type);
    }

    @GetMapping("/getOne")
    public void GetOne(HttpServletResponse response, @ModelAttribute MyPlaceDTO myplaceDTO) {
        System.out.println("check dto => " + myplaceDTO);
        if (myPlaceDAO.getOne(myplaceDTO) != null) {
            response.setStatus(response.SC_OK);
        } else {
            response.setStatus(response.SC_BAD_REQUEST);
        }
    }

    @GetMapping("/getAll")
    public List<MyPlaceDTO> GetAll(String mp_u_id) {
        System.out.println("check dto => " + mp_u_id);
        return myPlaceDAO.getAll(mp_u_id);
    }

    @GetMapping("/getAllById")
    public List<MyPlaceDTO> GetAllById(String mp_u_id, int page, int size) {
        return myPlaceDAO.getAllById(mp_u_id, page, size);
    }

    @GetMapping("/getAllByIdCnt")
    public int GetAllByIdCnt(String mp_u_id) {
        return myPlaceDAO.getAllByIdCnt(mp_u_id);
    }

    @GetMapping("/searchMyplace")
    public List<MyPlaceDTO> searchMyplace(String mp_u_id, String mp_name) {
        return myPlaceDAO.getSearchById(mp_u_id, mp_name);
    }

    @GetMapping("/getWishCnt")
    public int GetWishCnt(String mp_u_id) {
        return myPlaceDAO.getWishCntById(mp_u_id);
    }

    @GetMapping("/getCheckCnt")
    public int GetCheckCnt(String mp_u_id) {
        return myPlaceDAO.getCheckCntById(mp_u_id);
    }
}
