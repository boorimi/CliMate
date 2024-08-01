package com.climate.main.mapper;

import com.climate.main.dto.UserDTO;
import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Select;

@Mapper
public interface UserMapper {
    @Select("select * from CLI_USER where U_ID = #{u_id}")
    UserDTO getUserById(String u_id);

    @Insert("insert into CLI_USER values(#{u_id}, #{u_nickname}, #{u_grade}, #{u_insta}, #{u_img}, #{u_homeground}, #{u_category}, #{u_profile})")
    int insertUser(UserDTO userDTO);
}
