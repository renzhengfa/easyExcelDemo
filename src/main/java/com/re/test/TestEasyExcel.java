package com.re.test;


import com.alibaba.excel.EasyExcel;
import com.re.bean.Stu;
import com.re.listener.StuSaveDataListener;
import com.re.listener.StuSaveDataListener1;
import org.junit.Test;

import java.util.ArrayList;
import java.util.List;

public class TestEasyExcel {
    String PATH = "D:\\workspace\\easyExcelDemo\\src\\main\\java\\com\\re\\test\\";
    /**
     * 生成数据
     * @return
     */
    private List<Stu> data() {
        List<Stu> list = new ArrayList<Stu>();
        for (int i = 0; i <= 10; i++){
            Stu stu = new Stu();
            stu.setId(20220311000l + i);
            stu.setName("name= " + i);
            stu.setAge(i);
            stu.setClassid("3班");
            stu.setScore(90.5 + i);
            stu.setSex(i % 2);
            list.add(stu);
        }
        return list;
    }

    /**
     * 简单的写
     * 根据list，写入excel
     */
    @Test
    public void simpleWrite() {
        // 写法1
        String fileName = PATH+"EasyTest.xlsx";
        // 这里 需要指定写用哪个class去写，然后写到第一个sheet，名字为模板 然后文件流会自动关闭
        // 如果这里想使用03 则 传入excelType参数即可
        // write(文件全路径名, 列类型)
        // sheet（sheet名）
        // doWrite（表数据）
        EasyExcel.write(fileName, Stu.class).sheet("模板").doWrite(data());

        /*
        // 写法2
        fileName = TestFileUtil.getPath() + "simpleWrite" + System.currentTimeMillis() + ".xlsx";
        // 这里 需要指定写用哪个class去写
        ExcelWriter excelWriter = EasyExcel.write(fileName, DemoData.class).build();
        WriteSheet writeSheet = EasyExcel.writerSheet("模板").build();
        excelWriter.write(data(), writeSheet);
        // 千万别忘记finish 会帮忙关闭流
        excelWriter.finish();
        */
    }

    /**
     * 最简单的读
     * <p>1. 创建excel对应的实体对象 参照DemoData
     * <p>2. 由于默认一行行的读取excel，所以需要创建excel一行一行的回调监听器，参照DemoDataListener
     * <p>3. 直接读即可
     */
    @Test
    public void simpleRead() {
        // 有个很重要的点 DemoDataListener 不能被spring管理，要每次读取excel都要new,然后里面用到spring可以构造方法传进去
        // 写法1：
        String fileName = PATH + "EasyTest.xlsx";
        // 这里 需要指定读用哪个class去读，然后读取第一个sheet 文件流会自动关闭
        // DemoDataListener为读取的逻辑
        EasyExcel.read(fileName, Stu.class, new StuSaveDataListener1()).sheet().doRead();
        /*
        // 写法2：
        fileName = TestFileUtil.getPath() + "demo" + File.separator + "demo.xlsx";
        ExcelReader excelReader = EasyExcel.read(fileName, DemoData.class, new DemoDataListener()).build();
        ReadSheet readSheet = EasyExcel.readSheet(0).build();
        excelReader.read(readSheet);
        // 这里千万别忘记关闭，读的时候会创建临时文件，到时磁盘会崩的
        excelReader.finish();
        */
    }
}
