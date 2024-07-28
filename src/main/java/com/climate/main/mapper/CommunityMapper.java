package com.climate.main.mapper;

import com.climate.main.dto.CommunityDTO;
import com.climate.main.dto.LikeDTO;
import org.apache.ibatis.annotations.Delete;
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

    @Insert("insert into cli_like values (#{u_id}, #{b_pk})")
    public int insertCommunityLike(int b_pk, String u_id);

    @Delete("delete from cli_like where l_u_id = #{u_id} and l_b_pk = #{b_pk}")
    public int deleteCommunityLike(int b_pk, String u_id);

    @Select("select count(*) from cli_like where l_b_pk = #{b_pk}")
    public int selectLikeCount(int b_pk);

    @Select("select count(*) from cli_like where l_b_pk = #{b_pk} and l_u_id = 'ds6951'")
    public int selectLikeCountThisUser(int b_pk);

}
