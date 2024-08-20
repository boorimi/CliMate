package com.climate.main.service;

import com.climate.main.dto.MyCommentsDTO;
import com.climate.main.dto.UserDTO;
import com.climate.main.mapper.MypageMapper;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class MypageDAO implements MypageMapper {

    @Autowired
    private MypageMapper mypageMapper;
    @Autowired
    private HttpSession httpSession;


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
    public int deleteUserInfo(UserDTO userDTO){
        if ( mypageMapper.deleteUserInfo(userDTO) == 1) {
            System.out.println("탈퇴 성공!");// 삭제가 성공하면
            httpSession.invalidate();
        }
        return 1;
    }
}
