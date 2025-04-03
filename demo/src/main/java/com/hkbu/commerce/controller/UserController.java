package com.hkbu.commerce.controller;

import com.hkbu.commerce.service.IUserService;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

import java.util.HashMap;
import java.util.Map;

/**
 *
 * @author lmj
 * @since 2025-03-30
 */
@RestController
@RequestMapping("/commerce/user")
public class UserController {

    @Autowired
    IUserService userService;

    /**
     * Login interface
     * @param loginInfo Map containing userId and password
     * @return Login results, including business status code and user information in a map
     */
    @PostMapping("/login")
    public Map<String,Object> login(@RequestBody Map<String, String> loginInfo,HttpServletResponse response) {
        response.setHeader("Access-Control-Allow-Origin", "*");
        response.setHeader("Access-Control-Allow-Methods", "POST, GET, OPTIONS, DELETE");
        response.setHeader("Access-Control-Allow-Headers", "5050");
        String userID = loginInfo.get("userID");
        String password = loginInfo.get("password");
        Map<String,Object> map = new HashMap<>();
        Map<String,Object> result = userService.login(Integer.valueOf(userID), password);
        if(result.containsKey("type")){
            map.put("code",200);
            map.put("message","success");
            map.put("data",result);
        }else {
            map.put("code",400);
            map.put("message",result.get("error_message"));
        }
        return map;

    }
}
