package com.climate.main.dto;

import lombok.Data;

import java.util.Date;

@Data
public class SimulatorDTO {
    private int s_pk;
    private String s_file;
    private String s_img;
    private Date s_date;
    private String s_u_id;
    private String u_nickname;
    private String u_grade;
    private String u_category;
}
