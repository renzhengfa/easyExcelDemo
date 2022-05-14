package com.re.bean;

import com.alibaba.excel.annotation.ExcelProperty;
import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;

@Data
@TableName("stu")
public class Stu {
    @TableId(type = IdType.AUTO)
    @ExcelProperty(value = "主键id", index = 0)
//    @ExcelIgnore //忽略这个字段
    private Long id;
    @ExcelProperty(value = "姓名", index = 1)
    private String name;
    @ExcelProperty(value = "性别", index = 2)
    private Integer sex;
    @ExcelProperty(value = "年龄", index = 3)
    private Integer age;
    @ExcelProperty(value = "班级", index = 4)
    private String classid;
    @ExcelProperty(value = "分数", index = 5)
    private Double score;
}