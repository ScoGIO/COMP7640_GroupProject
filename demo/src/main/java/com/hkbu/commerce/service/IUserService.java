package com.hkbu.commerce.service;

import com.hkbu.commerce.entity.User;
import com.baomidou.mybatisplus.extension.service.IService;

import java.util.Map;

/**
 * <p>
 *  服务类
 * </p>
 *
 * @author lmj
 * @since 2025-03-30
 */
public interface IUserService extends IService<User> {
    /**
     * 用户登录方法
     * @param userID 用户名
     * @param password 密码
     * @return 登录是否成功
     */
    Map<String,Object> login(Integer userID, String password);
}
