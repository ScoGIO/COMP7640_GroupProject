package com.hkbu.commerce.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.hkbu.commerce.entity.Customer;
import com.hkbu.commerce.entity.User;
import com.hkbu.commerce.entity.Vendor;
import com.hkbu.commerce.mapper.CustomerMapper;
import com.hkbu.commerce.mapper.UserMapper;
import com.hkbu.commerce.mapper.VendorMapper;
import com.hkbu.commerce.service.IUserService;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * <p>
 * 服务实现类
 * </p>
 *
 * @author lmj
 * @since 2025-03-30
 */
@Service
public class UserServiceImpl extends ServiceImpl<UserMapper, User> implements IUserService {

    @Autowired
    UserMapper userMapper;

    @Autowired
    VendorMapper vendorMapper;

    @Autowired
    CustomerMapper customerMapper;

    public Map<String,Object> login(Integer userID, String password) {
        Map<String,Object> map = new HashMap<>();
        QueryWrapper<User> queryWrapper = new QueryWrapper<>();
        queryWrapper.eq("user_ID", userID)
                .eq("pwd", password);
        User user = userMapper.selectOne(queryWrapper);
        if(user==null){
            map.put("error_message", "Incorrect username or password");
            return map;
        }
        if(user.getType()==0){
            user.setPwd(null);
            map.put("user", user);
        } else if (user.getType()==1) {
            QueryWrapper<Customer> customerQueryWrapper = new QueryWrapper<>();
            customerQueryWrapper.eq("user_ID", userID);
            Customer customer = customerMapper.selectOne(customerQueryWrapper);
            map.put("user", customer);
        } else if (user.getType()==2) {
            QueryWrapper<Vendor> vendorQueryWrapper = new QueryWrapper<>();
            vendorQueryWrapper.eq("user_ID", userID);
            Vendor vendor = vendorMapper.selectOne(vendorQueryWrapper);
            map.put("user", vendor);
        }
        map.put("type", user.getType());
        return map;
    }
}
