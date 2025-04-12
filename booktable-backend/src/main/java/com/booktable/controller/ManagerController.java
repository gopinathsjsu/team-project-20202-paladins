package com.booktable.controller;

import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@SecurityRequirement(name = "bearerAuth")
@RestController
@RequestMapping("/api/manager")
public class ManagerController {

    @GetMapping("/listings")
    public String viewManagerListings() {
        return "Manager access to restaurant listings";
    }
}
