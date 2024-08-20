package com.climate.main.controller;

import com.climate.main.dto.*;
import com.climate.main.service.CommunityDAO;
import com.google.cloud.storage.BlobId;
import com.google.cloud.storage.BlobInfo;
import com.google.cloud.storage.Storage;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import java.io.BufferedReader;
import java.io.File;
import java.io.IOException;
import java.io.InputStreamReader;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.*;
import java.util.concurrent.CompletableFuture;

@Controller
public class CommunityC {

    @Autowired
    private CommunityDAO communityDAO;
    private LikeDTO likeDTO;

    private final Storage storage;

    @Autowired
    public CommunityC(Storage storage) {
        this.storage = storage;
    }

    private Map<String, String> fileMap = new HashMap<>();
    private List<Map<String, String>> fileMapList = new ArrayList<>();

    private ArrayList<String> fileLists = new ArrayList<>();


    @GetMapping("/community/video")
    public String communityShowoff(HttpSession session, Model model) {
        String userId = (String) session.getAttribute("user_id");
        model.addAttribute("user_id", userId);
        model.addAttribute("showoffLists", communityDAO.selectAllCommunityShowoff());
        model.addAttribute("actionURL", "/community/search");
        model.addAttribute("content", "/community/community_menu");
        model.addAttribute("community_content", "/community/community_video");
        return "index";
    }

    @GetMapping("/community/lfg")
    public String communityLfg(HttpSession session, Model model) {
        String userId = (String) session.getAttribute("user_id");
        model.addAttribute("user_id", userId);
        model.addAttribute("recruitment", communityDAO.selectAllCommunityRecruitment());
        model.addAttribute("actionURL", "/community/searchLfg");
        model.addAttribute("content", "/community/community_menu");
        model.addAttribute("community_content", "/community/community_lfg");
        return "index";
    }

    @GetMapping("/community/video/insert")
    public String moveInsertCommunityShowoff(Model model) {
        model.addAttribute("content", "/community/community_video_insert");
        return "index";
    }

    @GetMapping("/community/lfg/insert")
    public String moveInsertCommunityLfg(Model model) {
        model.addAttribute("content", "/community/community_lfg_insert");
        return "index";
    }

    @PostMapping("/community/lfg/insert")
    public String InsertCommunityLfg(CommunityDTO communityDTO) {
        communityDAO.changeFileName(communityDTO, fileMapList);
        communityDAO.moveFile(fileLists);
        communityDAO.insertCommunityLfg(communityDTO);
        return "redirect:/community/lfg";
    }

