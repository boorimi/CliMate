package com.climate.main.service;

import com.climate.main.dto.CommentsDTO;
import com.climate.main.dto.CommunityDTO;
import com.climate.main.mapper.CommunityMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
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

                if (i == totalFiles - 1 ) {
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

    @Override
    public int updateCommunityShowoff(CommunityDTO communityDTO) {
        return communityMapper.updateCommunityShowoff(communityDTO);
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
//        process.waitFor();
        ///////////////////////////////////
        // 프로세스의 출력 로그를 읽어서 확인
//        try (BufferedReader reader = new BufferedReader(new InputStreamReader(process.getInputStream()))) {
//            String line;
//            while ((line = reader.readLine()) != null) {
//                System.out.println(line);
//            }
//        }

//        // FFmpeg 명령어 실행 후 결과 코드 확인
//        int exitCode = process.waitFor();
//        if (exitCode != 0) {
//            throw new IOException("FFmpeg process failed with exit code " + exitCode);
//        }
        /////////////////////////////////////////////

        return selectID2 + "_thumbnail.png";
        // 섬네일 파일을 원하는 위치로 이동
//        File thumbnailFile = new File(thumbnailPath);
//        Path destinationPath = Paths.get(videoFile.getParentFile().getAbsolutePath(), selectID2 + "_thumbnail.png");
//        Files.move(thumbnailFile.toPath(), destinationPath);
    }

    @Override
    public int deleteCommunityShowoff(int b_pk) {
        CommunityDTO communityDTO = communityMapper.selectCommunityShowoff(b_pk);
        String UPLOADED_FOLDER_VIDEO = "src/main/resources/static/upload/video/";
        String UPLOADED_FOLDER_THUMBNAIL = "src/main/resources/static/upload/thumbnail/";

        String b_video = communityDTO.getB_video();
        String b_thumbnail = communityDTO.getB_thumbnail();
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
        return communityMapper.deleteCommunityShowoff(b_pk);
    }

    @Override
    public int insertCommunityLike(int b_pk, String u_id) {
        return communityMapper.insertCommunityLike(b_pk, u_id);
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
    public int selectCommentsCount(int cm_b_pk) {
        return communityMapper.selectCommentsCount(cm_b_pk);
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


    public void changeFileName(CommunityDTO communityDTO) {
        String input = communityDTO.getB_text();

        String startDelimiter = "/resources/upload/lfgimg/";
        String endDelimiter = "\"";

        String filename = "";

        int startIndex = input.indexOf(startDelimiter);
        if (startIndex != -1) {
            startIndex += startDelimiter.length();
            int endIndex = input.indexOf(endDelimiter, startIndex);
            if (endIndex != -1) {
                filename = input.substring(startIndex, endIndex);
            }
        }

        UUID uuid = UUID.randomUUID();
        String randomID = uuid.toString();
        String[] selectID = randomID.split("-");
        String selectID2 = selectID[0];

//        String fileName = StringUtils.cleanPath(file.getOriginalFilename());
//        String fileName = "test.jpg";
        String originFileName = filename;
        String newFileName = selectID2 + getFileExtension(originFileName);

        String uploadDir = System.getProperty("user.dir") + "/src/main/resources/static/upload/lfgimg";
        File uploadDirFile = new File(uploadDir);
        File dest = new File(uploadDirFile, newFileName);

        System.out.println(originFileName);
        System.out.println(input);

        if (input != null && input.contains(originFileName)) {
            communityDTO.setB_text(input.replace(originFileName, newFileName));
        }

        String sourceFilePath = uploadDir + "/" + originFileName;
        String targetFilePath = uploadDir + "/" + newFileName;

        Path source = Paths.get(sourceFilePath);
        Path target = Paths.get(targetFilePath);

        try {
            // 파일 복사
            Files.copy(source, target, StandardCopyOption.REPLACE_EXISTING);
            System.out.println("File copied successfully.");

            // 원본 파일 삭제
            Files.delete(source);
            System.out.println("Original file deleted successfully.");

        } catch (Exception e) {
            e.printStackTrace();
            System.out.println("File operation failed.");
        }


    }

    public static String getFileExtension(String fileName) {
        if (fileName != null && fileName.contains(".")) {
            return fileName.substring(fileName.lastIndexOf("."));
        }
        return "";
    }

}
