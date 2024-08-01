package com.climate.main.dto;

import lombok.Data;
import lombok.Getter;
import lombok.Setter;
import org.springframework.web.multipart.MultipartFile;

@Getter
@Setter
public class UserDTO {
    private String u_id;
    private String u_nickname;
    private String u_grade;
    private String u_insta;
    private String u_img;
    private String u_homeground;
    private String u_category;
    private String u_profile;
    @Setter
    private MultipartFile file_upload;

}
