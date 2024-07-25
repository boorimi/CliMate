package com.climate.main.service;

import com.climate.main.dto.UserDTO;
import com.climate.main.mapper.UserMapper;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;

@Service
public class LoginDAO implements UserMapper{
    @Autowired
    private RestTemplate restTemplate;

    @Autowired
    private UserMapper userMapper;

    //google login api(load login page, get login account info)
    public JsonObject getAccessToken(String authorizationCode) {
        // Google OAuth 2.0 Token Endpoint
        String tokenUrl = "https://oauth2.googleapis.com/token";

        // Prepare request parameters
        MultiValueMap<String, String> body = new LinkedMultiValueMap<>();
        body.add("code", authorizationCode);
        body.add("client_id", "488561375875-5vbpvnis6ohc6bn4jvdd6ab76oe3jgdo.apps.googleusercontent.com");
        body.add("client_secret", "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");
        body.add("redirect_uri", "http://localhost:80/login/oauth2/code/google");
        body.add("grant_type", "authorization_code");

        // Prepare request headers
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);

        // Prepare the request entity
        HttpEntity<MultiValueMap<String, String>> requestEntity = new HttpEntity<>(body, headers);

        // Make the POST request
        ResponseEntity<String> response = restTemplate.exchange(tokenUrl, HttpMethod.POST, requestEntity, String.class);

        // Extract and return the access token from the response
        // For simplicity, return the entire response body

        System.out.println("check response => "+response.getBody());
        JsonParser parser = new JsonParser();
        return parser.parse(response.getBody()).getAsJsonObject();
    }
    public JsonObject getUserInfo(String accessToken) {
        // Google UserInfo Endpoint
        String userInfoUrl = "https://www.googleapis.com/oauth2/v3/userinfo";

        // Prepare request headers with the access token
        HttpHeaders headers = new HttpHeaders();
        headers.set("Authorization", "Bearer " + accessToken);

        // Prepare the request entity
        HttpEntity<String> requestEntity = new HttpEntity<>(headers);

        // Make the GET request to Google UserInfo endpoint
        ResponseEntity<String> response = restTemplate.exchange(userInfoUrl, HttpMethod.GET, requestEntity, String.class);

        JsonParser parser = new JsonParser(); // JsonParser를 사용하여 파싱
        // Return the user info response
        return parser.parse(response.getBody()).getAsJsonObject();
    }

    @Override
    public UserDTO getUserById(String u_id) {
        return userMapper.getUserById(u_id);
    }
}
