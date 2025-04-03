package com.hkbu.commerce.service;

import com.hkbu.commerce.entity.Product;
import com.baomidou.mybatisplus.extension.service.IService;

import java.util.List;

/**
 * <p>
 *  服务类
 * </p>
 *
 * @author lmj
 * @since 2025-03-30
 */
public interface IProductService extends IService<Product> {

    List<Product> getProductsByVendorId(Integer vendorId);

    Product addProduct(Product product);

    List<Product> getProductsByTags(List<String> tags);

}
