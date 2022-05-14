package com.re;

import com.re.utils.BeanUtil;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.ConfigurableApplicationContext;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.transaction.annotation.EnableTransactionManagement;

@SpringBootApplication
@EnableTransactionManagement
public class ApplicationStart /*extends WebMvcConfigurationSupport*/ {

    public static void main(String[] args) {
        ConfigurableApplicationContext configurableApplicationContext = SpringApplication.run(ApplicationStart.class, args);
        BeanUtil.applicationContext = configurableApplicationContext;
    }

    // 配置静态资源文件路径
//    @Override
//    protected void addResourceHandlers(ResourceHandlerRegistry registry) {
//        registry.addResourceHandler("/static/**")
//                .addResourceLocations(ResourceUtils.CLASSPATH_URL_PREFIX + "/");
//        super.addResourceHandlers(registry);
//    }
}
