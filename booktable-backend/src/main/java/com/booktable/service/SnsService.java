package com.booktable.service;

import com.amazonaws.auth.AWSCredentials;
import com.amazonaws.auth.AWSStaticCredentialsProvider;
import com.amazonaws.auth.BasicAWSCredentials;
import com.amazonaws.regions.Regions;
import com.amazonaws.services.sns.AmazonSNS;
import com.amazonaws.services.sns.AmazonSNSClientBuilder;
import com.amazonaws.services.sns.model.PublishRequest;
import com.amazonaws.services.sns.model.PublishResult;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
public class SnsService {

    private final AmazonSNS snsClient;

    @Value("${aws.sns.topic.arn}")
    private String topicArn;

    public SnsService(@Value("${aws.accessKeyId}") String accessKeyId,
                      @Value("${aws.secretKey}") String secretKey,
                      @Value("${aws.region}") String region) {
        AWSCredentials awsCredentials = new BasicAWSCredentials(accessKeyId, secretKey);
        this.snsClient = AmazonSNSClientBuilder.standard()
                .withRegion(Regions.fromName(region))
                .withCredentials(new AWSStaticCredentialsProvider(awsCredentials))
                .build();
    }

    public String publishMessage(String subject, String message) {
        PublishRequest publishRequest = new PublishRequest(topicArn, message, subject);
        PublishResult result = snsClient.publish(publishRequest);
        System.out.println("Message published. Message ID: " + result.getMessageId());
        return result.getMessageId();
    }
}
