package com.climate.main.service;

import com.climate.main.dto.MyCommentsDTO;
import com.climate.main.dto.UserDTO;
import com.climate.main.mapper.MypageMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class MypageDAO implements MypageMapper {

    @Autowired
    private MypageMapper mypageMapper;


    @Override
    public UserDTO selectUserInfo(UserDTO userDTO) {
        return mypageMapper.selectUserInfo(userDTO);
    }

    @Override
    public int updateUserInfo(UserDTO userDTO) {
        return mypageMapper.updateUserInfo(userDTO);
    }

    @Override
    public List<MyCommentsDTO> selectAllMyComments(MyCommentsDTO myCommentsDTO) {
        return mypageMapper.selectAllMyComments(myCommentsDTO);
    }

    @Override
    public int deleteUserInfo(UserDTO userDTO){return  mypageMapper.deleteUserInfo(userDTO);}
}
