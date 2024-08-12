package com.climate.main.mapper;

import com.climate.main.dto.MyPlaceDTO;
import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Select;

import java.util.List;

@Mapper
public interface MyPlaceMapper {
    @Insert("insert into CLI_MYPLACE values(CLI_MYPLACE_SEQ.nextval, #{mp_u_id}, #{mp_like}, #{mp_likeaddr}, null, null)")
    public int insertWish(MyPlaceDTO myPlaceDTO);

    @Select("select * from CLI_MYPLACE where mp_u_id = #{mp_u_id} and mp_like = #{mp_like}")
    public MyPlaceDTO getOneWish(MyPlaceDTO myPlaceDTO);

    @Select("select * from CLI_MYPLACE where mp_u_id = #{mp_u_id}")
    public List<MyPlaceDTO> getAllWish(String mp_u_id);
}