    @PostMapping("/community/video/insert")
//    public ResponseEntity<Map<String, String>> uploadFile(
    public String uploadFile(
            @RequestParam("b_FileName") MultipartFile[] b_FileName,
            @RequestParam("b_FileThumbnail") MultipartFile b_FileThumbnail,
            CommunityDTO communityDTO,
            HttpSession session) {

        Map<String, String> res = new HashMap<>();

        try {

            String videoFileName = "";
            String videoFileNames = "";
            String thumbnailFileName = "";
            String videoFileUrls = "";
            String thumbnailFileUrl = "";

            // 동영상 파일을 Firebase Storage에 업로드
            for (int i = 0; i < b_FileName.length; i++) {
                String originalFilename = b_FileName[i].getOriginalFilename(); // 원본 파일명 예: "example.jpg"
                // 원본 파일의 확장자 추출
                String extension = "";
                int dotIndex = originalFilename.lastIndexOf('.');
                if (dotIndex > 0 && dotIndex < originalFilename.length() - 1) {
                    extension = originalFilename.substring(dotIndex); // ".jpg"
                }
                videoFileName = UUID.randomUUID().toString() + extension;
                System.out.println("videoFileName: " + videoFileName);
                String videoContentType = b_FileName[i].getContentType();
                BlobId videoBlobId = BlobId.of("climate-4e4fe.appspot.com", "upload/" + videoFileName);
                BlobInfo videoBlobInfo = BlobInfo.newBuilder(videoBlobId).setContentType(videoContentType).build();
                storage.create(videoBlobInfo, b_FileName[i].getBytes());

                if (i == b_FileName.length - 1) {
                    if (b_FileThumbnail.isEmpty()) {
                        System.out.println("섬네일 비었음");
                        // 섬네일 파일이 비어있을 경우
                        // 마지막 파일에서만 섬네일 생성
//                        thumbnailFileName = "test_thumbnail.png";
                        thumbnailFileName = UUID.randomUUID().toString() + "_thumbnail.png";
                        File thumbnailFile = new File(System.getProperty("user.dir") + "/src/main/resources/static/upload/thumbnail/" + thumbnailFileName);
                        System.out.println("thumbnailPath : " + thumbnailFile.getAbsolutePath());

                        // 임시 파일로 저장
                        File tempVideoFile = File.createTempFile("temp", ".mp4", new File(System.getProperty("user.dir") + "/src/main/resources/static/upload/thumbnail/"));
                        b_FileName[i].transferTo(tempVideoFile);
                        System.out.println("tempVideoFile : " + tempVideoFile.getAbsolutePath());

                        // FFmpeg 명령어를 사용하여 썸네일 생성
                        ProcessBuilder processBuilder = new ProcessBuilder(
                                "ffmpeg",
                                "-i", tempVideoFile.getAbsolutePath(),  // 입력 비디오 파일의 절대 경로
                                "-ss", "00:00:01.000",
                                "-vframes", "1",
                                thumbnailFile.getAbsolutePath()  // 썸네일 이미지 파일의 절대 경로
//                                        "C:\\kds\\Climate\\src\\main\\resources\\static\\upload\\thumbnail\\test_thumbnail.png"  // 썸네일 이미지 파일의 절대 경로
                        );
                        processBuilder.redirectErrorStream(true);
                        Process process = processBuilder.start();

                        // 프로세스 출력 및 오류 스트림을 비동기로 읽어서 버퍼가 차지 않도록 처리
                        CompletableFuture<Void> streamGobbler = CompletableFuture.runAsync(() -> {
                            try (BufferedReader reader = new BufferedReader(new InputStreamReader(process.getInputStream()))) {
                                String line;
                                while ((line = reader.readLine()) != null) {
                                    System.out.println(line);
                                }
                            } catch (IOException e) {
                                e.printStackTrace();
                            }
                        });
                        try {
                            // 프로세스가 완료될 때까지 대기
                            int exitCode = process.waitFor();
                            // 스트림을 다 읽을 때까지 대기
                            streamGobbler.get();

                            if (exitCode != 0) {
                                throw new RuntimeException("FFmpeg 프로세스가 실패했습니다. 종료 코드: " + exitCode);
                            }
                        } catch (Exception e) {
                            e.printStackTrace();
                        }

                        // Firebase에 업로드할 썸네일 파일 처리
                        System.out.println("thumbnailFile : " + thumbnailFile);

                        String ThumbnailFileName = thumbnailFileName;
                        if (thumbnailFile.exists()) {
                            System.out.println("섬네일 생성 진입");
                            String firebaseThumbnailFileName = ThumbnailFileName;
                            String thumbnailContentType = null;
                            thumbnailContentType = Files.probeContentType(thumbnailFile.toPath());

                            // MIME 타입이 이미지인지 확인
                            if (thumbnailContentType == null || !thumbnailContentType.startsWith("image/")) {
                                System.out.println("Invalid MIME type for thumbnail: " + thumbnailContentType);
                                throw new RuntimeException("Invalid MIME type for thumbnail");
                            }

                            // Firebase Storage에 썸네일 업로드
                            BlobId thumbnailBlobId = BlobId.of("climate-4e4fe.appspot.com", "upload/" + firebaseThumbnailFileName);
                            BlobInfo thumbnailBlobInfo = BlobInfo.newBuilder(thumbnailBlobId).setContentType(thumbnailContentType).build();
                            storage.create(thumbnailBlobInfo, Files.readAllBytes(thumbnailFile.toPath()));

                            System.out.println("Thumbnail uploaded successfully with content type: " + thumbnailContentType);
                        } else {
                            System.out.println("썸네일 파일 생성 실패");
                        }
                        // 임시 파일 삭제
                        try {
                            if (tempVideoFile.exists() && !tempVideoFile.delete()) {
                                System.out.println("Failed to delete temporary video file: " + tempVideoFile.getAbsolutePath());
                            }
                        } catch (Exception e) {
                            System.out.println("Error while deleting temporary video file: " + e.getMessage());
                            e.printStackTrace();
                        }
                    } else {
                        System.out.println("섬네일있음");
                        // 썸네일 파일이 존재한다면
                        // 썸네일 파일을 Firebase Storage에 업로드
                        thumbnailFileName = UUID.randomUUID().toString() + "_" + b_FileThumbnail.getOriginalFilename();
                        String thumbnailContentType = b_FileThumbnail.getContentType();
                        BlobId thumbnailBlobId = BlobId.of("climate-4e4fe.appspot.com", "upload/" + thumbnailFileName);
                        BlobInfo thumbnailBlobInfo = BlobInfo.newBuilder(thumbnailBlobId).setContentType(thumbnailContentType).build();
                        storage.create(thumbnailBlobInfo, b_FileThumbnail.getBytes());
                    }
                }
                // 업로드된 파일의 URL 생성
                String firebaseUrlBase = "https://firebasestorage.googleapis.com/v0/b/climate-4e4fe.appspot.com/o/";

                String videoFileUrl = firebaseUrlBase + "upload%2F" + videoFileName + "?alt=media";
                // 비디오 파일 이름들 !구분자로 연결 저장

                videoFileUrls += videoFileUrl + "!";
                System.out.println("videoFileUrls: " + videoFileUrls);
                thumbnailFileUrl = firebaseUrlBase + "upload%2F" + thumbnailFileName + "?alt=media";
                System.out.println("thumbnailFileUrl: " + thumbnailFileUrl);
            }

            // DTO에 파일 경로 설정
            communityDTO.setB_video(videoFileUrls);
            communityDTO.setB_thumbnail(thumbnailFileUrl);
            communityDTO.setB_u_id((String) session.getAttribute("user_id"));

            // 데이터베이스에 정보 저장
            if (communityDAO.insertCommunityShowoff(communityDTO) == 1) {
                res.put("status", "success");
                System.out.println("입력 성공~");
            }
//            return ResponseEntity.ok(res);
        } catch (Exception e) {
            e.printStackTrace();
            res.put("status", "fail");
            res.put("message", e.getMessage());
//            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(res);
        }
        return "redirect:/community/video";
    }

