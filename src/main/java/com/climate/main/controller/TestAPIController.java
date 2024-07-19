package com.climate.main.controller;


import com.climate.main.dto.TestVO;
import com.climate.main.service.TestService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class TestAPIController {

    @Autowired
    private TestService testService;


    // RestController에서는 그냥 반환하면 json 자동 변환으로 응답됨.
    @GetMapping("test-json")
    public TestVO getTestJSON(int no){
        return testService.getTestJSON(no);
    }


}
