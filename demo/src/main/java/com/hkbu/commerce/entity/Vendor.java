package com.hkbu.commerce.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableName;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableField;
import java.io.Serializable;
import java.util.List;

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
@TableName("Vendor")
public class Vendor implements Serializable {

    private static final long serialVersionUID = 1L;

    @TableId(value = "vendor_ID",type = IdType.AUTO)
    private Integer vendorID;

    @TableField("user_ID")
    private Integer userID;

    private String vendorName;

    private Float customerFeedbackScore;

    private String geographicalPresence;

    @TableField(exist = false)
    private List<Product> products;

}
