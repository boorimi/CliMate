package com.climate.main.service;

import com.climate.main.dto.*;
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
    public SimulatorDTO getProject(int pk){
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

    @Override
    public int insertSimulatorComments(CommentsDTO commentsDTO) {
        return simulatorMapper.insertSimulatorComments(commentsDTO);
    }

    @Override
    public int deleteSimulatorComment(int cm_pk, int b_pk) {
        return simulatorMapper.deleteSimulatorComment(cm_pk, b_pk);
    }

    @Override
    public List<CommentsDTO> selectCommunityComments(int b_pk) {
        return simulatorMapper.selectCommunityComments(b_pk);
    }

    @Override
    public int selectLikeCountThisUser(CommunityDTO communityDTO) {
        return simulatorMapper.selectLikeCountThisUser(communityDTO);
    }

    @Override
    public int selectCommentsCount(int cm_b_pk) {
        return simulatorMapper.selectCommentsCount(cm_b_pk);
    }

    @Override
    public List<ReplyDTO> selectReplyComments(int b_pk) {
        return simulatorMapper.selectReplyComments(b_pk);
    }

    @Override
    public int insertReplyComments(ReplyDTO replyDTO) {
        return simulatorMapper.insertReplyComments(replyDTO);
    }

    @Override
    public int deleteReplyComments(int re_pk) {
        return simulatorMapper.deleteReplyComments(re_pk);
    }

}
