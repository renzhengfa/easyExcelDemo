package com.re.service;

import com.re.bean.Stu;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public interface StuService {

    //保存stu数据
    void saveData(List<Stu> list);
}
