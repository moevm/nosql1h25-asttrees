package ru.sweetgit.backend.service;

import io.jsonwebtoken.*;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import jakarta.annotation.PostConstruct;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.stereotype.Service;
import ru.sweetgit.backend.dto.UserDetailsWithId;

import javax.crypto.SecretKey;
import java.time.Instant;
import java.util.Date;
import java.util.stream.Collectors;

@Service
public class JwtService {
    private static final Logger logger = LoggerFactory.getLogger(JwtService.class);

    private static final String AUTHORITIES = "authorities";

    @Value("${jwt.secret}")
    private String jwtSecretString;

    @Value("${jwt.expiration-ms}")
    private long jwtExpirationMs;

    private SecretKey jwtSecretKey;

    @PostConstruct
    public void init() {
        byte[] keyBytes = Decoders.BASE64.decode(jwtSecretString);
        this.jwtSecretKey = Keys.hmacShaKeyFor(keyBytes);
    }

    public String generateToken(Authentication authentication) {
        var userDetails = (UserDetailsWithId) authentication.getPrincipal();
        var userId = userDetails.getId();

        Instant now = Instant.now();
        Instant expiryDate = now.plusMillis(jwtExpirationMs);

        String authorities = authentication.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .collect(Collectors.joining(","));

        return Jwts.builder()
                .subject(userId)
                .claim(AUTHORITIES, authorities)
                .issuedAt(Date.from(now))
                .expiration(Date.from(expiryDate))
                .signWith(jwtSecretKey, Jwts.SIG.HS512)
                .compact();
    }

    public String extractUserId(String token) {
        Claims claims = Jwts.parser()
                .verifyWith(jwtSecretKey)
                .build()
                .parseSignedClaims(token)
                .getPayload();
        return claims.getSubject();
    }

    public boolean validateToken(String authToken) {
        try {
            Jwts.parser().verifyWith(jwtSecretKey).build().parseSignedClaims(authToken);
            return true;
        } catch (MalformedJwtException ex) {
            logger.error("Invalid JWT token: {}", ex.getMessage());
        } catch (ExpiredJwtException ex) {
            logger.error("Expired JWT token: {}", ex.getMessage());
        } catch (UnsupportedJwtException ex) {
            logger.error("Unsupported JWT token: {}", ex.getMessage());
        } catch (IllegalArgumentException ex) {
            logger.error("JWT claims string is empty: {}", ex.getMessage());
        } catch (io.jsonwebtoken.security.SignatureException ex) {
            logger.error("JWT signature validation failed: {}", ex.getMessage());
        }
        return false;
    }
}
