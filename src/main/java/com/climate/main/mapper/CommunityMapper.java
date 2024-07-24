package com.climate.main.mapper;

import com.climate.main.dto.CommunityDTO;
import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Select;

import java.util.List;

@Mapper
public interface CommunityMapper {

    @Select("select bo.*, u_nickname, u_grade from cli_board bo, cli_user where u_id = b_u_id and b_category = '動画' ")
    public List<CommunityDTO> selectAllCommunityShowoff();

    @Select("select bo.*, u_nickname, u_grade from cli_board bo, cli_user where u_id = b_u_id and b_category in ('クルー募集','急遽') ")
    public  List<CommunityDTO> selectAllCommunityRecruitment();

    @Select("select bo.*, u_nickname, u_grade from cli_board bo, cli_user where u_id = b_u_id and b_pk = #{b_pk} ")
    public  CommunityDTO selectCommunityShowoff(int b_pk);

    @Insert("insert into cli_board values (cli_board_seq.nextval, 'ds6951', '動画', #{b_video}, #{b_title}, #{b_text}, sysdate)")
    public int insertCommunityShowoff(CommunityDTO communityDTO);
}
