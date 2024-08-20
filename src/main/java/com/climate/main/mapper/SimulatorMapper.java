package com.climate.main.mapper;

import com.climate.main.dto.*;
import org.apache.ibatis.annotations.*;

import java.util.List;

@Mapper
public interface SimulatorMapper {

    @Select("select * from cli_hold")
    public List<HoldDTO> getAllHolds();

    @Insert("insert into cli_board values (cli_board_seq.nextval, #{b_u_id}, 'simulator', #{b_video}, '-', '-', SYSTIMESTAMP AT TIME ZONE 'Asia/Seoul', #{b_thumbnail})")
    public int uploadFile(SimulatorDTO simulatorDTO);

    // 모든 시뮬레이터 문제 셀렉트
    @Select("SELECT s.*, u.u_nickname, u.u_grade, u.u_category, u.u_profile, " +
            "(SELECT COUNT(*) FROM cli_like WHERE l_b_pk = s.b_pk) AS l_count, " +
            "(SELECT COUNT(*) FROM cli_comments WHERE cm_b_pk = s.b_pk) AS c_count " +
            "FROM cli_board s " +
            "JOIN cli_user u " +
            "ON s.b_u_id = u.u_id " +
            "where b_category = 'simulator'" +
            "order by s.b_datetime desc")
    public List<SimulatorDTO> getAllProject();

    // 내가 만든 문제 셀렉트
    @Select("select s.*, u.u_nickname, u.u_grade, u.u_category, u.u_profile, " +
            "(SELECT COUNT(*) FROM cli_like WHERE l_b_pk = s.b_pk) AS l_count, " +
            "(SELECT COUNT(*) FROM cli_comments WHERE cm_b_pk = s.b_pk) AS c_count " +
            "from cli_board s " +
            "JOIN cli_user u " +
            "ON s.b_u_id = u.u_id " +
            "where s.b_u_id = #{userId} and b_category = 'simulator'" +
            "order by s.b_datetime desc")
    public List<SimulatorDTO> getMyProject(String userId);

    // 문제 하나만 셀렉트
    @Select("SELECT s.*, u.u_nickname, u.u_grade, u.u_category, u.u_profile, " +
            "(SELECT COUNT(*) FROM cli_like WHERE l_b_pk = s.b_pk) AS l_count, " +
            "(SELECT COUNT(*) FROM cli_comments WHERE cm_b_pk = s.b_pk) AS c_count " +
            "FROM cli_board s " +
            "JOIN cli_user u " +
            "ON s.b_u_id = u.u_id " +
            "WHERE s.b_pk = #{pk}")
    public SimulatorDTO getProject(int pk);

    // 세터 문제만 셀렉트
    @Select("SELECT s.*, u.u_nickname, u.u_grade, u.u_category, u.u_profile, " +
            "(SELECT COUNT(*) FROM cli_like WHERE l_b_pk = s.b_pk) AS l_count, " +
            "(SELECT COUNT(*) FROM cli_comments WHERE cm_b_pk = s.b_pk) AS c_count " +
            "FROM cli_board s " +
            "JOIN cli_user u " +
            "ON s.b_u_id = u.u_id " +
            "WHERE u.u_category = 'Setter' " +
            "and s.b_category = 'simulator'")
    public List<SimulatorDTO> selectSetter();

    // 일반유저 문제만 셀렉트
    @Select("SELECT s.*, u.u_nickname, u.u_grade, u.u_category, u.u_profile, " +
            "(SELECT COUNT(*) FROM cli_like WHERE l_b_pk = s.b_pk) AS l_count, " +
            "(SELECT COUNT(*) FROM cli_comments WHERE cm_b_pk = s.b_pk) AS c_count " +
            "FROM cli_board s " +
            "JOIN cli_user u " +
            "ON s.b_u_id = u.u_id " +
            "WHERE u.u_category = 'Normal' " +
            "and s.b_category = 'simulator'")
    public List<SimulatorDTO> selectNormal();

    // 닉네임 검색
    @Select("SELECT s.*, u.u_nickname, u.u_grade, u.u_category, u.u_profile, " +
            "(SELECT COUNT(*) FROM cli_like WHERE l_b_pk = s.b_pk) AS l_count, " +
            "(SELECT COUNT(*) FROM cli_comments WHERE cm_b_pk = s.b_pk) AS c_count " +
            "FROM cli_board s " +
            "JOIN cli_user u " +
            "ON s.b_u_id = u.u_id " +
            "WHERE u.u_nickname LIKE  '%' || #{nickname} || '%'" +
            "and b_category = 'simulator'")
    public List<SimulatorDTO> searchNickname(String nickname);

    // 게시물 삭제
    @Delete("delete from cli_board where b_pk = #{pk}")
    public int deleteProject(int pk);

    // 댓글 인서트
    @Insert("insert into cli_comments " +
            "values (cli_comments_seq.nextval, #{cm_b_pk}, #{cm_u_id}, #{cm_text}, SYSTIMESTAMP AT TIME ZONE 'Asia/Seoul', #{cm_secret})")
    public int insertSimulatorComments(CommentsDTO commentsDTO);

    // 댓글 삭제
    @Delete("delete from cli_comments where cm_pk = #{cm_pk} ")
    public int deleteSimulatorComment(int cm_pk, int b_pk);

    // 댓글 조회
    @Select("select co.*, u_nickname, u_grade, u_profile, " +
            "(SELECT COUNT(*) FROM cli_replycomments where re_cm_pk = cm_pk) AS re_count " +
            "from cli_comments co, cli_user " +
            "where u_id = cm_u_id and cm_b_pk = #{b_pk} order by cm_datetime desc ")
    public List<CommentsDTO> selectCommunityComments(int b_pk);

    // 내 좋아요 판단 여부
    @Select("select count(*) from cli_like where l_b_pk = #{b_pk} and l_u_id = #{u_id}")
    public int selectLikeCountThisUser(CommunityDTO communityDTO);

    // 댓글 총 갯수
    @Select("select count(*) from cli_comments where cm_b_pk = #{cm_b_pk} ")
    public int selectCommentsCount(int cm_b_pk);

    // 대댓글 조회
    @Select("select re.*, u_nickname, u_grade " +
            "from cli_replycomments re, cli_user u " +
            "where re_u_id = u_id and re_b_pk = #{b_pk}")
    public List<ReplyDTO> selectReplyComments(int b_pk);

    // 대댓글 인서트
    @Insert("insert into cli_replycomments " +
            "values (cli_replycomments_seq.nextval, #{re_b_pk} ,#{re_cm_pk}, #{re_u_id}, #{re_text}, SYSTIMESTAMP AT TIME ZONE 'Asia/Seoul')")
    public int insertReplyComments(ReplyDTO replyDTO);

    // 대댓글 삭제
    @Delete("delete from cli_replycomments where re_pk = #{re_pk}")
    public int deleteReplyComments(int re_pk);

}
