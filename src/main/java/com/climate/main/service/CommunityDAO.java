package com.climate.main.service;

import com.climate.main.dto.CommentsDTO;
import com.climate.main.dto.CommunityDTO;
import com.climate.main.dto.LikeDTO;
import com.climate.main.mapper.CommunityMapper;
import com.climate.main.mapper.TestMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
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
    public List<CommentsDTO> selectCommunityComments(int b_pk) {
        return communityMapper.selectCommunityComments(b_pk);
    }

    @Override
    public int insertCommunityShowoff(CommunityDTO communityDTO) {

        String UPLOADED_FOLDER = "src/main/resources/static/upload/";
        MultipartFile[] b_video = communityDTO.getB_FileName();

        String selectID2 = "";
        String selectID3 = "";

        try {
            for ( MultipartFile v : b_video ) {
                UUID uuid = UUID.randomUUID();
                String randomID = uuid.toString();
                String[] selectID = randomID.split("-");
                selectID2 = selectID[0];

                byte[] bytes = v.getBytes();
                Path path = Paths.get(UPLOADED_FOLDER + selectID2 + ".mp4");
                Files.write(path, bytes);

                selectID3 += selectID2 + ".mp4" + "!";
            }
            communityDTO.setB_video(selectID3);
            if (communityMapper.insertCommunityShowoff(communityDTO) == 1) {
                System.out.println("입력성공");
            }
        } catch (IOException e) {
            e.printStackTrace();
        }

        return 0;
    }

    @Override
    public int deleteCommunityShowoff(int b_pk) {
        CommunityDTO communityDTO = communityMapper.selectCommunityShowoff(b_pk);
        String UPLOADED_FOLDER = "src/main/resources/static/upload/";

        String b_video = communityDTO.getB_video();
        if (b_video != null && !b_video.isEmpty()) {
            String[] fileNames = b_video.split("!");

            // 각 파일 삭제
            for (String fileName : fileNames) {
                File file = new File(UPLOADED_FOLDER + fileName);
                if (file.exists()) {
                    if (!file.delete()) {
                        throw new RuntimeException("Failed to delete file: " + fileName);
                    }
                }
            }
        }
        return communityMapper.deleteCommunityShowoff(b_pk);
    }

    @Override
    public int insertCommunityLike(int b_pk, String u_id) {
        return communityMapper.insertCommunityLike(b_pk,u_id);
    }

    @Override
    public int deleteCommunityLike(int b_pk, String u_id) {
        return communityMapper.deleteCommunityLike(b_pk, u_id);
    }

    @Override
    public int selectLikeCount(int b_pk) {
        return communityMapper.selectLikeCount(b_pk);
    }

    @Override
    public int selectLikeCountThisUser(int b_pk) {
        return communityMapper.selectLikeCountThisUser(b_pk);
    }

    @Override
    public List<CommunityDTO> selectSearchCommunityShowoff(String columnName, String searchWord) {
        return communityMapper.selectSearchCommunityShowoff(columnName, searchWord);
    }

    @Override
    public List<CommunityDTO> selectHashtagSearchCommunityShowoff(String searchWord) {
        return communityMapper.selectHashtagSearchCommunityShowoff(searchWord);
    }

    @Override
    public int insertCommunityComments(int b_pk, String cm_text) {
        return communityMapper.insertCommunityComments(b_pk, cm_text);
    }

    @Override
    public int deleteCommunityComments(int cm_pk, int b_pk) {
        return communityMapper.deleteCommunityComments(cm_pk, b_pk);
    }


}
