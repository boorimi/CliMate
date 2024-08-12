package com.climate.main.mapper;

import com.climate.main.dto.TestVO;
import com.climate.main.dto.UserDTO;
import org.apache.catalina.User;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Select;
import org.apache.ibatis.annotations.Update;

import java.util.List;

@Mapper
public interface MypageMapper {

    // 회원정보 전체조회
    @Select("select * from cli_user where u_id = #{u_id}")
    public UserDTO selectUserInfo(UserDTO userDTO);

    // 회원정보 수정
    @Update("update cli_user set u_nickname = #{u_nickname}, u_grade = #{u_grade}, " +
            "u_insta = #{u_insta}, u_img = #{u_img}, u_homeground = #{u_homeground}, " +
            "u_category = #{u_category}, u_profile = #{u_profile} " +
            "where u_id = #{u_id}")
    public int updateUserInfo(UserDTO userDTO);

}
