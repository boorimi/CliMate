package com.climate.main.mapper;

import com.climate.main.dto.CommunityDTO;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Select;

import java.util.List;

@Mapper
public interface CommunityMapper {

    @Select("select bo.*, u_nickname from cli_board bo, cli_user where u_id = b_u_id and b_category = 'showoff' ")
    public List<CommunityDTO> selectCommunityShowoff();

}