    @GetMapping("/community/video/update")
    public String moveUpdateCommunityShowoff(CommunityDTO communityDTO, Model model) {
        model.addAttribute("showoffList", communityDAO.selectCommunityShowoff(communityDTO));
        model.addAttribute("content", "/community/community_video_update");
        return "index";
    }

    @GetMapping("/community/lfg/update")
    public String moveUpdateCommunityLfg(int b_pk, Model model) {
        model.addAttribute("lfgList", communityDAO.selectCommunityRecruitment(b_pk));
        model.addAttribute("content", "/community/community_lfg_update");
        return "index";
    }

    @PostMapping("/community/video/update")
    public String updateCommunityShowoff(CommunityDTO communityDTO) {
        communityDAO.updateCommunityShowoff(communityDTO);
        return "redirect:/community/video";
    }

    @PostMapping("/community/lfg/update")
    public String updateCommunityLfg(CommunityDTO communityDTO) {

        communityDAO.changeFileName(communityDTO, fileMapList);
        communityDAO.moveFile(fileLists);
        communityDAO.updateCommunityLfg(communityDTO);
        return "redirect:/community/lfg";
    }

    @GetMapping("/community/video/delete")
    public String deleteCommunityShowoff(CommunityDTO communityDTO) {
        communityDAO.deleteCommunityShowoff(communityDTO);
        return "redirect:/community/video";
    }

