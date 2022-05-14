package com.re.utils;

import org.springframework.context.ConfigurableApplicationContext;
import org.springframework.context.annotation.ComponentScan;

/**
 * 获取容器内的对象
 */
@ComponentScan
public class BeanUtil {

    public static ConfigurableApplicationContext applicationContext;

    public static <T> T getBean(Class<T> c){
        return applicationContext.getBean(c);
    }

}
