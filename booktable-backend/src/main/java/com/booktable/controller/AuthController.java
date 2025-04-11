package com.booktable.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;


@RestController
public class AuthController {

    @GetMapping("/api/hello2")
    public String sayHello() {
        return "Hello from BookTable!";
    }
}