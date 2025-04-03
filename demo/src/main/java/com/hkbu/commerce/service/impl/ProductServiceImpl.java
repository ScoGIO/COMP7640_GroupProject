package com.hkbu.commerce.service.impl;

import com.alibaba.fastjson.JSON;
import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.hkbu.commerce.entity.Product;
import com.hkbu.commerce.entity.Vendor;
import com.hkbu.commerce.mapper.ProductMapper;
import com.hkbu.commerce.mapper.VendorMapper;
import com.hkbu.commerce.service.IProductService;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * <p>
 *  服务实现类
 * </p>
 *
 * @author lmj
 * @since 2025-03-30
 */
@Service
public class ProductServiceImpl extends ServiceImpl<ProductMapper, Product> implements IProductService {

    @Autowired
    ProductMapper productMapper;

    @Autowired
    VendorMapper vendorMapper;
    @Override
    public List<Product> getProductsByVendorId(Integer vendorId) {
        QueryWrapper<Product> queryWrapper = new QueryWrapper<>();
        queryWrapper.eq("vendor_ID", vendorId);
        List<Product> products = productMapper.selectList(queryWrapper);
        for (Product product : products) {
            List<String> tagsList = JSON.parseArray(product.getTags(), String.class);
            product.setTagsList(tagsList);
        }
        return products;
    }

    @Override
    public Product addProduct(Product product) {
        productMapper.insert(product);
        List<String> tagsList = JSON.parseArray(product.getTags(), String.class);
        product.setTagsList(tagsList);
        return product;
    }

    @Override
    public List<Product> getProductsByTags(List<String> tags) {
        QueryWrapper<Product> queryWrapper = new QueryWrapper<>();
        for (String tag : tags) {
            queryWrapper.like("product_name", tag);
            queryWrapper.or().like("tags",tag);
        }
        List<Product> products = productMapper.selectList(queryWrapper);
        for (Product product : products) {
            List<String> tagsList = JSON.parseArray(product.getTags(), String.class);
            product.setTagsList(tagsList);
            Vendor vendor = vendorMapper.selectById(product.getVendorId());
            product.setVendor(vendor);
        }
        return products;
    }
}
