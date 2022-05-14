package com.re.listener;

import com.alibaba.excel.context.AnalysisContext;
import com.alibaba.excel.event.AnalysisEventListener;
import com.re.bean.Stu;
import com.re.dao.StuDao;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.ArrayList;
import java.util.List;

// 有个很重要的点 DemoDataListener 不能被spring管理，要每次读取excel都要new,然后里面用到spring可以构造方法传进去
public class StuSaveDataListener1 extends AnalysisEventListener<Stu> {
    private static final Logger LOGGER = LoggerFactory.getLogger(StuSaveDataListener1.class);
    /**
     * 每隔5条存储数据库，实际使用中可以3000条，然后清理list ，方便内存回收
     */
    private static final int BATCH_COUNT = 5;
    List<Stu> list = new ArrayList<Stu>();
    /**
     * 假设这个是一个DAO，当然有业务逻辑这个也可以是一个service。当然如果不用存储这个对象没用。
     */
    private StuDao stuDao;
    public StuSaveDataListener1() {
        // 这里是demo，所以随便new一个。实际使用如果到了spring,请使用下面的有参构造函数
        stuDao = new StuDao();
    }
    /**
     * 如果使用了spring,请使用这个构造方法。每次创建Listener的时候需要把spring管理的类传进来
     * @param stuDao
     */
    public StuSaveDataListener1(StuDao stuDao) {
        this.stuDao = stuDao;
    }

    /**
     * 读取数据会执行反射invoke方法
     * DemoData 列类型
     * AnalysisContext 分析上下文
     * @param data
     * @param context
     */
    @Override
    public void invoke(Stu data, AnalysisContext context) {
//        LOGGER.info("解析到一条数据:{}", JSON.toJSONString(data));
//        System.out.println("sout解析到一条数据:"+ JSON.toJSONString(data));
        list.add(data);
        // 达到BATCH_COUNT了，需要去存储一次数据库，防止数据几万条数据在内存，容易OOM
        if (list.size() >= BATCH_COUNT) {
            saveData();
            // 存储完成清理 list
            System.out.println(list);
            list.clear();
        }
    }
    /**
     * 所有数据解析完成了 都会来调用
     *
     * @param context
     */
    @Override
    public void doAfterAllAnalysed(AnalysisContext context) {
        // 这里也要保存数据，确保最后遗留的数据也存储到数据库
        saveData();
        LOGGER.info("所有数据解析完成！");
    }
    /**
     * 加上存储数据库
     */
    private void saveData() {
        LOGGER.info("{}条数据，开始存储数据库！", list.size());
        stuDao.save(list);
        LOGGER.info("存储数据库成功！");
    }
}
