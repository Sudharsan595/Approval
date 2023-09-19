package com.hfs.upload;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

@SpringBootApplication
@EnableJpaRepositories(basePackages = "com.hfs.upload.repository")
public class Cre080Application {

	public static void main(String[] args) {
		SpringApplication.run(Cre080Application.class, args);
	}

}
