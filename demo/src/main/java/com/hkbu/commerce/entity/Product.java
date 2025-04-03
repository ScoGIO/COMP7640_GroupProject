package com.hkbu.commerce.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableName;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableField;
import java.io.Serializable;
import java.util.List;
import java.util.Map;

import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.experimental.Accessors;

/**
 * <p>
 * 
 * </p>
 *
 * @author lmj
 * @since 2025-03-30
 */
@Data
@EqualsAndHashCode(callSuper = false)
@Accessors(chain = true)
@TableName("Product")
public class Product implements Serializable {

    private static final long serialVersionUID = 1L;

    @TableId(value = "product_ID",type = IdType.AUTO)
    private Integer productId;

    private String productName;

    private Float price;

    private String tags;

    @TableField(exist = false)
    private List<String> tagsList;

    private Integer inventory;

    @TableField("vendor_ID")
    private Integer vendorId;

    @TableField(exist = false)
    private Vendor vendor;

}
