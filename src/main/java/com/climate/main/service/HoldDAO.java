package com.climate.main.service;

import com.climate.main.dto.HoldDTO;
import com.climate.main.mapper.HoldMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class HoldDAO implements HoldMapper{

    @Autowired
    private HoldMapper holdMapper;

    @Override
    public List<HoldDTO> getAllHolds(){
        return holdMapper.getAllHolds();
    };
}
