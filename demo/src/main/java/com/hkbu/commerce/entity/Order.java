package com.hkbu.commerce.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableName;
import com.baomidou.mybatisplus.annotation.TableId;

import java.time.LocalDateTime;
import java.time.LocalTime;
import com.baomidou.mybatisplus.annotation.TableField;
import java.io.Serializable;
import java.util.Date;
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
@TableName("`Order`")
public class Order implements Serializable {

    private static final long serialVersionUID = 1L;

    @TableId(value = "order_ID",type = IdType.AUTO)
    private Integer orderId;

    @TableField("customer_ID")
    private Integer customerId;

    private Float totalPrice;

    private LocalDateTime orderTime;

    @TableField(exist = false)
    private List<Transaction> transactions;

}
