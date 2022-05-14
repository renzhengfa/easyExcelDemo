package com.re.service.impl;

import com.re.bean.Stu;
import com.re.mapper.StuMapper;
import com.re.service.StuService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class StuServiceImpl implements StuService {

    @Autowired
    private StuMapper stuMapper;

    @Override
    @Transactional //事务控制
    public void saveData(List<Stu> list) {
        stuMapper.saveData(list);
//        int i = 1/0;
    }
}
