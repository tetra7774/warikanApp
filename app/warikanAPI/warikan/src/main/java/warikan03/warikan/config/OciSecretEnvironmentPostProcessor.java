package warikan03.warikan.config;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.env.EnvironmentPostProcessor;
import org.springframework.core.env.ConfigurableEnvironment;

import com.oracle.bmc.ConfigFileReader;
import com.oracle.bmc.auth.ConfigFileAuthenticationDetailsProvider;
import com.oracle.bmc.auth.InstancePrincipalsAuthenticationDetailsProvider;
import com.oracle.bmc.secrets.SecretsClient;
import com.oracle.bmc.secrets.requests.GetSecretBundleRequest;
import com.oracle.bmc.secrets.responses.GetSecretBundleResponse;
import com.oracle.bmc.secrets.model.Base64SecretBundleContentDetails;
import com.oracle.bmc.secrets.model.SecretBundle;
import com.oracle.bmc.secrets.model.SecretBundleContentDetails;

import java.util.Base64;

public class OciSecretEnvironmentPostProcessor implements EnvironmentPostProcessor {

    @Override
    public void postProcessEnvironment(ConfigurableEnvironment env, SpringApplication application) {

        System.out.println("==========OCI Secret loader START==========");

        String secretId = System.getenv("SECRET_ID");

        if (secretId == null) {
            System.out.println("SECRET_ID not found");
            String localMongoUri = System.getenv("MONGO_URI"); //tmp

            if(localMongoUri !=null){
                System.out.println("Using local MongoDB URI: " + localMongoUri);
                env.getSystemProperties().put("spring.data.mongodb.uri", localMongoUri);
            }

            return;
        }

        try {

            final InstancePrincipalsAuthenticationDetailsProvider provider = InstancePrincipalsAuthenticationDetailsProvider
                    .builder().build();

            try (SecretsClient client = SecretsClient.builder().build(provider)) {

                client.setRegion(com.oracle.bmc.Region.AP_OSAKA_1);

                GetSecretBundleRequest request = GetSecretBundleRequest.builder()
                        .secretId(secretId)
                        .build();

                // localでの開発環境でOCI Secretを使用する場合は、以下のコードを使用して認証プロバイダを作成してください。
                // ConfigFileReader.ConfigFile configFile = ConfigFileReader.parseDefault();
                // ConfigFileAuthenticationDetailsProvider provider = new
                // ConfigFileAuthenticationDetailsProvider(configFile);
                String base64Secret;
                try {
                    GetSecretBundleResponse response = client.getSecretBundle(request);

                    SecretBundle secretBundle = response.getSecretBundle();

                    SecretBundleContentDetails contentDetails = secretBundle.getSecretBundleContent();

                    Base64SecretBundleContentDetails base64Content = (Base64SecretBundleContentDetails) contentDetails;

                    base64Secret = base64Content.getContent();
                } catch (Exception e) {
                    System.out.println("Error creating ConfigFileAuthenticationDetailsProvider: " + e.getMessage());
                    throw e;
                }

                String uri = new String(Base64.getDecoder().decode(base64Secret));

                System.out.println("Mongo URI from OCI: " + uri);

                env.getSystemProperties().put("spring.data.mongodb.uri", uri);

                System.out.println("==========OCI Secret loaded==========");
            }

        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }
}