package com.climate.main.controller;

import com.climate.main.dto.CommunityDTO;
import com.climate.main.service.CommunityDAO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class CommunityJSONC {

    @Autowired
    private CommunityDAO communityDAO;

    @GetMapping("/community/lfg/getHTML")
    public CommunityDTO getLfgContent(int b_pk) {
        // DB에서 HTML 콘텐츠를 가져오는 서비스 메서드를 호출합니다.
        return communityDAO.selectCommunityRecruitment(b_pk);
    }
}
