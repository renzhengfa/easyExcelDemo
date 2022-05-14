package com.re.test;

import com.alibaba.excel.EasyExcel;
import com.alibaba.excel.read.builder.ExcelReaderBuilder;
import com.re.bean.Stu;
import org.junit.Test;

import java.util.ArrayList;
import java.util.List;

public class Example {

    //写excel
    @Test
    public void simpleWrite() {
        // 写法1
        String fileName = "D:\\workspace\\easyExcelDemo\\src\\main\\java\\com\\re\\test\\" + "EasyTest.xlsx";
        // 这里 需要指定写用哪个class去写，然后写到第一个sheet，名字为模板 然后文件流会自动关闭
        // 如果这里想使用03 则 传入excelType参数即可
        // write(文件全路径名, 列类型)
        // sheet（sheet名）
        // doWrite（表数据）
        List<Stu> list = new ArrayList();
        for (int i = 0; i <= 10; i++){
            Stu stu = new Stu();
            stu.setId(20220311000l + i);
            stu.setName("name" + i);
            stu.setAge(i);
            stu.setClassid("3班");
            stu.setScore(90.5 + i);
            stu.setSex(i % 2);
            list.add(stu);
        }
        EasyExcel.write(fileName, Stu.class).sheet("模板").doWrite(list);
    }

    //读excel
    @Test
    public void simpleRead() {
        // 有个很重要的点 DemoDataListener 不能被spring管理，要每次读取excel都要new,然后里面用到spring可以构造方法传进去
        // 写法1：
        String fileName = "D:\\workspace\\easyExcelDemo\\src\\main\\java\\com\\re\\test\\" + "EasyTest.xlsx";
        // 这里 需要指定读用哪个class去读，然后读取第一个sheet 文件流会自动关闭
        // DemoDataListener为读取的逻辑
        //EasyExcel.read(fileName, DemoData.class, new DemoDataListener()).sheet().doRead();
        ExcelReaderBuilder read = EasyExcel.read(fileName);
        List list = read.sheet().doReadSync();
        //将list数据封装到对象
//        System.out.println(list);
        for (Object o : list) {
            System.out.println(o);
        }
    }
}
