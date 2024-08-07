package com.climate.main.controller;

import com.climate.main.dto.CommunityDTO;
import com.climate.main.dto.LikeDTO;
import com.climate.main.service.CommunityDAO;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.*;

@Controller
public class CommunityC {

    @Autowired
    private CommunityDAO communityDAO;
    private LikeDTO likeDTO;

    private Map<String, String> fileMap = new HashMap<>();
    private List<Map<String, String>> fileMapList = new ArrayList<>();

    private ArrayList<String> fileLists = new ArrayList<>();


    @GetMapping("/community/video")
    public String communityShowoff(HttpSession session, Model model) {
        String userId = (String) session.getAttribute("user_id");
        model.addAttribute("user_id", userId);

        model.addAttribute("showoffLists", communityDAO.selectAllCommunityShowoff());
        model.addAttribute("actionURL", "/community/search");
        model.addAttribute("content", "/community/community_menu");
        model.addAttribute("community_content", "/community/community_video");
        return "index";
    }

    @GetMapping("/community/lfg")
    public String communityLfg(Model model) {
        model.addAttribute("recruitment", communityDAO.selectAllCommunityRecruitment());
        model.addAttribute("actionURL", "/community/searchLfg");
        model.addAttribute("content", "/community/community_menu");
        model.addAttribute("community_content", "/community/community_lfg");
        return "index";
    }

    @GetMapping("/community/video/insert")
    public String moveInsertCommunityShowoff(Model model) {
        model.addAttribute("content", "/community/community_video_insert");
        return "index";
    }

    @GetMapping("/community/lfg/insert")
    public String moveInsertCommunityLfg(Model model) {
        model.addAttribute("content", "/community/community_lfg_insert");
        return "index";
    }

    @PostMapping("/community/lfg/insert")
    public String InsertCommunityLfg(CommunityDTO communityDTO) {
        communityDAO.changeFileName(communityDTO, fileMapList);
        communityDAO.moveFile(fileLists);
//        System.out.println(communityDTO);
        communityDAO.insertCommunityLfg(communityDTO);
        return "redirect:/community/lfg";
    }

    @PostMapping("/community/video/insert")
    public String insertCommunityShowoff(RedirectAttributes redirectAttributes, CommunityDTO communityDTO, Model model) {
        communityDAO.insertCommunityShowoff(communityDTO);
        return "redirect:/community/video";
    }

    @GetMapping("/community/video/update")
    public String moveUpdateCommunityShowoff(int b_pk, Model model) {
        model.addAttribute("showoffList", communityDAO.selectCommunityShowoff(b_pk));
        model.addAttribute("content", "/community/community_video_update");
        return "index";
    }

    @GetMapping("/community/lfg/update")
    public String moveUpdateCommunityLfg(int b_pk, Model model) {
        model.addAttribute("lfgList", communityDAO.selectCommunityRecruitment(b_pk));
        model.addAttribute("content", "/community/community_lfg_update");
        return "index";
    }

    @PostMapping("/community/video/update")
    public String updateCommunityShowoff(CommunityDTO communityDTO) {
        communityDAO.updateCommunityShowoff(communityDTO);
        return "redirect:/community/video";
    }

    @PostMapping("/community/lfg/update")
    public String updateCommunityLfg(CommunityDTO communityDTO) {
        communityDAO.updateCommunityLfg(communityDTO);
        return "redirect:/community/lfg";
    }

    @GetMapping("/community/video/delete")
    public String deleteCommunityShowoff(int b_pk) {
        communityDAO.deleteCommunityShowoff(b_pk);
        return "redirect:/community/video";
    }

    @GetMapping("/community/lfg/delete")
    public String deleteCommunityLfg(int b_pk) {
        communityDAO.deleteCommunityLfg(b_pk);
        return "redirect:/community/lfg";
    }

    @GetMapping("/community/video/detail")
    public String communityShowoffDetail(int b_pk, Model model) {
//        model.addAttribute("showoffLikeCount", communityDAO.selectLikeCount(b_pk));
        model.addAttribute("showoffLikeCountThisUser", communityDAO.selectLikeCountThisUser(b_pk));
        model.addAttribute("showoffCommentsLists", communityDAO.selectCommunityComments(b_pk));
        model.addAttribute("showoffList", communityDAO.selectCommunityShowoff(b_pk));
        model.addAttribute("content", "/community/community_video_detail");
        return "index";
    }

    @GetMapping("/community/lfg/detail")
    public String communityLfgDetail(int b_pk, Model model) {
//        model.addAttribute("showoffLikeCount", communityDAO.selectLikeCount(b_pk));
        model.addAttribute("showoffLikeCountThisUser", communityDAO.selectLikeCountThisUser(b_pk));
        model.addAttribute("showoffCommentsLists", communityDAO.selectCommunityComments(b_pk));
        model.addAttribute("lfgList", communityDAO.selectCommunityRecruitment(b_pk));
        model.addAttribute("content", "/community/community_lfg_detail");
        return "index";
    }

