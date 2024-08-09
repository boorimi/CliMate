package com.climate.main.service;

import com.climate.main.dto.HoldDTO;
import com.climate.main.dto.SimulatorDTO;
import com.climate.main.mapper.SimulatorMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class SimulatorDAO implements SimulatorMapper {

    @Autowired
    private SimulatorMapper simulatorMapper;

    @Override
    public List<HoldDTO> getAllHolds(){
        return simulatorMapper.getAllHolds();
    }

    @Override
    public int uploadFile(SimulatorDTO simulatorDTO) {
        return simulatorMapper.uploadFile(simulatorDTO);
    }

    ;

}
