package com.climate.main.mapper;

import com.climate.main.dto.TestVO;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Select;

import java.util.List;

@Mapper
public interface TestMapper {

    @Select("select * from tests")
    public List<TestVO> getTests();


    @Select("select * from tests where no = #{no}")
    TestVO getTestJSON(int no);
}
