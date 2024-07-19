package com.climate.main.service;

import com.climate.main.dto.TestVO;
import com.climate.main.mapper.TestMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TestService {

    @Autowired
    private TestMapper testMapper;


    public List<TestVO> getTests() {
        return testMapper.getTests();

    }

    // 비동기용 (json 응답)
    public TestVO getTestJSON(int no) {
        return testMapper.getTestJSON(no);
    }
}
