package com.hkbu.commerce.controller;


import com.hkbu.commerce.entity.Product;
import com.hkbu.commerce.service.IProductService;
import jakarta.servlet.http.HttpServletResponse;
import org.apache.ibatis.annotations.Param;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * <p>
 *  前端控制器
 * </p>
 *
 * @author lmj
 * @since 2025-03-30
 */
@RestController
@RequestMapping("/commerce/product")
public class ProductController {

    @Autowired
    IProductService productService;

    /**
     * View products from specific vendor
     * @param vendorId
     * @return Business status code, list of products from specific vendor in a map
     */
    @PostMapping("/getProductsByVendorId")
    public Map<String,Object> getProductsByVendorId(@Param("vendorId") Integer vendorId) {
        Map<String,Object> map = new HashMap<>();
        List<Product> result = productService.getProductsByVendorId(vendorId);
        map.put("code",200);
        map.put("message","success");
        map.put("data",result);
        return map;
    }

    /**
     * Add product
     * @param product Product information, including product name, price, tags, inventory, and their corresponding vendorID
     * @return Business status code, product information in a map
     */
    @PostMapping("/addProduct")
    public Map<String,Object> addProduct(@RequestBody Product product) {
        Map<String,Object> map = new HashMap<>();
        Product result = productService.addProduct(product);
        map.put("code",200);
        map.put("message","success");
        map.put("data",result);
        return map;
    }

    /**
     * Search for products based on tags
     * @param tags List of Product Tags
     * @return Business status code, list of eligible products in a map
     */
    @PostMapping("/getProductsByTags")
    public Map<String,Object> getProductsByTags(@RequestBody List<String> tags) {
        Map<String,Object> map = new HashMap<>();
        List<Product> result = productService.getProductsByTags(tags);
        map.put("code",200);
        map.put("message","success");
        map.put("data",result);
        return map;
    }
}
