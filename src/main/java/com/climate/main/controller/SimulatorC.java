package com.climate.main.controller;

import com.climate.main.service.HoldDAO;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;

@RequestMapping("/simulator")
@Controller
public class SimulatorC {

    @Autowired
    private HoldDAO holdDAO;

    @GetMapping("/main")
    public String simulatorMain(HttpSession session, Model model){
        String userId = (String) session.getAttribute("user_id");
        model.addAttribute("user_id", userId);
//        System.out.println(userId);
        model.addAttribute("content", "/simulator/simulator_main");
        return "index";
    }

    @GetMapping("/create_project")
    public String simulator(Model model){
        model.addAttribute("holds", holdDAO.getAllHolds());
//        System.out.println(holdDAO.getAllHolds());
        model.addAttribute("content", "/simulator/simulator");
        return "index";
    }

    @GetMapping("/my_project")
    public String myProject(Model model){
        model.addAttribute("content", "/simulator/simulator_my_project");
        return "index";
    }

    @GetMapping("/gallery")
    public String simulatorGallery(Model model){
        model.addAttribute("content", "/simulator/simulator_gallery");
        return "index";
    }

    @PostMapping("/upload")
    public ResponseEntity<String> uploadFile(@RequestParam("file") MultipartFile file) {
        String projectPath = System.getProperty("user.dir") + "/src/main/resources/static/upload/s_project/";
        String res = "";

        try {
            // 파일 객체 생성                                 //업로드된 파일의 원본 이름
            File targetFile = new File(projectPath + file.getOriginalFilename());
            System.out.println("패치: "+projectPath);
            // 파일 저장
            file.transferTo(targetFile);
            System.out.println("저장 성공");

            res = "success";
            return ResponseEntity.ok(res);
        } catch (IOException e) {
            e.printStackTrace();

            res = "fail";
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(res);
        }
    }



}
