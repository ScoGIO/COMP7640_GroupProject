package com.hkbu.commerce.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.hkbu.commerce.entity.Order;
import com.hkbu.commerce.entity.Product;
import com.hkbu.commerce.entity.Transaction;
import com.hkbu.commerce.mapper.OrderMapper;
import com.hkbu.commerce.mapper.ProductMapper;
import com.hkbu.commerce.mapper.TransactionMapper;
import com.hkbu.commerce.service.IOrderService;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;

/**
 * <p>
 *  服务实现类
 * </p>
 *
 * @author lmj
 * @since 2025-03-30
 */
@Service
public class OrderServiceImpl extends ServiceImpl<OrderMapper, Order> implements IOrderService {

    @Autowired
    OrderMapper orderMapper;

    @Autowired
    TransactionMapper transactionMapper;

    @Autowired
    ProductMapper productMapper;

    @Override
    public Order addOrder(Order order) {
        order.setOrderTime(LocalDateTime.now());
        orderMapper.insert(order);
        for (Transaction transaction : order.getTransactions()) {
            transaction.setOrderId(order.getOrderId());
            Product product = productMapper.selectById(transaction.getProductId());
            transaction.setTransactionPrice(product.getPrice()*transaction.getCount());
            transaction.setStatus(0);
            transactionMapper.insert(transaction);
        }
        return order;
    }

    @Override
    public List<Order> getOrdersByCustomerId(Integer customerId) {
        QueryWrapper<Order> queryWrapper = new QueryWrapper<>();
        queryWrapper.eq("customer_ID", customerId);
        List<Order> orders = orderMapper.selectList(queryWrapper);
        for (Order order : orders) {
            QueryWrapper<Transaction> transactionQueryWrapper = new QueryWrapper<>();
            transactionQueryWrapper.eq("order_ID", order.getOrderId());
            List<Transaction> transactions = transactionMapper.selectList(transactionQueryWrapper);
            order.setTransactions(transactions);
        }
        return orders;
    }

    @Override
    public Order updateOrder(Order order) {
        orderMapper.updateById(order);
        QueryWrapper<Transaction> transactionQueryWrapper = new QueryWrapper<>();
        transactionQueryWrapper.eq("order_ID", order.getOrderId());
        List<Transaction> transactions = transactionMapper.selectList(transactionQueryWrapper);
        for (Transaction transaction : transactions) {
            transactionMapper.deleteById(transaction.getTransactionId());
        }
        for (Transaction transaction : order.getTransactions()) {
            transaction.setOrderId(order.getOrderId());
            Product product = productMapper.selectById(transaction.getProductId());
            transaction.setTransactionPrice(product.getPrice()*transaction.getCount());
            transactionMapper.insert(transaction);
        }
        Order order1 = orderMapper.selectById(order.getOrderId());
        QueryWrapper<Transaction> transactionQueryWrapper1 = new QueryWrapper<>();
        transactionQueryWrapper1.eq("order_ID", order1.getOrderId());
        List<Transaction> transactions1 = transactionMapper.selectList(transactionQueryWrapper1);
        order1.setTransactions(transactions1);
        return order1;
    }

    @Override
    public Order deleteOrder(Integer orderId) {
        QueryWrapper<Transaction> transactionQueryWrapper = new QueryWrapper<>();
        transactionQueryWrapper.eq("order_ID", orderId);
        List<Transaction> transactions = transactionMapper.selectList(transactionQueryWrapper);
        for (Transaction transaction : transactions) {
            transaction.setStatus(2);
            transactionMapper.updateById(transaction);
        }
        Order order = orderMapper.selectById(orderId);
        QueryWrapper<Transaction> transactionQueryWrapper1 = new QueryWrapper<>();
        transactionQueryWrapper1.eq("order_ID", orderId);
        List<Transaction> transactions1 = transactionMapper.selectList(transactionQueryWrapper1);
        order.setTransactions(transactions1);
        return order;
    }
}
