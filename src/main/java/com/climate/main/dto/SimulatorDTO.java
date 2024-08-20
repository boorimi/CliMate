package com.climate.main.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Data;
import java.util.Date;


@Data
public class SimulatorDTO {
    private int b_pk;
    private String b_video;
    private String b_thumbnail;
    private Date b_datetime;
    private String b_category;
    private String b_u_id;
    private String u_nickname;
    private String u_grade;
    private String u_category;
    private String u_profile;
    private int l_count;
    private int c_count;
}
