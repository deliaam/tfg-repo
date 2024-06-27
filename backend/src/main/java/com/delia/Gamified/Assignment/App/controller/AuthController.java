package com.delia.Gamified.Assignment.App.controller;

import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;

import com.delia.Gamified.Assignment.App.model.*;
import com.delia.Gamified.Assignment.App.payload.request.LoginRequest;
import com.delia.Gamified.Assignment.App.payload.request.SignupRequest;
import com.delia.Gamified.Assignment.App.payload.jwtresponse.JwtResponse;
import com.delia.Gamified.Assignment.App.payload.jwtresponse.MessageResponse;
import com.delia.Gamified.Assignment.App.repository.RoleRepository;
import com.delia.Gamified.Assignment.App.repository.UserRepository;
import com.delia.Gamified.Assignment.App.service.implementations.UserDetailsImpl;
import com.delia.Gamified.Assignment.App.service.interfaces.UserService;
import com.delia.Gamified.Assignment.App.service.jwt.JwtUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.crossstore.ChangeSetPersister;
import org.springframework.http.ResponseEntity;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

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

    @Autowired
    private JavaMailSender mailSender;

    @Autowired
    private UserService userService;

    private final String TEACHER_KEY = "^DO4A%cD1^jZ29";
    @PostMapping("/signin")
    public ResponseEntity<?> authenticateUser(@Valid @RequestBody LoginRequest loginRequest) {
        User user;
        try {
            user = userService.findByUsername(loginRequest.getUsername());
        } catch (ChangeSetPersister.NotFoundException e) {
            return ResponseEntity.badRequest().body("El usuario no existe");
        }

        if (!user.isVerified()) {
            String token = UUID.randomUUID().toString();
            user.setVerificationToken(token);
            userRepository.save(user);

            sendVerificationEmail(user, token);

            return ResponseEntity.badRequest().body("El correo no está verificado. Se ha enviado un correo con el enlace de verificaión.");
        }

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

        String token = UUID.randomUUID().toString();
        user.setVerificationToken(token);

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
        sendVerificationEmail(user, token);
        return ResponseEntity.ok(new MessageResponse("User registered successfully!"));
    }

    @GetMapping("/verify")
    public ResponseEntity<?> verifyUser(@RequestParam("token") String token) {
        try {
            userService.verifyUser(token);
            return ResponseEntity.ok("Email verified successfully.");
        } catch (ChangeSetPersister.NotFoundException e) {
            return ResponseEntity.badRequest().body("Invalid or expired token");
        }
    }

    public void sendVerificationEmail(User user, String token) {
        String subject = "Verificar cuenta";
        String senderName = "UPV Etsinf";
        String mailContent = "Querido/a " + user.getName() + ",\n\n";
        mailContent += "Por favor, haga click en el siguiente enlace para confirmar su registro:\n\n";
        mailContent += "http://localhost:3000/verify?token=" + token + "\n\n";
        mailContent += "Gracias,\nUPV Etsinf";

        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(user.getUsername());
        message.setSubject(subject);
        message.setText(mailContent);
        message.setFrom(senderName + "<deli_delia19@hotmail.es>");

        mailSender.send(message);
    }
}