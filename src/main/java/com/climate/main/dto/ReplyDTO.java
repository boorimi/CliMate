package com.climate.main.dto;

import lombok.Data;

import java.util.Date;

@Data
public class ReplyDTO {

    private int re_pk;
    private int re_b_pk;
    private int re_cm_pk;
    private String re_u_id;
    private String re_text;
    private Date re_datetime;
    private String u_nickname;
    private String u_grade;
    private String u_profile;

}
