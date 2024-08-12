package com.climate.main.dto;

import lombok.Data;
import org.springframework.web.multipart.MultipartFile;

import java.util.Arrays;
import java.util.Date;
import java.util.List;

@Data
public class CommunityDTO {

    private int b_pk;
    private String b_u_id;
    private String b_category;
    private String b_video;
    private MultipartFile[] b_FileName;
    private String b_title;
    private String b_text;
    private Date b_datetime;
    private String b_thumbnail;
    private MultipartFile b_FileThumbnail;
    private String u_nickname;
    private String u_grade;
    private String u_id;
    private int l_count;
    private int c_count;

    public List<String> getVideoList() {
        return Arrays.asList(b_video.split("!"));
    }
}
