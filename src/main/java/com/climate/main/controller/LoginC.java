package com.climate.main.controller;

import com.climate.main.dto.UserDTO;
import com.climate.main.service.SignDAO;
import com.climate.main.util.JwtUtil;
import com.google.gson.JsonObject;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;

@Controller
public class LoginC {
    @Autowired
    private SignDAO signDAO;

    //jwt 클래스
    private JwtUtil jwtUtil;
    @Autowired
    public LoginC(JwtUtil jwtUtil) {
        this.jwtUtil = jwtUtil;
    }
    //구글 로그인 api 비밀값
    @Value("${google.client_id}")
    private String googleClientId;
    @Value("${google.redirect_uri}")
    private String googleRedirectUrl;
    @Value("${google.map_key}")
    private String mapKey;

    //구글 로그인 과정에서 타는 auth 컨트롤러
    @GetMapping("/login/oauth2/code/google")
    public String LoginAuth(@RequestParam("code") String code, Model model, HttpServletRequest request) {
        JsonObject access_token = signDAO.getAccessToken(code); //구글 액세스 토큰
        System.out.println("check in-----------");
        JsonObject userinfo = signDAO.getUserInfo(access_token.get("access_token").getAsString()); //구글 정보 가져오기

        System.out.println("check user info => "+userinfo);
        model.addAttribute("name", userinfo.get("name").getAsString());
        model.addAttribute("email", userinfo.get("email").getAsString());
        model.addAttribute("profile", userinfo.get("picture").getAsString());

        UserDTO user = null;
        if(userinfo.get("email").getAsString() != null) {
            String u_id = userinfo.get("email").getAsString();
            user = signDAO.getUserById(u_id);
            String token = jwtUtil.generateToken(u_id); //구글 아이디 이용해서 jwt 토큰 생성

            if(user != null) {
                // 세션에 JWT 저장
                HttpSession session = request.getSession();
                session.setAttribute("jwt", token);
                // JWT 이용해서 아이디값 가져오기 & 세션, 모델에 값 담기
                String jwt_u_id = jwtUtil.extractUserId(token);
                session.setAttribute("user_id", jwt_u_id);
                String user_id = (String) session.getAttribute("user_id");
                model.addAttribute("user_id", user_id);
                return "main";
            } else {
                model.addAttribute("content", "/sign/signup");
                model.addAttribute("mapKey", mapKey);
                return "index";
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

    //로그아웃 버튼 클릭시 타는 컨트롤러
    @GetMapping("/logoutC")
    public String logout(HttpServletRequest request) {
        try {
            HttpSession session = request.getSession(false);
            if (session != null) {
                // 세션 무효화
                session.invalidate();
            }

            // 로그인 페이지로 리다이렉트
            return "redirect:/";
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }
}
