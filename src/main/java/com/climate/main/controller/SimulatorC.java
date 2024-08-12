package com.climate.main.controller;

import com.climate.main.dto.SimulatorDTO;
import com.climate.main.service.SimulatorDAO;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

@RequestMapping("/simulator")
@Controller
public class SimulatorC {

    @Autowired
    private SimulatorDAO simulatorDAO;

    @GetMapping("/main")
    public String simulatorMain(HttpSession session, Model model, SimulatorDTO simulatorDTO) {
        String userId = (String) session.getAttribute("user_id");
        model.addAttribute("user_id", userId);
        System.out.println(userId);

        if (userId != null){

            model.addAttribute("myProject", simulatorDAO.getMyProject(userId));
            System.out.println(simulatorDAO.getMyProject(userId));
        }

        model.addAttribute("content", "/simulator/simulator_main");
        return "index";

    }

    @GetMapping("/create")
    public String simulator(Model model) {
        model.addAttribute("holds", simulatorDAO.getAllHolds());
//        System.out.println(holdDAO.getAllHolds());
        model.addAttribute("content", "/simulator/simulator_create");
        return "index";
    }

    @GetMapping("/my_project")
    public String myProject(Model model) {
        model.addAttribute("content", "/simulator/simulator_my_project");
        return "index";
    }

    @GetMapping("/gallery")
    public String simulatorGallery(Model model) {
        model.addAttribute("allProject", simulatorDAO.getAllProject());
        System.out.println(simulatorDAO.getAllProject());
        model.addAttribute("content", "/simulator/simulator_gallery");
        return "index";
    }
    @GetMapping("/gallery_detail")
    public String galleryPost(Model model) {
        model.addAttribute("content", "/simulator/simulator_gallery_detail");
        return "index";

    }


    @PostMapping("/upload")
    public ResponseEntity<Map<String, String>> uploadFile(
            @RequestParam("gltfFile") MultipartFile gltfFile,
            @RequestParam("imgFile") MultipartFile imgFile,
            Model model,
            SimulatorDTO simulatorDTO,
            HttpSession session) {

        String gltfPath = System.getProperty("user.dir") + "/src/main/resources/static/upload/s_project/3D/";
        String imgPath = System.getProperty("user.dir") + "/src/main/resources/static/upload/s_project/img/";

        Map<String, String> res = new HashMap<>();

        System.out.println(gltfPath + "//" + imgPath);

        try {
            // 파일 객체 생성                                     //업로드된 파일의 원본 이름
            File gltfTargetFile = new File(gltfPath + gltfFile.getOriginalFilename());
            File imgTargetgFile = new File(imgPath + imgFile.getOriginalFilename());

            simulatorDTO.setS_file(gltfFile.getOriginalFilename());
            simulatorDTO.setS_img(imgFile.getOriginalFilename());
            simulatorDTO.setS_u_id((String) session.getAttribute("user_id"));

            System.out.println(gltfTargetFile);
            System.out.println(imgTargetgFile);

            // 파일 저장
            gltfFile.transferTo(gltfTargetFile);
            imgFile.transferTo(imgTargetgFile);

            System.out.println("저장 성공");

            res.put("status", "success");

            if (simulatorDAO.uploadFile(simulatorDTO) == 1) {
                System.out.println("입력 성공~");
            }


            return ResponseEntity.ok(res);
        } catch (IOException e) {
            e.printStackTrace();

            res.put("status", "fail");
            res.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(res);
        }


    }


}
