package com.climate.main.service;

import com.climate.main.dto.MyPlaceDTO;
import com.climate.main.mapper.MyPlaceMapper;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class MyPlaceDAO implements MyPlaceMapper {
    @Autowired
    private MyPlaceMapper myPlaceMapper;

    @Override
    public int insertWish(MyPlaceDTO myplaceDTO) {
        return myPlaceMapper.insertWish(myplaceDTO);
    }

    @Override
    public MyPlaceDTO getOne(MyPlaceDTO myplaceDTO) {
        return myPlaceMapper.getOne(myplaceDTO);
    }

    @Override
    public List<MyPlaceDTO> getAll(String mp_u_id) {
        return myPlaceMapper.getAll(mp_u_id);
    }

    @Override
    public List<MyPlaceDTO> getAllById(String mp_u_id, int page, int size) {
        int startRow = page * size + 1;
        int endRow = (page + 1) * size;
        return myPlaceMapper.getAllById(mp_u_id, startRow, endRow);
    }

    @Override
    public int deleteWish(String mp_u_id, String mp_name, String mp_type) {
        return myPlaceMapper.deleteWish(mp_u_id, mp_name, mp_type);
    }

    @Override
    public int insertCheck(MyPlaceDTO myplaceDTO) {
        return myPlaceMapper.insertCheck(myplaceDTO);
    }

    @Override
    public int deleteCheck(String mp_u_id, String mp_name, String mp_type) {
        return myPlaceMapper.deleteCheck(mp_u_id, mp_name, mp_type);
    }

    @Override
    public int getAllByIdCnt(String mp_u_id) {
        return myPlaceMapper.getAllByIdCnt(mp_u_id);
    }

    @Override
    public List<MyPlaceDTO> getSearchById(String mp_u_id, String mp_name) {
        return myPlaceMapper.getSearchById(mp_u_id, mp_name);
    }

    @Override
    public int getWishCntById(String mp_u_id) {
        return myPlaceMapper.getWishCntById(mp_u_id);
    }

    @Override
    public int getCheckCntById(String mp_u_id) {
        return myPlaceMapper.getCheckCntById(mp_u_id);
    }

    @Override
    public List<MyPlaceDTO> getWishDataById(String mp_u_id, int page, int size) {
        int startRow = page * size + 1;
        int endRow = (page + 1) * size;
        return myPlaceMapper.getWishDataById(mp_u_id, startRow, endRow);
    }

    @Override
    public List<MyPlaceDTO> getCheckDataById(String mp_u_id, int page, int size) {
        int startRow = page * size + 1;
        int endRow = (page + 1) * size;
        return myPlaceMapper.getCheckDataById(mp_u_id, startRow, endRow);
    }
}
