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

import java.io.IOException;

@Controller
public class LoginC {
    @Autowired
    private LoginDAO loginDAO;

    //jwt 클래스
    private JwtUtil jwtUtil;
    @Autowired
    public LoginC(JwtUtil jwtUtil) {
        this.jwtUtil = jwtUtil;
    }
    //구글 로그인 api 비밀값
    @Value("${google.client_id}")
    private String googleClientId;
    @Value("${google.redirect_url}")
    private String googleRedirectUrl;

    //구글 로그인 과정에서 타는 auth 컨트롤러
    @GetMapping("/login/oauth2/code/google")
    public String LoginAuth(@RequestParam("code") String code, Model model, HttpServletResponse response) {
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
                //jwt.setHttpOnly(true);
                jwt.setMaxAge(86400);
                jwt.setPath("/");
                response.addCookie(jwt);
                return "main";
            } else {
                return "sign/signup";
            }
        } else {
            return "main";
        }
    }

    //로그인 버튼 클릭시 타는 컨트롤러
    @GetMapping("/loginC")
    public void Login(HttpServletResponse response) {
        try {
            String googleOAuthUrl = "https://accounts.google.com/o/oauth2/v2/auth?client_id="+googleClientId+"&redirect_uri="+googleRedirectUrl+"&response_type=code&scope=email profile";
            response.sendRedirect(googleOAuthUrl);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }
}
