package com.delia.Gamified.Assignment.App.controller;

import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

import com.delia.Gamified.Assignment.App.model.*;
import com.delia.Gamified.Assignment.App.payload.request.LoginRequest;
import com.delia.Gamified.Assignment.App.payload.request.SignupRequest;
import com.delia.Gamified.Assignment.App.payload.jwtresponse.JwtResponse;
import com.delia.Gamified.Assignment.App.payload.jwtresponse.MessageResponse;
import com.delia.Gamified.Assignment.App.repository.RoleRepository;
import com.delia.Gamified.Assignment.App.repository.UserRepository;
import com.delia.Gamified.Assignment.App.service.implementations.UserDetailsImpl;
import com.delia.Gamified.Assignment.App.service.jwt.JwtUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.validation.Valid;

@CrossOrigin()
@RestController
@RequestMapping("/auth")
public class AuthController {
    @Autowired
    AuthenticationManager authenticationManager;

    @Autowired
    UserRepository userRepository;

    @Autowired
    RoleRepository roleRepository;

    @Autowired
    PasswordEncoder encoder;

    @Autowired
    JwtUtils jwtUtils;

    private final String TEACHER_KEY = "^DO4A%cD1^jZ29";
    @PostMapping("/signin")
    public ResponseEntity<?> authenticateUser(@Valid @RequestBody LoginRequest loginRequest) {

        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginRequest.getUsername(), loginRequest.getPassword()));

        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = jwtUtils.generateJwtToken(authentication);

        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        List<String> roles = userDetails.getAuthorities().stream()
                .map(item -> item.getAuthority())
                .collect(Collectors.toList());

        return ResponseEntity.ok(new JwtResponse(jwt,
                userDetails.getId(),
                userDetails.getUsername(),
                roles));
    }

    @PostMapping("/signup")
    public ResponseEntity<?> registerUser(@Valid @RequestBody SignupRequest signUpRequest) {
        if (userRepository.existsByUsername(signUpRequest.getUsername())) {
            return ResponseEntity
                    .badRequest()
                    .body(new MessageResponse("Error: Username is already taken!"));
        }
        if(signUpRequest.getRole().contains("teacher") && !signUpRequest.getTeacherKey().equals(TEACHER_KEY)){
            return ResponseEntity
                    .badRequest()
                    .body(new MessageResponse("Error: Teacher key is not valid!"));
        }
        User user;
        // Create new user's account
        if(signUpRequest.getRole().contains("teacher")){
            user = new Teacher(signUpRequest.getName(), signUpRequest.getLastName(), signUpRequest.getUsername(),
                    encoder.encode(signUpRequest.getPassword()));
        }else{
            user = new Student(signUpRequest.getName(), signUpRequest.getLastName(), signUpRequest.getUsername(),
                    encoder.encode(signUpRequest.getPassword()));
        }


        Set<String> strRoles = signUpRequest.getRole();
        Set<Role> roles = new HashSet<>();

        if (strRoles == null) {
            throw new RuntimeException("Error: Role is not found.");
        } else {
            strRoles.forEach(role -> {
                switch (role) {
                    case "teacher":
                        Role adminRole = roleRepository.findByName(ERole.ROLE_TEACHER)
                                .orElseThrow(() -> new RuntimeException("Error: Role is not found."));
                        roles.add(adminRole);

                        break;
                    case "student":
                        Role modRole = roleRepository.findByName(ERole.ROLE_STUDENT)
                                .orElseThrow(() -> new RuntimeException("Error: Role is not found."));
                        roles.add(modRole);

                        break;
                    default:
                        throw new RuntimeException("Error: Role is not found.");
                }
            });
        }

        user.setRoles(roles);
        userRepository.save(user);

        return ResponseEntity.ok(new MessageResponse("User registered successfully!"));
    }
}