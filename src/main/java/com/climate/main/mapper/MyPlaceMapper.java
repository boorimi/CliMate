package com.climate.main.mapper;

import com.climate.main.dto.MyPlaceDTO;
import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Select;

import java.util.List;

@Mapper
public interface MyPlaceMapper {
    @Insert()
    public MyPlaceDTO insertMyPlace();
}
