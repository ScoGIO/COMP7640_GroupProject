package com.hkbu.commerce.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableName;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableField;
import java.io.Serializable;
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
@TableName("Customer")
public class Customer implements Serializable {

    private static final long serialVersionUID = 1L;

    @TableId(value = "customer_ID",type = IdType.AUTO)
    private Integer customerId;

    @TableField("user_ID")
    private Integer userId;

    private String userName;

    private Integer contactNumber;


}
