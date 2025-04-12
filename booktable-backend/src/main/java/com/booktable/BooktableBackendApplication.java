package com.booktable;

import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.data.mongodb.core.MongoTemplate;

@SpringBootApplication
public class BooktableBackendApplication {

	public static void main(String[] args) {
		SpringApplication.run(BooktableBackendApplication.class, args);
	}
}
