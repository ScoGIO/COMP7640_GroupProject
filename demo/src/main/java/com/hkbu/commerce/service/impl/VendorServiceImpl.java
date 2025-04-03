package com.hkbu.commerce.service.impl;

import com.alibaba.fastjson.JSON;
import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.hkbu.commerce.entity.Product;
import com.hkbu.commerce.entity.User;
import com.hkbu.commerce.entity.Vendor;
import com.hkbu.commerce.mapper.ProductMapper;
import com.hkbu.commerce.mapper.UserMapper;
import com.hkbu.commerce.mapper.VendorMapper;
import com.hkbu.commerce.service.IProductService;
import com.hkbu.commerce.service.IVendorService;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import org.apache.ibatis.annotations.Delete;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

/**
 * <p>
 *  服务实现类
 * </p>
 *
 * @author lmj
 * @since 2025-03-30
 */
@Service
public class VendorServiceImpl extends ServiceImpl<VendorMapper, Vendor> implements IVendorService {

    @Autowired
    UserMapper userMapper;

    @Autowired
    VendorMapper vendorMapper;

    @Autowired
    ProductMapper productMapper;
    @Override
    public Map<String, Object> getAllVendorsAndProducts() {
        List<Vendor> vendors = this.list();
        for (Vendor vendor : vendors) {
            QueryWrapper<Product> productQueryWrapper = new QueryWrapper<>();
            productQueryWrapper.eq("vendor_ID", vendor.getVendorID());
            List<Product> products = productMapper.selectList(productQueryWrapper);
            for (Product product : products) {
                List<String> tagsList = JSON.parseArray(product.getTags(), String.class);
                product.setTagsList(tagsList);
            }
            vendor.setProducts(products);
        }
        return Map.of("vendors", vendors);
    }

    @Override
    public Vendor addVendor(Vendor vendor) {
        User user = new User();
        user.setPwd("123456");
        user.setType(2);

        userMapper.insert(user);
        vendor.setUserID(user.getUserID());
        vendor.setCustomerFeedbackScore(0f);

        vendorMapper.insert(vendor);

        return vendor;
    }
}
