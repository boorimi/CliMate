package com.climate.main.controller;

import com.climate.main.dto.CommentsDTO;
import com.climate.main.dto.MyCommentsDTO;
import com.climate.main.dto.UserDTO;
import com.climate.main.service.CommunityDAO;
import com.climate.main.service.MypageDAO;
import com.google.cloud.storage.BlobId;
import com.google.cloud.storage.BlobInfo;
import com.google.cloud.storage.Storage;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.nio.file.Files;
import java.util.UUID;


@Controller
public class MypageC {

    @Autowired
    private MypageDAO mypageDAO;

    @Value("${google.map_key}")
    private String mapKey;

    private final Storage storage;

    @Autowired
    public MypageC(Storage storage) {
        this.storage = storage;
    }

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
        model.addAttribute("mapKey", mapKey);
        model.addAttribute("myinfo", mypageDAO.selectUserInfo(userDTO));
        model.addAttribute("content", "/mypage/mypage_update");
        return "index";
    }

    @GetMapping("/mypage/deleteUserInfo")
    public String deleteUsrInfo(HttpSession session, UserDTO userDTO, Model model) {
        userDTO.setU_id((String) session.getAttribute("user_id"));
        System.out.println(session.getAttribute("user_id"));
        model.addAttribute("deleteAccount", mypageDAO.deleteUserInfo(userDTO));
        model.addAttribute("content", "/sign/delete_account");
        return "index";
    }

    @PostMapping("/mypage/update")
    public String updateMypage(HttpSession session, UserDTO userDTO, @RequestParam("file_upload") MultipartFile file) {
        userDTO.setU_id((String) session.getAttribute("user_id"));

        String profileImage;
        if (file == null || file.isEmpty()) {
            // 파일이 업로드되지 않은 경우 기본 이미지 사용
            profileImage = userDTO.getU_img();
        } else {
            // 파일이 업로드된 경우 파일 저장 로직
            profileImage = saveFile(file);
        }

        //setter 확인
        if (userDTO.getU_category().equals("Setter")) {
            System.out.println("check 1");
            userDTO.setU_grade("Setter");
        }

        // userDTO에서 profile 이미지 설정
        userDTO.setU_img(profileImage);
        System.out.println("check user dto => " + userDTO);
        System.out.println("check profile dto => " + profileImage);
        int result = mypageDAO.updateUserInfo(userDTO);
        if (result == 1) {
            System.out.println("정보수정 성공");
        }
        return "redirect:/mypage";
    }

    private String saveFile(MultipartFile file) {
        try {
            // 절대 경로로 디렉토리 설정
            File uploadDirFile = new File(System.getProperty("user.dir") + "/src/main/resources/static/upload/img/");

            UUID uuid = UUID.randomUUID();
            String randomID = uuid.toString();
            String[] selectID = randomID.split("-");
            String selectID2 = selectID[0];

            String originalFilename = selectID2 + ".png";
            String filePath = uploadDirFile.getAbsolutePath() + File.separator + originalFilename;

            System.out.println("check path => " + filePath);

            // 파일 저장
            File dest = new File(filePath);
            file.transferTo(dest);

            // firebase 스토리지에 저장
            String thumbnailContentType = file.getContentType();
            BlobId thumbnailBlobId = BlobId.of("climate-4e4fe.appspot.com", "upload/" + originalFilename);
            BlobInfo thumbnailBlobInfo = BlobInfo.newBuilder(thumbnailBlobId).setContentType(thumbnailContentType).build();
            storage.create(thumbnailBlobInfo, Files.readAllBytes(dest.toPath()));

            // 저장된 파일 경로 또는 URL 반환
            return "https://firebasestorage.googleapis.com/v0/b/climate-4e4fe.appspot.com/o/upload%2F" + originalFilename + "?alt=media"; // 실제로는 파일 접근 가능한 URL 반환이 더 적절함
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }

    @GetMapping("/mypage/userProfile")
    public String userProfile(HttpSession session, UserDTO userDTO, Model model) {
        model.addAttribute("myinfo", mypageDAO.selectUserInfo(userDTO));
        model.addAttribute("content", "/mypage/profile");
        return "index";
    }

    @GetMapping("/mypage/myComments")
    public String myComments(HttpSession session, MyCommentsDTO myCommentsDTO, Model model) {
        myCommentsDTO.setCm_u_id((String) session.getAttribute("user_id"));
        model.addAttribute("myComments", mypageDAO.selectAllMyComments(myCommentsDTO));
        model.addAttribute("content", "/mypage/my_comments");
        return "index";
    }

}
