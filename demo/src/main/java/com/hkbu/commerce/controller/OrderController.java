package com.hkbu.commerce.controller;


import com.hkbu.commerce.entity.Order;
import com.hkbu.commerce.service.IOrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * @author lmj
 * @since 2025-03-30
 */
@RestController
@RequestMapping("/commerce/order")
public class OrderController {

    @Autowired
    IOrderService orderService;

    /**
     * Purchase products
     * @param order Order information, including customer ID, product information, and total price
     * @return Business status code, order information in a map
     */
    @PostMapping("/addOrder")
    public Map<String,Object> addOrder(@RequestBody Order order) {
        Map<String,Object> map = new HashMap<>();
        Order result = orderService.addOrder(order);
        map.put("code",200);
        map.put("message","success");
        map.put("data",result);
        return map;
    }

    /**
     * View historical orders
     * @param customerId
     * @return Business status code, historical orders of the specified user in a map
     */
    @GetMapping("/getOrdersByCustomerId")
    public Map<String,Object> getOrdersByCustomerId(@RequestParam Integer customerId) {
        Map<String,Object> map = new HashMap<>();
        List<Order> orders = orderService.getOrdersByCustomerId(customerId);
        map.put("code",200);
        map.put("message","success");
        map.put("data",orders);
        return map;
    }

    /**
     * Update order
     * @param order Updated order information
     * @return Business status code, updated order information in a map
     */
    @PostMapping("/updateOrder")
    public Map<String,Object> updateOrder(@RequestBody Order order) {
        Map<String,Object> map = new HashMap<>();
        Order result = orderService.updateOrder(order);
        map.put("code",200);
        map.put("message","success");
        map.put("data",result);
        return map;
    }

    /**
     * Delete Order
     * @param orderId Order ID of the order to be deleted
     * @return Business status code, updated order information(Status is deleted) in a map
     */
    @DeleteMapping("/deleteOrder")
    public Map<String,Object> deleteOrder(@RequestParam Integer orderId) {
        Map<String,Object> map = new HashMap<>();
        Order result = orderService.deleteOrder(orderId);
        map.put("code",200);
        map.put("message","success");
        map.put("data",result);
        return map;
    }
}
