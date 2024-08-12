package com.climate.main.controller;

import com.climate.main.dto.CommunityDTO;
import com.climate.main.service.CommunityDAO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
public class CommunityJSONC {

    @Autowired
    private CommunityDAO communityDAO;

    @GetMapping("/community/lfg/getHTML")
    public CommunityDTO getLfgContent(int b_pk) {
        // DB에서 HTML 콘텐츠를 가져오는 서비스 메서드를 호출합니다.
        return communityDAO.selectCommunityRecruitment(b_pk);
    }

    @PostMapping("/clickLike")
    public ResponseEntity<Map<String, Object>> clickLike(@RequestBody CommunityDTO communityDTO) {

        int userLikes = communityDAO.selectLikeCountThisUser(communityDTO);

        if (userLikes == 0) {
            communityDAO.insertCommunityLike(communityDTO);
            userLikes = 1; // 변수명을 올바르게 수정
        } else if (userLikes >= 1) {
            communityDAO.deleteCommunityLike(communityDTO);
            userLikes = 0; // 변수명을 올바르게 수정
        }

        int totalLikes = communityDAO.selectLikeCount(communityDTO.getB_pk());

        Map<String, Object> response = new HashMap<>();
        response.put("totalLikes", totalLikes);
        response.put("userLikes", userLikes);
        response.put("u_id", communityDTO.getU_id());

        return ResponseEntity.ok(response); // 응답으로 반환
    }



}
