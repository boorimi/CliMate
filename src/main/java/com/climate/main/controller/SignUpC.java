package com.climate.main.controller;

import com.climate.main.dto.UserDTO;
import com.climate.main.service.SignDAO;
import jakarta.servlet.ServletContext;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;

@Controller
public class SignUpC {
    @Autowired
    private SignDAO signDAO;
    @Autowired
    private ServletContext servletContext;

    @PostMapping("/signup")
    public String signUp(@ModelAttribute UserDTO userDTO, @RequestParam("file_upload") MultipartFile file) {
        String profileImage;
        if (file == null || file.isEmpty()) {
            // 파일이 업로드되지 않은 경우 기본 이미지 사용
            profileImage = userDTO.getU_img();
        } else {
            // 파일이 업로드된 경우 파일 저장 로직
            profileImage = saveFile(file);
        }

        // userDTO에서 profile 이미지 설정
        userDTO.setU_img(profileImage);
        System.out.println("check user dto => " + userDTO.getU_homeground());
        System.out.println("check profile dto => " + profileImage);
        //홈그라운드 확인
        if (userDTO.getU_homeground().isEmpty()) {
            userDTO.setU_homeground("none");
        }
        //setter 확인
        if (userDTO.getU_category().equals("Setter")) {
            userDTO.setU_grade("Setter");
        }
        int result = signDAO.insertUser(userDTO);
        if (result == 1) {
            System.out.println("유저 가입 성공");
            return "redirect:/";
        } else {
            System.out.println("유저 가입 실패");
            return "redirect:/signup";
        }
    }

    private String saveFile(MultipartFile file) {
        try {
            /* 파일 저장 폴더 경로 & 저장된 사진 업로드 할 경로 분리 */
            // 상대 경로 설정
            String relativeDir = "resources/upload/img/";

            // 절대 경로로 디렉토리 설정
            //File uploadDirFile = new File("/Users/master/Documents/java_practice/final_project/src/main/resources/static/upload/img");
            String absoluteDir = new File(relativeDir).getAbsolutePath();
            File uploadDirFile = new File(absoluteDir);

            //디렉토리가 존재하지 않으면 생성
            if (!uploadDirFile.exists()) {
                uploadDirFile.mkdirs();
            }

            // 파일 저장
            String originalFilename = file.getOriginalFilename();
            String filePath = uploadDirFile.getAbsolutePath() + File.separator + originalFilename;

            System.out.println("check path => " + filePath);
            File dest = new File(uploadDirFile, originalFilename);
            file.transferTo(dest);

            // 저장된 파일 경로 또는 URL 반환
            return "/" + relativeDir + originalFilename; // 실제로는 파일 접근 가능한 URL 반환이 더 적절함
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }
}
