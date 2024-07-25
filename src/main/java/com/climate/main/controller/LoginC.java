package com.climate.main.controller;

import com.climate.main.dto.UserDTO;
import com.climate.main.service.LoginDAO;
import com.climate.main.util.JwtUtil;
import com.google.gson.JsonObject;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;

import java.net.http.HttpResponse;

@Controller
public class LoginC {
    @Autowired
    private LoginDAO loginDAO;

    private JwtUtil jwtUtil;

    @Autowired
    public LoginC(JwtUtil jwtUtil) {
        this.jwtUtil = jwtUtil;
    }

    @GetMapping("/login/oauth2/code/google")
    public String Login(@RequestParam String code, Model model, HttpServletResponse response) {

        System.out.println("call");
        JsonObject access_token = loginDAO.getAccessToken(code); //구글 액세스 토큰
        JsonObject userinfo = loginDAO.getUserInfo(access_token.get("access_token").getAsString()); //구글 정보 가져오기

        System.out.println("check user info => "+userinfo);
        model.addAttribute("name", userinfo.get("name").getAsString());
        model.addAttribute("email", userinfo.get("email").getAsString());
        model.addAttribute("profile", userinfo.get("picture").getAsString());

        UserDTO user = null;
        if(userinfo.get("email").getAsString() != null) {
            String u_id = userinfo.get("email").getAsString();
            user = loginDAO.getUserById("ds6951");
            String token = jwtUtil.generateToken(u_id); //구글 아이디 이용해서 jwt 토큰 생성

            if(user != null) {
                //브라우저 쿠키에 jwt 추가
                Cookie jwt = new Cookie("jwt", token);
                jwt.setHttpOnly(true);
                jwt.setMaxAge(86400);
                jwt.setPath("/");
                response.addCookie(jwt);

                return "index";
            } else {
                return "sign/signup";
            }
        } else {
            return "main";
        }
    }
}
