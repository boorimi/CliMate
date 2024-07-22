package com.climate.main.dto;

import lombok.Data;

import java.util.Date;

@Data
public class CommunityDTO {

    private int b_pk;
    private String b_u_id;
    private String b_category;
    private String b_video;
    private String b_title;
    private String b_text;
    private Date b_datetime;
    private String u_nickname;
}
