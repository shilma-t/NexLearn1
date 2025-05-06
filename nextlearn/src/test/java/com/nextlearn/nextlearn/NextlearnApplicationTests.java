package com.nextlearn.nextlearn;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.context.annotation.Import;
import com.nextlearn.nextlearn.config.TestSecurityConfig;

@SpringBootTest
@Import(TestSecurityConfig.class)
class NextlearnApplicationTests {

	@Test
	void contextLoads() {
	}

}
