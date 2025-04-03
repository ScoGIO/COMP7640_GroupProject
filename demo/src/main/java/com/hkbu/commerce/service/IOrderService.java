package com.hkbu.commerce.service;

import com.hkbu.commerce.entity.Order;
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
public interface IOrderService extends IService<Order> {
    Order addOrder(Order order);

    List<Order> getOrdersByCustomerId(Integer customerId);

    Order updateOrder(Order order);

    Order deleteOrder(Integer orderId);
}