    @PostMapping("/clickLike")
    public ResponseEntity<Map<String, Integer>> clickLike(@RequestBody Map<String, Object> payload) {
        int b_pk = (int) payload.get("b_pk");
        String u_id = (String) payload.get("u_id"); // 필요에 따라 사용

        int userLikes = communityDAO.selectLikeCountThisUser(b_pk);

        if (userLikes == 0) {
            communityDAO.insertCommunityLike(b_pk, u_id);
        } else if (userLikes >= 1) {
            communityDAO.deleteCommunityLike(b_pk, u_id);
        }

        int totalLikes = communityDAO.selectLikeCount(b_pk);

        Map<String, Integer> response = new HashMap<>();
        response.put("totalLikes", totalLikes);
        response.put("userLikes", userLikes);

        return ResponseEntity.ok(response);
    }

    @GetMapping("/community/search")
    public String communitySearch(String searchWord, String columnName, Model model) {
        model.addAttribute("showoffLists", communityDAO.selectSearchCommunityShowoff(columnName, searchWord));
        model.addAttribute("content", "/community/community_menu");
        model.addAttribute("community_content", "/community/community_video");
        return "index";
    }

    @GetMapping("/community/searchLfg")
    public String communitySearchLfg(String searchWord, String columnName, Model model) {
        model.addAttribute("recruitment", communityDAO.selectSearchCommunityLfg(columnName, searchWord));
        model.addAttribute("content", "/community/community_menu");
        model.addAttribute("community_content", "/community/community_lfg");
        return "index";
    }

    @PostMapping("/community/video/comments/insert")
    public String commentsInsertCommunityShowoff(int b_pk, String cm_text) {
        communityDAO.insertCommunityComments(b_pk, cm_text);
        return "redirect:/community/video/detail?b_pk=" + b_pk;
    }

    @PostMapping("/community/lfg/comments/insert")
    public String commentsInsertCommunityLfg(int b_pk, String cm_text) {
        communityDAO.insertCommunityComments(b_pk, cm_text);
        return "redirect:/community/lfg/detail?b_pk=" + b_pk;
    }

    @GetMapping("/community/video/deleteComments")
    public String deleteCommentsVideo(int cm_pk, int b_pk) {
        communityDAO.deleteCommunityComments(cm_pk, b_pk);
        return "redirect:/community/video/detail?b_pk=" + b_pk;
    }

    @GetMapping("/community/lfg/deleteComments")
    public String deleteCommentsLfg(int cm_pk, int b_pk) {
        communityDAO.deleteCommunityComments(cm_pk, b_pk);
        return "redirect:/community/lfg/detail?b_pk=" + b_pk;
    }

    @GetMapping("/community/hashtag")
    public String hashtagSearch(String searchWord, Model model) {
        model.addAttribute("showoffLists", communityDAO.selectHashtagSearchCommunityShowoff(searchWord));
        model.addAttribute("content", "/community/community_menu");
        model.addAttribute("community_content", "/community/community_video");
        return "index";
    }

    @GetMapping("/community/hashtagLfg")
    public String hashtagSearchLfg(String searchWord, Model model) {
        model.addAttribute("recruitment", communityDAO.selectHashtagSearchCommunityLfg(searchWord));
        model.addAttribute("content", "/community/community_menu");
        model.addAttribute("community_content", "/community/community_lfg");
        return "index";
    }

    @PostMapping("/community/lfg/insert/uploadImg")
    public void uploadFile(@RequestParam("file") MultipartFile file, Model model) {
        try {

            String uploadDir = System.getProperty("user.dir") + "/src/main/resources/static/upload/lfgimg/temp/";

            UUID uuid = UUID.randomUUID();
            String randomID = uuid.toString();
            String[] selectID = randomID.split("-");
            String selectID2 = selectID[0];

            byte[] bytes = file.getBytes();
            Path path = Paths.get(uploadDir + selectID2 + ".png");
            Files.write(path, bytes);

            // MIME 타입 결정
            String mimeType = file.getContentType();
            if (mimeType == null) {
                mimeType = "application/octet-stream"; // 기본 MIME 타입
            }

            // Base64 인코딩 및 MIME 타입 정보 추가
            String base64String = Base64.getEncoder().encodeToString(file.getBytes());
            String base64DataURL = "data:" + mimeType + ";base64," + base64String;

            // UUID와 Base64 문자열을 Map에 저장
            fileMap.put(base64DataURL, selectID2);

            // List에 Map 추가
            fileMapList.add(fileMap);
            fileLists.add(selectID2+".png");

//            return new ResponseEntity<>("/resources/upload/lfgimg/" + file.getOriginalFilename(), HttpStatus.OK);

        } catch (Exception e) {
            e.printStackTrace();
//            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
    }

}
