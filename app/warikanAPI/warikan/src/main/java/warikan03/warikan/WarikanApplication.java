package warikan03.warikan;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.mongodb.repository.config.EnableMongoRepositories;

@SpringBootApplication
@EnableMongoRepositories(basePackages = "warikan03.warikan.repository")
public class WarikanApplication {

	public static void main(String[] args) {
		SpringApplication.run(WarikanApplication.class, args);
		
	}

}
