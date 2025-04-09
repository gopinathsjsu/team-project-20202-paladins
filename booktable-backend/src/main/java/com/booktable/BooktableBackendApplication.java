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

	@Bean
	public CommandLineRunner testMongoConnection(MongoTemplate mongoTemplate) {
		return args -> {
			System.out.println("Testing MongoDB Connection...");

			// Check if a test collection exists; if not, insert a dummy document.
			if (!mongoTemplate.collectionExists("testCollection")) {
				System.out.println("No 'testCollection' found. Inserting dummy document...");
				mongoTemplate.insert(new Dummy("Hello, MongoDB!"), "testCollection");
			}

			// List and print all collections in the current database.
			mongoTemplate.getDb().listCollectionNames()
					.forEach(collection -> System.out.println("Found collection: " + collection));
		};
	}

	// Simple dummy class to insert as a document.
	public static class Dummy {
		private String message;

		public Dummy() {
			// Default constructor for deserialization
		}

		public Dummy(String message) {
			this.message = message;
		}

		public String getMessage() {
			return message;
		}

		public void setMessage(String message) {
			this.message = message;
		}
	}
}
