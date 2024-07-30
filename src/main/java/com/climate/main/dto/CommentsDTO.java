package com.climate.main.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Data;
import org.springframework.format.annotation.DateTimeFormat;

import java.util.Date;

@Data
public class CommentsDTO {

    private int cm_pk;
    private int cm_b_pk;
    private String cm_u_id;
    private String cm_text;
    private Date cm_datetime;
    private String u_nickname;
    private String u_grade;

}
