package com.hkbu.commerce.controller;


import com.hkbu.commerce.entity.Vendor;
import com.hkbu.commerce.service.IVendorService;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

/**
 *
 * @author lmj
 * @since 2025-03-30
 */
@RestController
@RequestMapping("/commerce/vendor")
public class VendorController {

    @Autowired
    IVendorService vendorService;

    /**
     * View all vendor list
     * @return Business status code, supplier list and its corresponding product list in a map
     */
    @GetMapping("/getAllVendorsAndProducts")
    public Map<String,Object> getAllVendorsAndProducts() {

        Map<String,Object> map = new HashMap<>();
        Map<String,Object> result = vendorService.getAllVendorsAndProducts();
        map.put("code",200);
        map.put("message","success");
        map.put("data",result);
        return map;

    }

    /**
     * Add a vendor
     * @param vendor Map containing vendor names and geographical locations
     * @return Business status code, vendor information in a map
     */
    @PostMapping("/addVendor")
    public Map<String,Object> addVendor(@RequestBody Vendor vendor) {
        Map<String,Object> map = new HashMap<>();
        Vendor result = vendorService.addVendor(vendor);
        map.put("code",200);
        map.put("message","success");
        map.put("data",result);
        return map;
    }
}
