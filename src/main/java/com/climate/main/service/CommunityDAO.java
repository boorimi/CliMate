package com.climate.main.service;

import com.climate.main.dto.CommentsDTO;
import com.climate.main.dto.CommunityDTO;
import com.climate.main.mapper.CommunityMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.*;

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
    public CommunityDTO selectCommunityShowoff(CommunityDTO communityDTO) {
        return communityMapper.selectCommunityShowoff(communityDTO);
    }

    @Override
    public CommunityDTO selectCommunityRecruitment(int b_pk) {
        return communityMapper.selectCommunityRecruitment(b_pk);
    }

    @Override
    public List<CommentsDTO> selectCommunityComments(int b_pk) {
        return communityMapper.selectCommunityComments(b_pk);
    }

    @Override
    public int insertCommunityShowoff(CommunityDTO communityDTO) {

        String UPLOADED_FOLDER_VIDEO = "src/main/resources/static/upload/video/";
        String UPLOADED_FOLDER_THUMBNAIL = "src/main/resources/static/upload/thumbnail/";
        MultipartFile[] b_video = communityDTO.getB_FileName();
        MultipartFile b_thumbnail = communityDTO.getB_FileThumbnail();

        String selectID2 = "";
        String selectID3 = "";

        try {

            String thumbnail = "";
            int videoCount = 0;
            int totalFiles = b_video.length;

            for (int i = 0; i < totalFiles; i++) {
                UUID uuid = UUID.randomUUID();
                String randomID = uuid.toString();
                String[] selectID = randomID.split("-");
                selectID2 = selectID[0];

                String fileName = selectID2 + ".mp4";
                Path path = Paths.get(UPLOADED_FOLDER_VIDEO + fileName);

                byte[] bytes = b_video[i].getBytes();
                Files.write(path, bytes);
                selectID3 += fileName + "!";

                if (i == totalFiles - 1) {
                    if (b_thumbnail.isEmpty()) {
                        // 섬네일 파일이 비어있을 경우 마지막 파일에서만 섬네일 생성
                        thumbnail = createThumbnail(path.toFile(), selectID2);
                    } else {
                        // 섬네일 파일이 있을경우 이걸로 생성
                        String thumbnailFileName = selectID2 + "_thumbnail.jpg";
                        Path thumbnailPath = Paths.get(UPLOADED_FOLDER_THUMBNAIL + thumbnailFileName);
                        byte[] bytes2 = b_thumbnail.getBytes();
                        Files.write(thumbnailPath, bytes2);
                        thumbnail = thumbnailFileName;
                    }
                }
            }
            communityDTO.setB_video(selectID3);
            communityDTO.setB_thumbnail(thumbnail);
            if (communityMapper.insertCommunityShowoff(communityDTO) == 1) {
                System.out.println("입력성공");
            }
        } catch (Exception e) {
            e.printStackTrace();
        }

        return 0;
    }


    @Override
    public int insertCommunityLfg(CommunityDTO communityDTO) {
        return communityMapper.insertCommunityLfg(communityDTO);
    }

    public void moveFile(ArrayList<String> fileLists) {
        String sourceDir = "src/main/resources/static/upload/lfgimg/temp/";
        String targetDir = "src/main/resources/static/upload/lfgimg/";

        for (String fileName : fileLists) {
            try {
                Path sourcePath = Paths.get(sourceDir).resolve(fileName);
                Path targetPath = Paths.get(targetDir).resolve(fileName);

                // 파일 이동
                Files.move(sourcePath, targetPath, StandardCopyOption.REPLACE_EXISTING);
                System.out.println("Moved: " + fileName);
            } catch (IOException e) {
                System.err.println("Failed to move: " + fileName + " - " + e.getMessage());
            }
        }
    }

    @Override
    public int updateCommunityShowoff(CommunityDTO communityDTO) {
        return communityMapper.updateCommunityShowoff(communityDTO);
    }

    @Override
    public int updateCommunityLfg(CommunityDTO communityDTO) {
        return communityMapper.updateCommunityLfg(communityDTO);
    }

    private String createThumbnail(File videoFile, String selectID2) throws IOException, InterruptedException {
            String thumbnailPath = "src/main/resources/static/upload/thumbnail/" + selectID2 + "_thumbnail.png";
            System.out.println(videoFile.getParent());
            // FFmpeg 명령어 실행
            ProcessBuilder processBuilder = new ProcessBuilder(
                    "ffmpeg",
                    "-i", videoFile.getAbsolutePath(),
                "-ss", "00:00:01.000",
                "-vframes", "1",
                thumbnailPath
        );
        processBuilder.redirectErrorStream(true);
        Process process = processBuilder.start();
        return selectID2 + "_thumbnail.png";
    }

    @Override
    public int deleteCommunityShowoff(CommunityDTO communityDTO) {
        CommunityDTO c = communityMapper.selectCommunityShowoff(communityDTO);

        String UPLOADED_FOLDER_VIDEO = "src/main/resources/static/upload/video/";
        String UPLOADED_FOLDER_THUMBNAIL = "src/main/resources/static/upload/thumbnail/";

        String b_video = c.getB_video();
        String b_thumbnail = c.getB_thumbnail();
        if (b_video != null && !b_video.isEmpty()) {
            String[] fileNames = b_video.split("!");

            // 섬네일 삭제
            File fileThumbnail = new File(UPLOADED_FOLDER_THUMBNAIL + b_thumbnail);
            if (fileThumbnail.exists()) {
                if (!fileThumbnail.delete()) {
                    throw new RuntimeException("Failed to delete file: " + b_thumbnail);
                }
            }

            // 각 동영상 삭제
            for (String fileName : fileNames) {
                File file = new File(UPLOADED_FOLDER_VIDEO + fileName);
                if (file.exists()) {
                    if (!file.delete()) {
                        throw new RuntimeException("Failed to delete file: " + fileName);
                    }
                }
            }
        }
        return communityMapper.deleteCommunityShowoff(communityDTO);
    }

    public int deleteCommunityLfg(int b_pk) {

        String UPLOADED_FOLDER_VIDEO = "src/main/resources/static/upload/lfgimg/";

        CommunityDTO communityDTO = communityMapper.selectCommunityRecruitment(b_pk);
        String b_text = communityDTO.getB_text();
        String startDelimiter = "/resources/upload/lfgimg/";
        String endDelimiter = "\"";

        List<String> filenames = new ArrayList<>();

        int startIndex = 0;
        while ((startIndex = b_text.indexOf(startDelimiter, startIndex)) != -1) {
            startIndex += startDelimiter.length();
            int endIndex = b_text.indexOf(endDelimiter, startIndex);
            if (endIndex != -1) {
                String filename = b_text.substring(startIndex, endIndex);
                filenames.add(filename);
                startIndex = endIndex + endDelimiter.length();
            } else {
                break;
            }
        }

        // 배열로 변환
        String[] filenameArray = filenames.toArray(new String[0]);

            // 각 사진들 삭제
            for (String fileName : filenameArray) {
                File file = new File(UPLOADED_FOLDER_VIDEO + fileName);
                if (file.exists()) {
                    if (!file.delete()) {
                        throw new RuntimeException("Failed to delete file: " + fileName);
                    }
                }
            }
        return communityMapper.deleteCommunityShowoff(communityDTO);
    }

    @Override
    public int insertCommunityLike(CommunityDTO communityDTO) {
        return communityMapper.insertCommunityLike(communityDTO);
    }

    @Override
    public int deleteCommunityLike(CommunityDTO communityDTO) {
        return communityMapper.deleteCommunityLike(communityDTO);
    }

    @Override
    public int selectLikeCount(int b_pk) {
        return communityMapper.selectLikeCount(b_pk);
    }

    @Override
    public int selectLikeCountThisUser(CommunityDTO communityDTO) {
        return communityMapper.selectLikeCountThisUser(communityDTO);
    }

    @Override
    public int selectCommentsCount(int cm_b_pk) {
        return communityMapper.selectCommentsCount(cm_b_pk);
    }

    @Override
    public List<CommunityDTO> selectSearchCommunityShowoff(String columnName, String searchWord) {
        return communityMapper.selectSearchCommunityShowoff(columnName, searchWord);
    }

    @Override
    public List<CommunityDTO> selectSearchCommunityLfg(String columnName, String searchWord) {
        return communityMapper.selectSearchCommunityLfg(columnName, searchWord);
    }

    @Override
    public List<CommunityDTO> selectHashtagSearchCommunityShowoff(String searchWord) {
        return communityMapper.selectHashtagSearchCommunityShowoff(searchWord);
    }

    @Override
    public List<CommunityDTO> selectHashtagSearchCommunityLfg(String searchWord) {
        return communityMapper.selectHashtagSearchCommunityLfg(searchWord);
    }

    @Override
    public int insertCommunityComments(CommentsDTO commentsDTO) {
        return communityMapper.insertCommunityComments(commentsDTO);
    }

    @Override
    public int deleteCommunityComments(int cm_pk, int b_pk) {
        return communityMapper.deleteCommunityComments(cm_pk, b_pk);
    }


    public void changeFileName(CommunityDTO communityDTO, List<Map<String, String>> fileMapList) {
        // UUID와 Base64코드를 매핑시켜 리스트로 가져왔음

        // 일단 Base64문자열을 UUID로 바꿔주고싶음.
        // 어디서? DTO안에 있는 b_text를 불러오고 불러온다음 교체를해야함
        // 일단 b_text를 get 해옴
        String b_text = communityDTO.getB_text();
        // key값(Base64값)은 문자열에서 분리하여 따오기
        // 찾을 문자열의 시작과 끝 설정
        String startDelimiter = "<img src=\"";
        String endDelimiter = "\"";

        List<String> filenames = new ArrayList<>();

        int startIndex = 0;
        while ((startIndex = b_text.indexOf(startDelimiter, startIndex)) != -1) {
            startIndex += startDelimiter.length();
            int endIndex = b_text.indexOf(endDelimiter, startIndex);
            if (endIndex != -1) {
                String filename = b_text.substring(startIndex, endIndex);
                if (filename.length() >= 200) {
                    filenames.add(filename);
                }
                startIndex = endIndex + endDelimiter.length();
            } else {
                break;
            }
        }

        // 배열로 변환
        String[] filenameArray = filenames.toArray(new String[0]);
        for (int i = 0; i < filenameArray.length; i++) {
            b_text = communityDTO.getB_text();
            String originBase64Key = filenameArray[i];
//            System.out.println(originBase64Key);
            // value를 분리하여 변수에 저장
            Map<String, String> fileMap = fileMapList.get(i);
            String newUUIDName = fileMap.get(originBase64Key);
            // b_text 내부 내욜을 replace한다
            if (b_text != null && b_text.contains(originBase64Key)) {
                communityDTO.setB_text(b_text.replace(originBase64Key, "/resources/upload/lfgimg/" + newUUIDName + ".png"));
            }
        }

    }

}
