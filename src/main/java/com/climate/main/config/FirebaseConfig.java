package com.climate.main.config;

import com.google.auth.oauth2.GoogleCredentials;
import com.google.cloud.storage.Storage;
import com.google.cloud.storage.StorageOptions;
import jakarta.annotation.PostConstruct;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.io.ClassPathResource;

import java.io.FileInputStream;

@Configuration
public class FirebaseConfig {

    private Storage storage;

    @PostConstruct
    public void init(){
        try{
            ClassPathResource serviceAccount = new ClassPathResource("firebaseAccountKey.json");
            storage = StorageOptions.newBuilder().
                    setCredentials(GoogleCredentials.fromStream(serviceAccount.getInputStream())).
                    setProjectId("climate-4e4fe").build().getService();
        }catch (Exception e){
            e.printStackTrace();
        }
    }
    @Bean
    public Storage firebaseStorage() {
        return storage;
    }
}
