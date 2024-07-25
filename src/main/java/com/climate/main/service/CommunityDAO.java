package com.climate.main.service;

import com.climate.main.dto.CommunityDTO;
import com.climate.main.mapper.CommunityMapper;
import com.climate.main.mapper.TestMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.UUID;

@Service
public class CommunityDAO implements CommunityMapper {

    @Autowired
    private CommunityMapper communityMapper;


    @Override
    public List<CommunityDTO> selectAllCommunityShowoff() {
        return communityMapper.selectAllCommunityShowoff();
    }

    @Override
    public List<CommunityDTO> selectAllCommunityRecruitment() {
        return communityMapper.selectAllCommunityRecruitment();
    }

    @Override
    public CommunityDTO selectCommunityShowoff(int b_pk) {
        return communityMapper.selectCommunityShowoff(b_pk);
    }

    @Override
    public int insertCommunityShowoff(CommunityDTO communityDTO) {

        String UPLOADED_FOLDER = "src/main/resources/static/upload/";
        MultipartFile b_video = communityDTO.getB_FileName();
        String selectID2 = "";

        try {
            UUID uuid = UUID.randomUUID();
            String randomID = uuid.toString();
            System.out.println(randomID);
            String[] selectID = randomID.split("-");
            selectID2 = selectID[0];
            System.out.println(selectID2);

            byte[] bytes = b_video.getBytes();
            Path path = Paths.get(UPLOADED_FOLDER + selectID2 + ".mp4");
            Files.write(path, bytes);

            communityDTO.setB_video(selectID2 + ".mp4");
            if (communityMapper.insertCommunityShowoff(communityDTO) == 1) {
                System.out.println("입력성공");
            }
        } catch (IOException e) {
            e.printStackTrace();
        }

        return 0;
    }

}
