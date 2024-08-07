package com.climate.main.util;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import javax.crypto.spec.SecretKeySpec;
import java.util.Base64;
import java.util.Date;
import java.util.function.Function;

@Component
public class JwtUtil {
    @Value("${jwt.secretKey}")//.yml 파일에 있는 secret 변수 가져오기
    private String secretKeyString;

    private SecretKey secretKey;
    private static final long EXPIRATION_TIME = 86400000; // 1 day in milliseconds

    @PostConstruct
    public void init() {
        // 비밀 키를 SecretKey 객체로 변환
        this.secretKey = new SecretKeySpec(secretKeyString.getBytes(), SignatureAlgorithm.HS256.getJcaName());
    }

    //토큰 생성 함수
    public String generateToken(String subject) {
        return Jwts.builder()
                .setSubject(subject)
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + EXPIRATION_TIME))
                .signWith(secretKey, SignatureAlgorithm.HS256)
                .compact();
    }

    // 토큰 검증 함수
    private Claims extractAllClaims(String token) {
        return Jwts.parser()
                .setSigningKey(secretKey)
                .parseClaimsJws(token)
                .getBody();
    }

    //토큰 만료 확인 함수
    public boolean isTokenExpired(String token) {
        return extractClaim(token, Claims::getExpiration).before(new Date());
    }

    //토큰 유효 확인 함수
    public boolean validateToken(String token) {
        return !isTokenExpired(token);
    }

    public <T> T extractClaim(String token, Function<Claims, T> claimsResolver) {
        final Claims claims = extractAllClaims(token);
        return claimsResolver.apply(claims);
    }

    //토큰에서 아이디 가져오는 함수
    public String extractUserId(String token) {
        return extractClaim(token, Claims::getSubject);
    }
}