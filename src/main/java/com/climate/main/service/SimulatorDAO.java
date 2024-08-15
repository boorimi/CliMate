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

    @Override
    public List<SimulatorDTO> getAllProject() {
        return simulatorMapper.getAllProject();
    }

    @Override
    public List<SimulatorDTO> getMyProject(String userId) { return  simulatorMapper.getMyProject(userId);}

    @Override
    public List<SimulatorDTO> getProject(int pk){
        return simulatorMapper.getProject(pk);
    }

    @Override
    public List<SimulatorDTO> selectSetter() { return simulatorMapper.selectSetter();}

    @Override
    public List<SimulatorDTO> selectNormal() {
        return simulatorMapper.selectNormal();
    }

    @Override
    public List<SimulatorDTO> searchNickname(String nickname) {
        return simulatorMapper.searchNickname(nickname);
    }

    @Override
    public int deleteProject(int pk){return simulatorMapper.deleteProject(pk);}

}
