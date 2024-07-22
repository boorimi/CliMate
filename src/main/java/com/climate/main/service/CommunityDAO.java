package com.climate.main.service;

import com.climate.main.dto.CommunityDTO;
import com.climate.main.mapper.CommunityMapper;
import com.climate.main.mapper.TestMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CommunityDAO implements CommunityMapper {

    @Autowired
    private CommunityMapper communityMapper;


    @Override
    public List<CommunityDTO> selectCommunityShowoff() {
        return communityMapper.selectCommunityShowoff();
    }
}
