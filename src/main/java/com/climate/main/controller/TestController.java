package com.climate.main.controller;


import com.climate.main.service.TestService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class TestController {

    @Autowired
    private TestService testService;

    @GetMapping("/tests")
    public String tests(Model model) {
        model.addAttribute("tests", testService.getTests());
        return "tests";
    }

}
