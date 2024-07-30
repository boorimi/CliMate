package com.climate.main.controller;

import com.climate.main.dto.CommunityDTO;
import com.climate.main.dto.LikeDTO;
import com.climate.main.service.CommunityDAO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import java.util.HashMap;
import java.util.Map;

@Controller
public class CommunityC {

    @Autowired
    private CommunityDAO communityDAO;
    private LikeDTO likeDTO;



    @GetMapping("/community/video")
    public String communityShowoff(Model model) {
        model.addAttribute("showoffLists", communityDAO.selectAllCommunityShowoff());
        model.addAttribute("content", "/community/community_menu");
        model.addAttribute("community_content", "/community/community_video");
        return "index";
    }

    @GetMapping("/community/lfg")
    public String communityLfg(Model model) {
        model.addAttribute("recruitment", communityDAO.selectAllCommunityRecruitment());
        model.addAttribute("content", "/community/community_menu");
        model.addAttribute("community_content", "/community/community_lfg");
        return "index";
    }

    @GetMapping("/community/video/insert")
    public String moveInsertCommunityShowoff(Model model) {
        model.addAttribute("content", "/community/community_video_insert");
        return "index";
    }

    @PostMapping("community/video/insert")
    public String insertCommunityShowoff(RedirectAttributes redirectAttributes, CommunityDTO communityDTO, Model model) {
        communityDAO.insertCommunityShowoff(communityDTO);
        return "redirect:/community/video";
    }

    @GetMapping("/community/video/delete")
    public String deleteCommunityShowoff(int b_pk) {
        communityDAO.deleteCommunityShowoff(b_pk);
        return "redirect:/community/video";
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

    @PostMapping("/community/video/comments/insert")
    public String commentsInsertCommunityShowoff(int b_pk, String cm_text) {
        communityDAO.insertCommunityComments(b_pk, cm_text);
        return "redirect:/community/video/detail?b_pk=" + b_pk;
    }

    @GetMapping("/community/video/deleteComments")
    public String deleteComments(int cm_pk, int b_pk) {
        communityDAO.deleteCommunityComments(cm_pk, b_pk);
        return "redirect:/community/video/detail?b_pk=" + b_pk;
    }

    @GetMapping("/community/hashtag")
    public String hashtagSearch(String searchWord, Model model) {
        model.addAttribute("showoffLists", communityDAO.selectHashtagSearchCommunityShowoff(searchWord));
        model.addAttribute("content", "/community/community_menu");
        model.addAttribute("community_content", "/community/community_video");
        return "index";
    }

}
