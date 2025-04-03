package com.hkbu.commerce.service.impl;

import com.hkbu.commerce.entity.Transaction;
import com.hkbu.commerce.mapper.TransactionMapper;
import com.hkbu.commerce.service.ITransactionService;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import org.springframework.stereotype.Service;

/**
 * <p>
 *  服务实现类
 * </p>
 *
 * @author lmj
 * @since 2025-03-30
 */
@Service
public class TransactionServiceImpl extends ServiceImpl<TransactionMapper, Transaction> implements ITransactionService {

}
