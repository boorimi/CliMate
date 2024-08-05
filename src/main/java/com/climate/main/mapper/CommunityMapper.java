package com.climate.main.mapper;

import com.climate.main.dto.CommentsDTO;
import com.climate.main.dto.CommunityDTO;
import org.apache.ibatis.annotations.*;

import java.util.List;

@Mapper
public interface CommunityMapper {

    // 자랑게시판 전체조회
    @Select("SELECT bo.*, u_nickname, u_grade, " +
            "(SELECT COUNT(*) FROM cli_like WHERE l_b_pk = bo.b_pk) AS l_count, " +
            "(SELECT COUNT(*) FROM cli_comments WHERE cm_b_pk = bo.b_pk) AS c_count " +
            "FROM cli_board bo JOIN cli_user ON u_id = b_u_id " +
            "WHERE b_category = '動画' order by b_datetime desc")
    public List<CommunityDTO> selectAllCommunityShowoff();

    // 모집게시판 전체조회
    @Select("select bo.*, u_nickname, u_grade " +
            "from cli_board bo, cli_user " +
            "where u_id = b_u_id and b_category in ('クルー募集','急遽') " +
            "order by b_datetime desc")
    public  List<CommunityDTO> selectAllCommunityRecruitment();

    // 자랑게시판 디테일 조회
    @Select("SELECT bo.*, u_nickname, u_grade, " +
            "(SELECT COUNT(*) FROM cli_like WHERE l_b_pk = bo.b_pk) AS l_count, " +
            "(SELECT COUNT(*) FROM cli_comments WHERE cm_b_pk = bo.b_pk) AS c_count " +
            "from cli_board bo, cli_user " +
            "where u_id = b_u_id and b_pk = #{b_pk} ")
    public  CommunityDTO selectCommunityShowoff(int b_pk);

    // 모집게시판 디테일조회
    @Select("select bo.*, u_nickname, u_grade, " +
            "(SELECT COUNT(*) FROM cli_like WHERE l_b_pk = bo.b_pk) AS l_count, " +
            "(SELECT COUNT(*) FROM cli_comments WHERE cm_b_pk = bo.b_pk) AS c_count " +
            "from cli_board bo, cli_user " +
            "where u_id = b_u_id and b_pk = #{b_pk}")
    public CommunityDTO selectCommunityRecruitment(int b_pk);

    // 자랑게시판 인서트
    @Insert("insert into cli_board values (cli_board_seq.nextval, 'ds6951', '動画', #{b_video}, #{b_title}, #{b_text}, sysdate, #{b_thumbnail})")
    public int insertCommunityShowoff(CommunityDTO communityDTO);

    // 모집게시판 인서트
    @Insert("insert into cli_board values (cli_board_seq.nextval, 'ds6951', #{b_category}, '-', #{b_title}, #{b_text}, sysdate, '-')")
    public int insertCommunityLfg(CommunityDTO communityDTO);

    // 자랑게시판 업데이트
    @Update("update cli_board set b_title = #{b_title}, b_text = #{b_text} where b_pk = #{b_pk}")
    public int updateCommunityShowoff(CommunityDTO communityDTO);

    // 자랑게시판 삭제
    @Delete("delete from cli_board where b_pk = #{b_pk} ")
    public int deleteCommunityShowoff(int b_pk);

    // 좋아요 인서트
    @Insert("insert into cli_like values (#{u_id}, #{b_pk})")
    public int insertCommunityLike(int b_pk, String u_id);

    // 좋아요 삭제
    @Delete("delete from cli_like where l_u_id = #{u_id} and l_b_pk = #{b_pk}")
    public int deleteCommunityLike(int b_pk, String u_id);

    // 게시글 전체 좋아요 갯수
    @Select("select count(*) from cli_like where l_b_pk = #{b_pk}")
    public int selectLikeCount(int b_pk);

    // 내 좋아요 판단 여부
    @Select("select count(*) from cli_like where l_b_pk = #{b_pk} and l_u_id = 'ds6951'")
    public int selectLikeCountThisUser(int b_pk);

    // 댓글 총 갯수
    @Select("select count(*) from cli_comments where cm_b_pk = #{cm_b_pk} ")
    public int selectCommentsCount(int cm_b_pk);

    // 검색기능
    @Select("<script>" +
            "SELECT bo.*, u_nickname, u_grade, " +
            "(SELECT COUNT(*) FROM cli_like WHERE l_b_pk = bo.b_pk) AS l_count " +
            "FROM cli_board bo JOIN cli_user ON u_id = b_u_id " +
            "WHERE b_category = '動画' " +
            "<if test='columnName != null and searchWord != null'>" +
            "AND ${columnName} LIKE '%' || #{searchWord} || '%' " +
            "</if>" +
            "</script>")
    public List<CommunityDTO> selectSearchCommunityShowoff(String columnName, String searchWord);

    @Select("SELECT bo.*, u_nickname, u_grade, " +
            "(SELECT COUNT(*) FROM cli_like WHERE l_b_pk = bo.b_pk) AS l_count " +
            "FROM cli_board bo JOIN cli_user ON u_id = b_u_id " +
            "WHERE b_category = '動画' " +
            "AND (b_title like '%'||#{searchWord}||'%' or b_text like '%'||#{searchWord}||'%') ")
    public List<CommunityDTO> selectHashtagSearchCommunityShowoff(String searchWord);

    // 자랑게시판 댓글 조회
    @Select("select co.*, u_nickname, u_grade from cli_comments co, cli_user where u_id = cm_u_id and cm_b_pk = #{b_pk} order by cm_datetime desc ")
    public List<CommentsDTO> selectCommunityComments(int b_pk);

    // 댓글 인서트
    @Insert("insert into cli_comments values (cli_comments_seq.nextval, #{b_pk}, 'ds6951', #{cm_text}, sysdate)")
    public int insertCommunityComments(int b_pk, String cm_text);

    // 댓글 삭제
    @Delete("delete from cli_comments where cm_pk = #{cm_pk} ")
    public int deleteCommunityComments(int cm_pk, int b_pk);


}