    @GetMapping("/community/lfg/delete")
    public String deleteCommunityLfg(int b_pk) {
        communityDAO.deleteCommunityLfg(b_pk);
        return "redirect:/community/lfg";
    }

    @GetMapping("/community/video/detail")
    public String communityShowoffDetail(HttpSession session, int b_pk, CommunityDTO communityDTO, Model model, ReplyDTO replyDTO) {
        communityDTO.setU_id((String) session.getAttribute("user_id"));
        model.addAttribute("replyLists", communityDAO.selectReplyComments(b_pk));
        model.addAttribute("showoffList", communityDAO.selectCommunityShowoff(communityDTO));
        model.addAttribute("showoffCommentsLists", communityDAO.selectCommunityComments(b_pk));
        model.addAttribute("showoffLikeCountThisUser", communityDAO.selectLikeCountThisUser(communityDTO));
        model.addAttribute("content", "/community/community_video_detail");
        return "index";
    }

    @GetMapping("/community/lfg/detail")
    public String communityLfgDetail(int b_pk, Model model, CommunityDTO communityDTO) {
//        model.addAttribute("showoffLikeCount", communityDAO.selectLikeCount(b_pk));
        model.addAttribute("replyLists", communityDAO.selectReplyComments(b_pk));
        model.addAttribute("showoffCommentsLists", communityDAO.selectCommunityComments(b_pk));
        model.addAttribute("lfgList", communityDAO.selectCommunityRecruitment(b_pk));
        model.addAttribute("content", "/community/community_lfg_detail");
        return "index";
    }

    @GetMapping("/community/search")
    public String communitySearch(String searchWord, String columnName, Model model) {
        model.addAttribute("searchResult", "searchResult");
        model.addAttribute("searchWord", searchWord);
        model.addAttribute("showoffLists", communityDAO.selectSearchCommunityShowoff(columnName, searchWord));
        columnName = columnName.substring(2);
        model.addAttribute("columnName", columnName);
        model.addAttribute("content", "/community/community_menu");
        model.addAttribute("community_content", "/community/community_video");
        return "index";
    }

    @GetMapping("/community/searchLfg")
    public String communitySearchLfg(String searchWord, String columnName, Model model) {
        model.addAttribute("searchResult", "searchResult");
        model.addAttribute("searchWord", searchWord);
        model.addAttribute("recruitment", communityDAO.selectSearchCommunityLfg(columnName, searchWord));
        columnName = columnName.substring(2);
        model.addAttribute("columnName", columnName);
        model.addAttribute("content", "/community/community_menu");
        model.addAttribute("community_content", "/community/community_lfg");
        return "index";
    }

    @PostMapping("/community/video/comments/insert")
    public String commentsInsertCommunityShowoff(int cm_b_pk, CommentsDTO commentsDTO) {
        communityDAO.insertCommunityComments(commentsDTO);
        return "redirect:/community/video/detail?b_pk=" + cm_b_pk;
    }

    @PostMapping("/community/lfg/comments/insert")
    public String commentsInsertCommunityLfg(int cm_b_pk, CommentsDTO commentsDTO) {
        communityDAO.insertCommunityComments(commentsDTO);
        return "redirect:/community/lfg/detail?b_pk=" + cm_b_pk;
    }

    @GetMapping("/community/video/deleteComments")
    public String deleteCommentsVideo(int cm_pk, int b_pk) {
        communityDAO.deleteCommunityComments(cm_pk, b_pk);
        return "redirect:/community/video/detail?b_pk=" + b_pk;
    }

    @GetMapping("/community/lfg/deleteComments")
    public String deleteCommentsLfg(int cm_pk, int b_pk) {
        communityDAO.deleteCommunityComments(cm_pk, b_pk);
        return "redirect:/community/lfg/detail?b_pk=" + b_pk;
    }

    @GetMapping("/community/hashtag")
    public String hashtagSearch(String searchWord, Model model) {
        model.addAttribute("showoffLists", communityDAO.selectHashtagSearchCommunityShowoff(searchWord));
        model.addAttribute("content", "/community/community_menu");
        model.addAttribute("community_content", "/community/community_video");
        return "index";
    }

