package com.re.mapper;

import com.re.bean.Stu;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;

@Mapper
public interface StuMapper {

    //保存stu数据
    void saveData(List<Stu> list);

}
