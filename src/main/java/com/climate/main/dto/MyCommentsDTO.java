package com.climate.main.dto;

import lombok.Data;

import java.util.Date;

@Data
public class MyCommentsDTO {

    private int cm_pk;
    private String cm_b_pk;
    private String cm_u_id;
    private String cm_text;
    private Date cm_datetime;
    private String cm_secret;
    private String b_title;
    private String b_category;

}
