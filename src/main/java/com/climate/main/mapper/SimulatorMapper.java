package com.climate.main.mapper;

import com.climate.main.dto.HoldDTO;
import com.climate.main.dto.SimulatorDTO;
import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Select;

import java.util.List;

@Mapper
public interface SimulatorMapper {

    @Select("select * from cli_hold")
    public List<HoldDTO> getAllHolds();

    @Insert("insert into cli_simulator values (cli_simulator_seq.nextval, #{s_file}, #{s_img}, sysdate, #{s_u_id})")
    public int uploadFile(SimulatorDTO simulatorDTO);

    // 모든 시뮬레이터 문제 셀렉트
    @Select("SELECT s.*, u.u_nickname, u.u_grade, u.u_category " +
            "FROM cli_simulator s " +
            "JOIN cli_user u " +
            "ON s.s_u_id = u.u_id")
    public List<SimulatorDTO> getAllProject();

}
