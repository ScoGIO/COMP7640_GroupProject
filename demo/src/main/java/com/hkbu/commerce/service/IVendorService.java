package com.hkbu.commerce.service;

import com.hkbu.commerce.entity.Vendor;
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
public interface IVendorService extends IService<Vendor> {

    Map<String,Object> getAllVendorsAndProducts();

    Vendor addVendor(Vendor vendor);

}
