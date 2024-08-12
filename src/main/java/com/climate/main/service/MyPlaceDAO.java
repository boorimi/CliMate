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
    public MyPlaceDTO getOneWish(MyPlaceDTO myplaceDTO) {
        return myPlaceMapper.getOneWish(myplaceDTO);
    }

    @Override
    public List<MyPlaceDTO> getAllWish(String mp_u_id) {
        return myPlaceMapper.getAllWish(mp_u_id);
    }
}
