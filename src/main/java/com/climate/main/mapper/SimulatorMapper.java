package com.climate.main.mapper;

import com.climate.main.dto.HoldDTO;
import com.climate.main.dto.SimulatorDTO;
import org.apache.ibatis.annotations.*;

import java.util.List;

@Mapper
public interface SimulatorMapper {

    @Select("select * from cli_hold")
    public List<HoldDTO> getAllHolds();

    @Insert("insert into cli_simulator values (cli_simulator_seq.nextval, #{s_file}, #{s_img}, SYSTIMESTAMP AT TIME ZONE 'Asia/Seoul', #{s_u_id})")
    public int uploadFile(SimulatorDTO simulatorDTO);

    // 모든 시뮬레이터 문제 셀렉트
    @Select("SELECT s.*, u.u_nickname, u.u_grade, u.u_category " +
            "FROM cli_simulator s " +
            "JOIN cli_user u " +
            "ON s.s_u_id = u.u_id " +
            "order by s.s_date desc")
    public List<SimulatorDTO> getAllProject();

    // 내가 만든 문제 셀렉트
    @Select("select s.*, u.u_nickname, u.u_grade, u.u_category " +
            "from cli_simulator s " +
            "JOIN cli_user u " +
            "ON s.s_u_id = u.u_id " +
            "where s.s_u_id = #{userId} " +
            "order by s.s_date desc")
    public List<SimulatorDTO> getMyProject(String userId);

    // 문제 하나만 셀렉트
    @Select("SELECT s.*, u.u_nickname, u.u_grade, u.u_category " +
            "FROM cli_simulator s " +
            "JOIN cli_user u " +
            "ON s.s_u_id = u.u_id " +
            "WHERE s.s_pk = #{pk}")
    public List<SimulatorDTO> getProject(int pk);

    // 삭제
    @Delete("delete from cli_simulator where s_pk = #{pk}")
    public int deleteProject(@Param("pk") int pk);
}
