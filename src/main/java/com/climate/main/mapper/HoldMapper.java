package com.climate.main.mapper;

import com.climate.main.dto.HoldDTO;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Select;

import java.util.List;

@Mapper
public interface HoldMapper {

    @Select("select * from cli_hold")
    public List<HoldDTO> getAllHolds();

}
