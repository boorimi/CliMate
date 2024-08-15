package com.climate.main.mapper;

import com.climate.main.dto.MyPlaceDTO;
import org.apache.ibatis.annotations.Delete;
import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Select;

import java.util.List;

@Mapper
public interface MyPlaceMapper {
    @Insert("insert into CLI_MYPLACE values(CLI_MYPLACE_SEQ.nextval, #{mp_u_id}, #{mp_type}, #{mp_name}, #{mp_addr})")
    public int insertWish(MyPlaceDTO myPlaceDTO);

    @Delete("delete from CLI_MYPLACE where mp_u_id = #{mp_u_id} and mp_name = #{mp_name} and mp_type = #{mp_type}")
    public int deleteWish(String mp_u_id, String mp_name, String mp_type);

    @Insert("insert into CLI_MYPLACE values(CLI_MYPLACE_SEQ.nextval, #{mp_u_id}, #{mp_type}, #{mp_name}, #{mp_addr})")
    public int insertCheck(MyPlaceDTO myPlaceDTO);

    @Delete("delete from CLI_MYPLACE where mp_u_id = #{mp_u_id} and mp_name = #{mp_name} and mp_type = #{mp_type}")
    public int deleteCheck(String mp_u_id, String mp_name, String mp_type);

    @Select("select * from CLI_MYPLACE where mp_u_id = #{mp_u_id} and mp_name = #{mp_name} and mp_type = #{mp_type}")
    public MyPlaceDTO getOne(MyPlaceDTO myPlaceDTO);

    @Select("select * from CLI_MYPLACE where mp_u_id = #{mp_u_id}")
    public List<MyPlaceDTO> getAll(String mp_u_id);

    @Select("select * from (select mp_u_id, mp_name, mp_addr, mp_type, ROW_NUMBER() over (order by mp_u_id) as row_num from CLI_MYPLACE where mp_u_id = #{mp_u_id}) where row_num Between #{startRow} and #{endRow}")
    public List<MyPlaceDTO> getAllById(String mp_u_id, int startRow, int endRow);

    @Select("select COUNT(*) from CLI_MYPLACE where mp_u_id = #{mp_u_id}")
    public int getAllByIdCnt(String mp_u_id);

    @Select("select mp_name, mp_addr, mp_type from CLI_MYPLACE where mp_u_id = #{mp_u_id} and mp_name like '%' || #{mp_name} || '%'")
    public List<MyPlaceDTO> getSearchById(String mp_u_id, String mp_name);

    @Select("select COUNT(*) from CLI_MYPLACE where mp_u_id = #{mp_u_id} and mp_type = 'Wish'")
    public int getWishCntById(String mp_u_id);

    @Select("select COUNT(*) from CLI_MYPLACE where mp_u_id = #{mp_u_id} and mp_type = 'Check'")
    public int getCheckCntById(String mp_u_id);
}