    @GetMapping("/community/hashtagLfg")
    public String hashtagSearchLfg(String searchWord, Model model) {
        model.addAttribute("recruitment", communityDAO.selectHashtagSearchCommunityLfg(searchWord));
        model.addAttribute("content", "/community/community_menu");
        model.addAttribute("community_content", "/community/community_lfg");
        return "index";
    }

    @PostMapping("/community/lfg/insert/uploadImg")
    public void uploadFile(@RequestParam("file") MultipartFile file, Model model) {
        try {

            String uploadDir = System.getProperty("user.dir") + "/src/main/resources/static/upload/lfgimg/temp/";

            UUID uuid = UUID.randomUUID();
            String randomID = uuid.toString();
            String[] selectID = randomID.split("-");
            String selectID2 = selectID[0];

            // 로컬 서버에 사진 저장하는 코드
            byte[] bytes = file.getBytes();
            Path path = Paths.get(uploadDir + selectID2 + ".png");
            Files.write(path, bytes);

            // 서버에 저장된 사진을 firebase로 옮기는 코드

            // 원본 파일의 확장자 추출
            String originalFilename = file.getOriginalFilename(); // 원본 파일명 예: "example.jpg"
            String extension = "";
            int dotIndex = originalFilename.lastIndexOf('.');
            if (dotIndex > 0 && dotIndex < originalFilename.length() - 1) {
                extension = originalFilename.substring(dotIndex); // ".jpg"
            }
            String videoFileName = selectID2 + ".png";
            System.out.println("videoFileName: " + videoFileName);
            String videoContentType = file.getContentType();
            BlobId videoBlobId = BlobId.of("climate-4e4fe.appspot.com", "upload/" + videoFileName);
            BlobInfo videoBlobInfo = BlobInfo.newBuilder(videoBlobId).setContentType(videoContentType).build();
            storage.create(videoBlobInfo, file.getBytes());

            // MIME 타입 결정
            String mimeType = file.getContentType();
            if (mimeType == null) {
                mimeType = "application/octet-stream"; // 기본 MIME 타입
            }

            // Base64 인코딩 및 MIME 타입 정보 추가
            String base64String = Base64.getEncoder().encodeToString(file.getBytes());
            String base64DataURL = "data:" + mimeType + ";base64," + base64String;

            // UUID와 Base64 문자열을 Map에 저장
            fileMap.put(base64DataURL, selectID2);

            // List에 Map 추가
            fileMapList.add(fileMap);
            fileLists.add(selectID2 + ".png");

            System.out.println(fileMapList);
            System.out.println(fileLists);

//            return new ResponseEntity<>("/resources/upload/lfgimg/" + file.getOriginalFilename(), HttpStatus.OK);

        } catch (Exception e) {
            e.printStackTrace();
//            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
    }

    @PostMapping("/community/video/replyComments/insert")
    public String insertReplyComments(int re_b_pk, ReplyDTO replyDTO) {
        communityDAO.insertReplyComments(replyDTO);
        return "redirect:/community/video/detail?b_pk=" + re_b_pk;
    }

    @PostMapping("/community/lfg/replyComments/insert")
    public String insertLfgReplyComments(int re_b_pk, ReplyDTO replyDTO) {
        communityDAO.insertReplyComments(replyDTO);
        return "redirect:/community/lfg/detail?b_pk=" + re_b_pk;
    }

    @GetMapping("/community/replyComments/delete")
    public String deleteReplyComments(int re_pk, int b_pk) {
        communityDAO.deleteReplyComments(re_pk);
        return "redirect:/community/video/detail?b_pk=" + b_pk;
    }

    @GetMapping("/community/lfg/replyComments/delete")
    public String deleteLfgReplyComments(int re_pk, int b_pk) {
        communityDAO.deleteReplyComments(re_pk);
        return "redirect:/community/lfg/detail?b_pk=" + b_pk;
    }

}
