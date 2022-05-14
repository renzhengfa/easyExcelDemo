package com.re.controller;

import com.alibaba.excel.EasyExcel;
import com.alibaba.excel.read.builder.ExcelReaderBuilder;
import com.re.bean.Stu;
import com.re.mapper.StuMapper;
import com.re.service.StuService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import java.io.FileInputStream;
import java.io.IOException;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;

@RestController
@RequestMapping("/stu")
public class StuController {

    @Autowired
    private StuService StuService;

    /**
     * 保存数据
     * @return
     */
    @RequestMapping("/saveData")
    public List<Stu> saveStu(MultipartFile multipartFile) {
        FileInputStream fileInputStream = null;
        try {
            fileInputStream = (FileInputStream) multipartFile.getInputStream();
        } catch (IOException e) {
            e.printStackTrace();
        }
        ExcelReaderBuilder read = EasyExcel.read(fileInputStream);
        List<Object> objects = read.doReadAllSync();
        //用于保存学生对象的集合
        List<Stu> list = new ArrayList<Stu>();
        if (objects != null){
            for (Object object : objects) {
                Stu stu = new Stu();
                //实际上读取出来的每一个字段的数据都保存到LinkedHashMap里面
                LinkedHashMap map = (LinkedHashMap) object;
                System.out.println(map);//{0=20220311010, 1=name= 10, 2=0, 3=10, 4=3班, 5=100.5}
                //将LinkedHashMap里面的值取出来封装到对象
                String id = (String) map.get(0);
                String name = (String) map.get(1);
                String sex = (String) map.get(2);
                String age = (String) map.get(3);
                String classid = (String) map.get(4);
                String score = (String) map.get(5);
                //中间可以对数据进行业务需求上的校验
                stu.setId(Long.parseLong(id));//Long
                stu.setName(name);
                stu.setSex(Integer.parseInt(sex));//Integer
                stu.setAge(Integer.parseInt(age));
                stu.setClassid(classid);
                stu.setScore(Double.parseDouble(score));
                list.add(stu);
            }
        }
        StuService.saveData(list);
        return list;
    }
}
