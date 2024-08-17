package com.climate.main.controller;

import com.climate.main.config.FirebaseConfig;
import com.climate.main.dto.CommentsDTO;
import com.climate.main.dto.CommunityDTO;
import com.climate.main.dto.SimulatorDTO;
import com.climate.main.mapper.SimulatorMapper;
import com.climate.main.service.CommunityDAO;
import com.climate.main.service.SimulatorDAO;
import com.google.cloud.storage.BlobId;
import com.google.cloud.storage.BlobInfo;
import com.google.cloud.storage.Storage;
import com.google.firebase.FirebaseApp;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.beans.factory.annotation.Value;
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

    private final Storage storage;

    @Autowired
    public SimulatorC(Storage storage) {
        this.storage = storage;
    }

    @Value("${file.upload-dir}")
    String gltfPath;


    @Autowired
    private SimulatorDAO simulatorDAO;
    private CommunityDAO communityDAO;
    @Qualifier("simulatorMapper")
    @Autowired
    private SimulatorMapper simulatorMapper;

    @GetMapping("/main")
    public String simulatorMain(HttpSession session, Model model, SimulatorDTO simulatorDTO) {
        String userId = (String) session.getAttribute("user_id");
        model.addAttribute("user_id", userId);
        System.out.println(userId);

        if (userId != null) {
            model.addAttribute("myProject", simulatorDAO.getMyProject(userId));
            System.out.println("내문제: " + simulatorDAO.getMyProject(userId));
        }

        model.addAttribute("content", "/simulator/simulator_main");
        return "index";

    }

    @GetMapping("/create")
    public String simulator(Model model) {
        model.addAttribute("holds", simulatorDAO.getAllHolds());
//        System.out.println(holdDAO.getAllHolds());
        model.addAttribute("content", "/simulator/simulator_menu");
        model.addAttribute("simulator_content", "/simulator/simulator_create");
        return "index";
    }

    @GetMapping("/my_project")
    public String myProject(HttpSession session, Model model, SimulatorDTO simulatorDTO) {
        String userId = (String) session.getAttribute("user_id");
        model.addAttribute("user_id", userId);
        model.addAttribute("myProject", simulatorDAO.getMyProject(userId));
        model.addAttribute("content", "/simulator/simulator_menu");
        model.addAttribute("simulator_content", "/simulator/simulator_my_project");
        return "index";
    }

    @GetMapping("/gallery")
    public String simulatorGallery(@RequestParam("category") String category, Model model) {
        if (category.equals("Setter")) {
            System.out.println("카테고리: "+category);
            model.addAttribute("project", simulatorDAO.selectSetter());
        } else if (category.equals("Normal")) {
            System.out.println("카테고리: "+category);
            model.addAttribute("project", simulatorDAO.selectNormal());
        } else {
            System.out.println("카테고리: "+category);
            model.addAttribute("project", simulatorDAO.getAllProject());
            System.out.println("모든문제: " + simulatorDAO.getAllProject());
        }
        model.addAttribute("content", "/simulator/simulator_menu");
        model.addAttribute("simulator_content", "/simulator/simulator_gallery");
        return "index";
    }

    @GetMapping("/gallery_detail")
    public String galleryPost(int b_pk, Model model, CommunityDTO communityDTO, HttpSession session) {
        communityDTO.setU_id((String) session.getAttribute("user_id"));
        model.addAttribute("project", simulatorDAO.getProject(b_pk));
        model.addAttribute("simulatorCommentsLists", simulatorDAO.selectCommunityComments(b_pk));
        model.addAttribute("simulatorLikeCountThisUser", simulatorDAO.selectLikeCountThisUser(communityDTO));
//        System.out.println(simulatorDAO.getProject(pk));
        model.addAttribute("content", "/simulator/simulator_menu");
        model.addAttribute("simulator_content", "/simulator/simulator_gallery_detail");
        return "index";
    }

    // 댓글 삭제
    @GetMapping("/deleteComment")
    public String deleteComment(int cm_pk, int b_pk) {

        System.out.println(cm_pk);
        System.out.println(b_pk);

        simulatorDAO.deleteSimulatorComment(cm_pk, b_pk);

        return "redirect:/simulator/gallery_detail?b_pk=" + b_pk;

//        SimulatorDAO.deleteSimulatorComment(cm_pk, b_pk);
//        return "redirect:/gallery_detail?b_pk=" + b_pk;

//        communityDAO.deleteCommunityShowoff(communityDTO);
//        return "redirect:/community/video";
    }


    // 닉네임 검색
    @GetMapping("/searchNickname")
    public String searchNickname(@RequestParam("nickname")String nickname, Model model){
        System.out.println("검색한 닉네임: "+nickname);

        int resultSize = simulatorDAO.searchNickname(nickname).size();

        if (resultSize == 0){
            model.addAttribute("searchResult", "No search results matching " + "\"" + nickname + "\"");
        } else {
            model.addAttribute("searchResult", "The result of a search for " + "\"" + nickname + "\"");
        }

        System.out.println(simulatorDAO.searchNickname(nickname));

        model.addAttribute("project", simulatorDAO.searchNickname(nickname));
        model.addAttribute("content", "/simulator/simulator_menu");
        model.addAttribute("simulator_content", "/simulator/simulator_gallery");
        return "index";
    }


    @ResponseBody
    @PostMapping("/deleteProject")
    public String deleteProject(@RequestParam("pk") int pk,
                                @RequestParam("gltf") String gltf,
                                @RequestParam("img") String img) {

        Map<String, String> response = new HashMap<>();

        if (simulatorMapper.deleteProject(pk) == 1) {
            System.out.println("삭제 성공~");
            response.put("status", "success");
        } else {
            response.put("status", "error");
        }
        return response.toString();
    }

    @PostMapping("/upload")
    public ResponseEntity<Map<String, String>> uploadFile(
            @RequestParam("gltfFile") MultipartFile gltfFile,
            @RequestParam("imgFile") MultipartFile imgFile,
            Model model,
            SimulatorDTO simulatorDTO,
            HttpSession session) {

        Map<String, String> res = new HashMap<>();

        try {
            System.out.println("--------------------");
            System.out.println("주소: " + gltfPath);
            System.out.println("--------------------");

            // 파일 객체 생성                                     //업로드된 파일의 원본 이름
            File gltfTargetFile = new File(gltfPath + gltfFile.getOriginalFilename());
            String imgTargetgFile = imgFile.getOriginalFilename();

            System.out.println("3D파일 : " + gltfFile.getOriginalFilename());
            System.out.println("이미지파일 : " + imgTargetgFile);

            // 이미지 파일을 Firebase Storage에 업로드
            String imgContentType = imgFile.getContentType();
            BlobId imgBlobId = BlobId.of("climate-4e4fe.appspot.com", "upload/" + imgTargetgFile);
            BlobInfo imgBlobInfo = BlobInfo.newBuilder(imgBlobId).setContentType(imgContentType).build();
            storage.create(imgBlobInfo, imgFile.getBytes());

            String url = "https://firebasestorage.googleapis.com/v0/b/climate-4e4fe.appspot.com/o/upload%2F";

            // sql set
            gltfFile.transferTo(gltfTargetFile);
            simulatorDTO.setB_video(gltfFile.getOriginalFilename());
            simulatorDTO.setB_thumbnail(url + imgTargetgFile + "?alt=media");
            simulatorDTO.setB_u_id((String) session.getAttribute("user_id"));

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

    @PostMapping("/comments/insert")
    public String commentsInsertCommunityShowoff(int cm_b_pk, CommentsDTO commentsDTO) {
        simulatorDAO.insertSimulatorComments(commentsDTO);
        return "redirect:/simulator/gallery_detail?b_pk=" + cm_b_pk;
    }

}
