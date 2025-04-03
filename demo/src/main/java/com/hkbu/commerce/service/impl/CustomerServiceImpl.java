package com.hkbu.commerce.service.impl;

import com.hkbu.commerce.entity.Customer;
import com.hkbu.commerce.mapper.CustomerMapper;
import com.hkbu.commerce.service.ICustomerService;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import org.springframework.stereotype.Service;

/**
 * <p>
 *  服务实现类
 * </p>
 *
 * @author lmj
 * @since 2025-03-30
 */
@Service
public class CustomerServiceImpl extends ServiceImpl<CustomerMapper, Customer> implements ICustomerService {

}
