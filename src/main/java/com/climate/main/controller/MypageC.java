package com.climate.main.controller;

import com.climate.main.dto.UserDTO;
import com.climate.main.service.CommunityDAO;
import com.climate.main.service.MypageDAO;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;

@Controller
public class MypageC {

    @Autowired
    private MypageDAO mypageDAO;

    @GetMapping("/mypage")
    public String moveMypage(HttpSession session, Model model, UserDTO userDTO) {
        userDTO.setU_id((String) session.getAttribute("user_id"));
        model.addAttribute("myinfo", mypageDAO.selectUserInfo(userDTO));
        model.addAttribute("content", "/mypage/mypage");
        return "index";
    }

    @GetMapping("/mypage/update")
    public String moveUpdateMypage(HttpSession session, Model model, UserDTO userDTO) {
        userDTO.setU_id((String) session.getAttribute("user_id"));
        model.addAttribute("myinfo", mypageDAO.selectUserInfo(userDTO));
        model.addAttribute("content", "/mypage/mypage_update");
        return "index";
    }

    @PostMapping("/mypage/update")
    public String updateMypage(HttpSession session, UserDTO userDTO) {
        userDTO.setU_id((String) session.getAttribute("user_id"));
        mypageDAO.updateUserInfo(userDTO);
        return "redirect:/mypage";
    }

}
