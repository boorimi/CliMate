package com.climate.main.mapper;

import com.climate.main.dto.MyCommentsDTO;
import com.climate.main.dto.TestVO;
import com.climate.main.dto.UserDTO;
import org.apache.catalina.User;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Select;
import org.apache.ibatis.annotations.Update;
import org.yaml.snakeyaml.error.MarkedYAMLException;

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

    // 내 댓글 전체조회
    @Select("select co.*, b_title, b_category from cli_comments co, cli_board " +
            "where cm_b_pk = b_pk and cm_u_id = #{cm_u_id} " +
            "order by cm_datetime")
    public List<MyCommentsDTO> selectAllMyComments(MyCommentsDTO myCommentsDTO);

}
